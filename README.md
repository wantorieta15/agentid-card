# AgentID Card — Binance Agent ID Hackathon 2026

On-chain profile directory for Binance Agent ID holders (`name.ai`).

**Status: BUILT, NOT DEPLOYED.** Contract compiles clean (solc 0.8.24, 0 errors,
0 warnings). Deploy needs mas Wan's approval (parent agent asks him) — see
`SUBMISSION.md` for the deploy + submit checklist.

## The problem

100.000+ Agent IDs have been claimed, but there is no public place where an
Agent ID holder can say who they are and what their agent does. A wallet
address is unreadable; `name.ai` is readable, but nothing links the name to a
bio, skills, or contact — on-chain.

## The product

**AgentID Card** is a tiny smart contract + static frontend:

- Any wallet holding an Agent ID can create **one public profile**: bio
  (≤280 chars), tags (≤140), link (≤140).
- The handle is **read directly from the Agent ID registry on-chain**
  (`handleOf(msg.sender)`), never typed in by the user — so nobody can claim
  a name they don't own. This is the deep Agent ID integration: the product
  cannot function without Agent ID at all.
- Anyone can read any profile by address or by handle (`getProfile`,
  `getProfileByHandle`), and the directory is browsable from `ProfileSet`
  events. A holder can update or delete their own profile any time.
- **No payments, no owner, no admin functions, no pausing.** The only thing
  that ever moves is gas. Fully permissionless and immutable once deployed.

## Contract

- `contracts/AgentDirectory.sol` — single file, no imports, MIT, Solidity
  `^0.8.24`, optimizer OFF (so BscScan verification is a one-file paste).
- Registry: SPACE ID Agent ID `0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F`
  (ERC-721, soulbound). Verified on-chain 18 Nov 2026:
  `balanceOf(0xC629…587a9) = 1`, `handleOf(...) = "wantorieta15"`.
- Compiled artefacts: `build/AgentDirectory.abi.json`,
  `build/AgentDirectory.bytecode.txt` (7.916 bytes).
- Deploy gas (real `eth_estimateGas` on BSC, 18 Nov 2026): **1.771.162 gas**.
  At the current gas price (0,05 gwei) that is **~0,000089 BNB (~$0,05)**.
  At 1 gwei it would be 0,001771 BNB — slightly MORE than the Agentic
  wallet's 0,00142 BNB, so deploy MUST use a low gas price (or top up a
  little BNB first). See `SUBMISSION.md`.

## Frontend

- `frontend/index.html` + `frontend/app.js` — static, no build step, no
  backend. Uses ethers v6 from CDN. Connect with Binance Wallet / MetaMask,
  switch to BNB Smart Chain (56), save your profile (you confirm the
  transaction in your own wallet; only gas is spent).
- After deploy, fill `CONTRACT_ADDRESS` + `DEPLOY_BLOCK` in `app.js`.

## Concepts considered (2–3, as briefed)

1. **AgentID Card (CHOSEN)** — on-chain profile directory. Real identity use
   case (the announcement lists identity as a core use case), genuinely
   Agent-ID-native, zero asset movement, simplest red-line story.
2. **AgentID Guestbook** — public on-chain message wall, holders only.
   Simpler to build, but a wall has no lasting utility; weaker on
   practicality (25%) and innovation (20%).
3. **AgentID Badge** — free soulbound badge NFT proving holder status.
   Simplest of all, but a badge is not a real-world use case on its own and
   adds nothing a profile doesn't already prove.

## Red-line compliance (self-audit)

- No web QR login, no session storage, no signing on behalf of users.
- No bypass of user confirmation: every write is a normal wallet transaction
  the user confirms themselves.
- No unauthorized transfers: the contract holds no funds and moves none.
- Open-source, single file, no owner permissions at all (there is literally
  no `owner` in the contract — nothing to disclose or abuse).
- No "Binance"/"BNB" in the project name or token (there is no token).
- No seed phrases / private keys / API secrets collected anywhere.
- No promised returns, no "passive income" language anywhere.
- No trading, so no risk-warning page needed.
- Agent ID is NOT used as a lookup tool for other people's wallets: profiles
  are self-published by each holder about themselves.
- No fake interactions, no volume manipulation, no mass accounts — traction
  plan is organic only (see below).

## Traction — honest assessment

The Innovation Award needs **≥30 Agent ID addresses interacting with the
contract during the submission period**. That is the hardest requirement: we
have no audience of Agent ID holders, mas Wan does not want to hunt
referrals, and fake interactions = disqualification.

Realistic organic plan (no referral spam, no fake accounts):

1. **The X promotion post itself** (`X_DRAFT.md`) — hashtags put the project
   in front of the hackathon community; the post links the live dApp.
2. **Binance Square post** with the same content (Square is where the
   announcement lives and where Agent ID holders gather).
3. **Comment on the official announcement post** (Binance Square) with a
   short note + link once the dApp is live — discovery where holders already
   are. Only if mas Wan agrees; never spam.
4. **The product is the funnel**: free, gas-only, one click to claim a card.
   Every holder who sees the post can interact in under a minute.

Plain truth: the **Growth Award top 10 is very unlikely** (it ranks by
interacting addresses + volume against established teams). The **Innovation
Award's 30-address bar is the realistic target** — reachable only if the
directory gets organic pickup. If it doesn't reach 30, the entry is still a
complete, submittable project, and the **X promotion ($100) is the more
probable payout**. Submit anyway; the entry costs almost nothing
(~$0,05 deploy + gas).

## Repo layout

```
contracts/AgentDirectory.sol   — the contract (single file)
frontend/index.html, app.js    — static frontend
build/                         — compiled ABI + bytecode (solc 0.8.24)
scripts_compile.js             — compile script (npm run via node)
SUBMISSION.md                  — deploy + submit checklist
X_DRAFT.md                     — X promotion drafts (do NOT post yet)
```

## Build

```
npm install        # installs solc 0.8.24
node scripts_compile.js
```
