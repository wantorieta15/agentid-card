# SUBMISSION CHECKLIST — AgentID Card (Binance Agent ID Hackathon)

**Do NOT submit anything until mas Wan approves each step (parent asks him).
Nothing here has been deployed or submitted yet.**

## 1. Deploy the contract (needs mas Wan's approval)

- Network: BNB Smart Chain (chain 56).
- From: Agentic wallet `0xC62953c543fB6BeC8AbBA0A6B3931cDC3Df587a9`
  (Agent ID `wantorieta15.ai`).
- Bytecode: `build/AgentDirectory.bytecode.txt` (compiled solc 0.8.24,
  optimizer OFF, 0 errors / 0 warnings).
- Deploy gas: **1.771.162 gas** (real `eth_estimateGas`, 18 Nov 2026).
  - At 0,05 gwei (current): **~0,000089 BNB (~$0,05)** ✅
  - At 1 gwei: 0,001771 BNB — MORE than the wallet's 0,00142 BNB ❌
  - **Deploy ONLY with a low gas price (≤0,5 gwei), or top up BNB first.**
- ⚠️ **baw session expires 19 Nov 12:49 WITA** (noted 18 Nov 23:45). Deploy
  while the session is CONNECTED; if it expired, re-pairing needs mas Wan
  to approve in the Binance app.
- Deploy route: `baw` preview → show decoded action to mas Wan → explicit
  confirmation → execute (standard rule). Record the contract address +
  deploy block + tx hash here after deploy.
- After deploy: fill `CONTRACT_ADDRESS` + `DEPLOY_BLOCK` in
  `frontend/app.js`, and update this file.

Contract address: **0xb4fc78f08d13fe3bf18c73c49ae7eb05d1acf433** (deployed 18 Nov 23:55 WITA)
Deploy tx: **0x13476f906837b0ae4f6eb0744d46f10165a4bc10323f62de9695dc0bb6ba2651** (block 134338929, status success, gas 1.760.131 @ 0,0707 gwei, biaya 0,000124 BNB)
Deploy block: **134338929**
Deploy route: baw TIDAK bisa deploy langsung (--to wajib, terverifikasi) — deploy lewat pabrik CreateX 0xba5Ed…c28ba5Ed (deployCreate, Sourcify exact-match), kontrak hasil deploy byte-for-byte sama dengan bytecode kompilasi (terverifikasi on-chain, AGENT_ID() + profileCount() OK).

## 2. Verify source on BscScan

- Open the contract page on BscScan → "Verify and Publish".
- Compiler: **Solidity 0.8.24**, License **MIT**, Optimization: **No**.
- Paste the ENTIRE `contracts/AgentDirectory.sol` (single file, no imports
  — no flattening needed).
- Constructor arguments: none.
- Expected result: "Exact match" (source matches deployed bytecode).

## 3. Publish the code (open-source requirement)

- Push this repo to GitHub under **@wantorieta15** (new public repo, e.g.
  `agentid-card`). Needs mas Wan's GitHub auth if `gh` is not logged in.
- Alternative: the BscScan-verified source alone satisfies "open-source"
  for the judges, but a public repo is stronger + required for the
  website link if we host the frontend there (GitHub Pages).

## 4. Host the frontend (website for submission)

- Static files only: `frontend/index.html` + `frontend/app.js`.
- Options: GitHub Pages (from the repo above) or Cloudflare Pages.
  No backend, no server, no keys.
- Website URL for submission: _(TBD after hosting)_

## 5. Submit the project (no registration needed)

Per the official announcement, submit during the Submission Period
(**until 9 Dec 16:00 WITA**): project name, website, contract address(es),
Agent ID usage description, and other required materials.
- Project name: **AgentID Card**
- Website: _(TBD — step 4)_
- Contract: _(TBD — step 1)_
- Agent ID usage: "Only Agent ID holders can create a profile. The
  contract reads the holder's handle directly from the SPACE ID Agent ID
  registry on-chain (handleOf) and stores the profile under that handle —
  the product cannot function without Agent ID. Profiles are public,
  self-published identity for agents."
- Reward receiving address: _(mas Wan to confirm — Agentic EVM wallet
  0xC629…587a9 is the natural choice; parent to ask him)_

⚠️ The announcement does NOT print the project-submission form URL in its
text. The parent must take the submission link from Binance's official
channels (announcement page / Binance Wallet hackathon page). **Do NOT
guess a URL and do NOT use the old September "Agent OS Mini Hackathon"
survey (2913aa…) — that is a different, expired event.**

## 6. Community Promotion ($100 track)

- Post the draft in `X_DRAFT.md` from **@wantorieta15** — AFTER the dApp
  is deployed + submitted, so the project is genuinely "participating".
- Submit the X post link via the official campaign survey (link on
  app.binance.com — take it from the announcement page's "campaign survey"
  link; **not found in public search yet, do NOT guess it**).
- 20 winners × $100, judged on post quality. Deadline = submission period
  end (9 Dec 16:00 WITA).

## 7. Traction (30 Agent ID addresses)

- Post the X draft + a Binance Square version (same content).
- Comment once on the official announcement post (Square) with a short
  note + link, only if mas Wan agrees.
- Track interactions: `profileCount()` on the contract + `ProfileSet`
  events. Report the count to mas Wan; no fake interactions, ever.
