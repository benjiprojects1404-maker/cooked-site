# $COOKED contracts (live on BlockDAG, chain 1404)

| Contract | Address |
|---|---|
| CookedCurve (the oven) | `0xD8a25883dd2576cB7eE7803e23f0309F56bAbA2B` |
| CookedToken (COOKED) | `0xd95C548B144682f4EF49728944505D8506861B1B` |
| Reef pool (COOKED/WBDAG) | `0x50F4171Eeb7FbB09257264556343d66f089Fe57C` |

Deployed in transaction `0x6333f34b95ee3a7792dd7eb5b81bff638a019ad5bed216cc61e72a67fee02e0c` (block 23031381).

## Files
- `CookedCurve.sol`, `CookedToken.sol`: readable source.
- `CookedCurve.Flat.sol`: the single flattened file that was compiled and deployed.
- `CookedCurve.standard-input.json`: the exact compiler input.

## Check it yourself
Compile `CookedCurve.standard-input.json` with **solc 0.8.24** (optimizer on, 200 runs, EVM `berlin`). The `CookedCurve` deployed bytecode matches the code at the curve address, and the creation code matches the deploy transaction's input (plus the ABI-encoded constructor arguments below).

Constructor arguments: `Cooked`, `COOKED`, Reef factory `0x9603042044b6B1A1637c508F731ba01219142239`, WBDAG `0x62ba5c4F067989a7f6644488C875bEa69Bfa1FBA`, fee wallet `0x1b8985f6Fe74C738452b41bb3F445D7e0c62bF17`, fee `100` (1%), target `10000000000000000000000` (10,000 BDAG), start `1791464400` (8 Oct 2026, 13:00 UTC).

No owner, no admin functions: nothing above can be changed after deployment.

## Verify it with one command
```
npm i solc@0.8.24 ethers@6
node verify.js
```
`verify.js` compiles the published source, downloads the deployed code from chain 1404 and compares them. The values the constructor wrote into the code (the token, pool, WBDAG and fee wallet addresses, the fee, the target) are blanked on both sides for the comparison and printed, so you can check them against the table above. `node verify.js --selftest` runs a no-network check that the comparison catches a one-byte change.
