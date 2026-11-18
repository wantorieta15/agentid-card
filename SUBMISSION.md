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

- Repo publik: **github.com/wantorieta15/agentid-card** (nama `agentid-card`).
- ✅ Repo lokal SIAP (19 Nov ~00:05 WITA): dedicated git repo di
  `~/workspace/binance-hackathon/` (branch `main`, remote `origin` sudah
  diset ke URL di atas). 3 commit: `83752d2` (10 file proyek),
  `188bae7` (.gitignore), `8b10c78` (workflow GitHub Pages). File yang
  ikut: contracts/, frontend/, README.md, SUBMISSION.md, X_DRAFT.md,
  package.json, package-lock.json, scripts_compile.js, .github/. TIDAK
  ikut: node_modules/, build/.
- ⏳ BELUM PUSH — repo belum ada di GitHub dan `gh` belum login.
  Auth: device-code flow sedang jalan — kode **48B5-F17A** di
  https://github.com/login/device, berlaku s.d. 19 Nov 00:19 WITA.
  Setelah mas Wan memasukkan kode (script polling otomatis menyimpan
  token via `gh auth login --with-token`), jalankan:
  `gh repo create agentid-card --public` lalu `git push -u origin main`.
- Alternative: the BscScan-verified source alone satisfies "open-source"
  for the judges, but a public repo is stronger + required for the
  website link if we host the frontend there (GitHub Pages).

## 4. Host the frontend (website for submission)

- Static files only: `frontend/index.html` + `frontend/app.js`.
- Cara: **GitHub Pages via GitHub Actions** — workflow sudah disiapkan
  dan ter-commit di `.github/workflows/pages.yml` (deploy `frontend/`
  sebagai artefak Pages tiap push ke `main`). Cloudflare Pages TIDAK
  dipakai (butuh akun/token Cloudflare yang tidak kita punya).
- Setelah repo ter-push, aktifkan Pages sekali saja:
  `gh api repos/wantorieta15/agentid-card/pages -X POST -f build_type=workflow`
  (atau Settings → Pages → Source: GitHub Actions). Workflow jalan
  otomatis; tunggu centang hijau di tab Actions.
- Website URL for submission: **https://wantorieta15.github.io/agentid-card/**
  (aktif setelah Pages jalan; verifikasi dengan membuka URL itu).

## 5. Submit the project (no registration needed)

Per the official announcement, submit during the Submission Period
(**until 9 Dec 16:00 WITA**): project name, website, contract address(es),
Agent ID usage description, and other required materials.
- Project name: **AgentID Card**
- Website: **https://wantorieta15.github.io/agentid-card/** (setelah Pages aktif, langkah 4)
- Contract: **0xb4fc78f08d13fe3bf18c73c49ae7eb05d1acf433** (BSC, blok 134338929)
- Agent ID usage: "Only Agent ID holders can create a profile. The
  contract reads the holder's handle directly from the SPACE ID Agent ID
  registry on-chain (handleOf) and stores the profile under that handle —
  the product cannot function without Agent ID. Profiles are public,
  self-published identity for agents."
- Reward receiving address: _(mas Wan to confirm — Agentic EVM wallet
  0xC629…587a9 is the natural choice; parent to ask him)_

⚠️ **Link form submit proyek TIDAK DITEMUKAN di sumber resmi publik
(dicek 19 Nov ~00:10 WITA):** pengumuman resmi dibaca penuh (tidak ada
URL form di teksnya, hanya "No registration needed"), versi Binance
Square-nya sama, 3 pencarian web tidak menemukan form, halaman Binance
Agent OS tidak ada link submit. Satu-satunya link form di pengumuman
adalah "campaign survey" untuk link X — **bukan** form proyek (dan
isinya belum terverifikasi; fetch-nya timeout). **JANGAN tebak URL dan
JANGAN pakai survei lama September "Agent OS Mini Hackathon"
(2913aa…) — itu event lain yang sudah berakhir.** Kemungkinan form-nya
hanya ada di dalam aplikasi Binance, atau baru dipublikasikan belakangan.
Parent yang tentukan langkah berikut (cek di aplikasi / kanal resmi).

## 6. Community Promotion ($100 track)

- Post the draft in `X_DRAFT.md` from **@wantorieta15** — AFTER the dApp
  is deployed + submitted, so the project is genuinely "participating".
- Submit the X post link via the official campaign survey:
  https://app.binance.com/uni-qr/user-survey/ff6832f8d2984af289068c9450a3c98c
  (diambil dari link "campaign survey" di pengumuman resmi; halaman
  sempat timeout saat dicek — pastikan isinya survei hackathon ini
  sebelum mengisi). JANGAN pakai survei lama September (…/2913aa…).
- 20 winners × $100, judged on post quality. Deadline = submission period
  end (9 Dec 16:00 WITA).

## 7. Traction (30 Agent ID addresses)

- Post the X draft + a Binance Square version (same content).
- Comment once on the official announcement post (Square) with a short
  note + link, only if mas Wan agrees.
- Track interactions: `profileCount()` on the contract + `ProfileSet`
  events. Report the count to mas Wan; no fake interactions, ever.
