// Independent check that the code on chain 1404 is the published source.
//   npm i solc@0.8.24 ethers@6 && node verify.js
// Compiles CookedCurve.standard-input.json (solc 0.8.24, berlin, optimizer 200), downloads the
// deployed code, blanks out the "immutable" slots (values the constructor wrote into the code,
// such as the fee wallet and the token address) on both sides, and compares the rest.
// The blanked slots are then read back and printed, so you can check them against the README.
const fs = require("fs"), path = require("path");
const solc = require("solc");
const { JsonRpcProvider, getAddress, hexlify } = require("ethers");

const TARGETS = {
  CookedCurve: "0xD8a25883dd2576cB7eE7803e23f0309F56bAbA2B",
  CookedToken: "0xd95C548B144682f4EF49728944505D8506861B1B",
};
const RPCS = ["https://rpc.capedag.com", "https://rpc.dagcore.net", "https://rpc.bdagexplorer.com", "https://rpc.england.bdag-us.org"];

function compile() {
  const input = fs.readFileSync(path.join(__dirname, "CookedCurve.standard-input.json"), "utf8");
  const out = JSON.parse(solc.compile(input));
  const errs = (out.errors || []).filter((e) => e.severity === "error");
  if (errs.length) throw new Error(errs.map((e) => e.formattedMessage).join("\n"));
  return out.contracts["CookedCurve.Flat.sol"];
}

// Compare compiled vs deployed runtime code, ignoring immutable slots. Returns { match, immutables }.
function compare(deployedHex, compiled) {
  const code = Buffer.from(deployedHex.replace(/^0x/, ""), "hex");
  const mine = Buffer.from(compiled.object, "hex");
  if (code.length !== mine.length) return { match: false, why: `length ${code.length} on chain vs ${mine.length} compiled`, immutables: [] };
  const immutables = [];
  for (const [id, refs] of Object.entries(compiled.immutableReferences || {})) {
    const vals = new Set();
    for (const { start, length } of refs) {
      vals.add(hexlify(code.subarray(start, start + length)));
      code.fill(0, start, start + length); mine.fill(0, start, start + length);
    }
    immutables.push({ id, values: [...vals] });
  }
  // The trailing metadata hash is part of the code, so it is compared too.
  return { match: code.equals(mine), why: "code differs outside the immutable slots", immutables };
}

async function main() {
  if (process.argv.includes("--selftest")) return selftest();
  const contracts = compile();
  let provider, err;
  for (const url of RPCS) { try { provider = new JsonRpcProvider(url, 1404, { staticNetwork: true }); await provider.getBlockNumber(); break; } catch (e) { err = e; provider = null; } }
  if (!provider) throw new Error("No RPC answered: " + err);
  let ok = true;
  for (const [name, addr] of Object.entries(TARGETS)) {
    const r = compare(await provider.getCode(addr), contracts[name].evm.deployedBytecode);
    console.log(`${name} ${addr}: ${r.match ? "MATCH" : "NO MATCH (" + r.why + ")"}`);
    for (const im of r.immutables) console.log("   immutable", im.id, "=", im.values.map((v) => (v.length === 66 ? v.replace(/^0x0{24}/, "0x") : v)).join(", "));
    ok = ok && r.match;
  }
  process.exit(ok ? 0 : 1);
}

// Offline sanity check: the comparison ignores immutable slots but catches any other change.
function selftest() {
  const c = compile().CookedCurve.evm.deployedBytecode;
  const fake = Buffer.from(c.object, "hex");
  for (const refs of Object.values(c.immutableReferences)) for (const { start, length } of refs) fake.fill(0xab, start, start + length);
  const good = compare("0x" + fake.toString("hex"), c);
  fake[10] ^= 1;
  const bad = compare("0x" + fake.toString("hex"), c);
  console.log("filled immutables ->", good.match ? "MATCH (expected)" : "no match (WRONG)");
  console.log("one changed byte  ->", bad.match ? "match (WRONG)" : "NO MATCH (expected)");
  process.exit(good.match && !bad.match ? 0 : 1);
}
main().catch((e) => { console.error(e.message || e); process.exit(2); });
