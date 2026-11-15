# The Kitchen (and $COOKED)

https://cookedmeme.fyi is **The Kitchen**: a no-code token maker for BlockDAG (chain 1404). Name, ticker and
supply, one transaction, and a plain fixed-supply token (no owner, no tax, no mint) lands in the creator's
wallet for 5,000 BDAG, ready to go onto Reef. The contract is `KitchenFactory` in the Reef repo
(`contracts/contracts/kitchen/`). Front page: `index.html`; its factory address goes in `CFG.factory` once
deployed. Local testing: `?factory=0x…&rpc=http://127.0.0.1:8545` (localhost only).

## The original $COOKED (`/cooked/`)

The launch page for $COOKED, a fair-launch meme token on BlockDAG (chain 1404).

- Everyone buys from the same bonding curve ("the oven"). No presale, no team allocation, no owner.
- When 800M COOKED are sold, anyone can press **Serve it**: the BDAG raised and the last 200M COOKED go into a Reef pool at the curve's final price, and the LP tokens are burned.
- 1% fee on curve buys and sells. Not audited. It's a meme: it can go to zero.

Single static page (`index.html`), no build step. The curve address goes in `CONFIG.curve` once deployed.

Built by Undercurrent Works.
