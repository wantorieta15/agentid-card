// AgentID Card — minimal static frontend (no build step, no backend).
// Fill in CONTRACT_ADDRESS + DEPLOY_BLOCK after the contract is deployed.
const CONFIG = {
  CONTRACT_ADDRESS: "0xb4fc78f08d13fe3bf18c73c49ae7eb05d1acf433", // deployed 18 Nov 23:55 WITA, tx 0x13476f90…
  DEPLOY_BLOCK: 134338929, // deployed 18 Nov 23:55 WITA
  REGISTRY: "0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F", // SPACE ID Agent ID
  CHAIN_ID: 56,
  RPC: "https://bsc-dataseed.binance.org/",
};

const ABI = [
  "function setProfile(string bio, string tags, string link)",
  "function removeProfile()",
  "function getProfile(address holder) view returns (tuple(address holder,string handle,string bio,string tags,string link,uint256 updatedAt))",
  "function getProfileByHandle(string handle) view returns (tuple(address holder,string handle,string bio,string tags,string link,uint256 updatedAt))",
  "function isHolder(address account) view returns (bool)",
  "function handleOf(address account) view returns (string)",
  "function profileCount() view returns (uint256)",
  "event ProfileSet(address indexed holder, string handle, uint256 updatedAt)",
  "event ProfileRemoved(address indexed holder, string handle)",
];
const REGISTRY_ABI = [
  "function handleOf(address account) view returns (string)",
  "function balanceOf(address account) view returns (uint256)",
];

let provider, signer, contract, readProvider, userAddress = null;

const $ = (id) => document.getElementById(id);
function setStatus(t) { $("status").textContent = t; }

async function initRead() {
  readProvider = new ethers.JsonRpcProvider(CONFIG.RPC);
  contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, ABI, readProvider);
  $("contractAddr").textContent = CONFIG.CONTRACT_ADDRESS;
}

async function connect() {
  if (!window.ethereum) { setStatus("No wallet found. Open this page in Binance Wallet / MetaMask browser."); return; }
  try {
    provider = new ethers.BrowserProvider(window.ethereum);
    const net = await provider.getNetwork();
    if (Number(net.chainId) !== CONFIG.CHAIN_ID) {
      setStatus("Please switch your wallet to BNB Smart Chain (chain 56).");
      return;
    }
    signer = await provider.getSigner();
    userAddress = await signer.getAddress();
    contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, ABI, signer);
    const registry = new ethers.Contract(CONFIG.REGISTRY, REGISTRY_ABI, provider);
    const [isHolder, handle] = await Promise.all([
      registry.balanceOf(userAddress).then((b) => b > 0n),
      registry.handleOf(userAddress).catch(() => ""),
    ]);
    if (!isHolder) {
      setStatus("Connected: " + userAddress + " — this wallet holds NO Agent ID, so it cannot create a profile. Claim one free in the Binance app first.");
    } else {
      setStatus("Connected as " + handle + ".ai (" + userAddress.slice(0, 6) + "…" + userAddress.slice(-4) + ")");
      $("saveBtn").disabled = false;
      $("removeBtn").disabled = false;
    }
    await loadMine();
  } catch (e) {
    setStatus("Connect failed: " + (e?.message || e));
  }
}

async function loadMine() {
  if (!userAddress) return;
  try {
    const p = await contract.getProfile(userAddress);
    if (p.handle === "") { $("mine").innerHTML = "No profile yet — write one below and save it."; return; }
    $("mine").innerHTML = cardHtml(p);
    $("bio").value = p.bio; $("tags").value = p.tags; $("link").value = p.link;
  } catch (e) { $("mine").textContent = "Could not load profile: " + (e?.message || e); }
}

function cardHtml(p) {
  const link = p.link ? `<br>🔗 <a href="https://${p.link.replace(/^https?:\/\//, "")}" target="_blank" rel="noopener">${p.link}</a>` : "";
  const tags = p.tags ? `<br>🏷️ ${p.tags}` : "";
  return `<div class="card"><b>${p.handle}.ai</b> <span class="muted">${p.holder.slice(0, 6)}…${p.holder.slice(-4)}</span><br>${p.bio}${tags}${link}<br><span class="muted">updated ${new Date(Number(p.updatedAt) * 1000).toLocaleString()}</span></div>`;
}

async function saveProfile() {
  try {
    setStatus("Waiting for your wallet confirmation… (you approve the transaction yourself; only gas is spent)");
    const tx = await contract.setProfile($("bio").value.trim(), $("tags").value.trim(), $("link").value.trim());
    setStatus("Transaction sent: " + tx.hash + " — waiting for confirmation…");
    await tx.wait();
    setStatus("Profile saved on-chain ✅");
    await loadMine(); await loadDirectory();
  } catch (e) { setStatus("Save failed: " + (e?.reason || e?.message || e)); }
}

async function removeProfile() {
  try {
    setStatus("Waiting for your wallet confirmation…");
    const tx = await contract.removeProfile();
    await tx.wait();
    setStatus("Profile removed ✅");
    await loadMine(); await loadDirectory();
  } catch (e) { setStatus("Remove failed: " + (e?.reason || e?.message || e)); }
}

async function loadDirectory() {
  const box = $("directory");
  try {
    if (CONFIG.DEPLOY_BLOCK === 0) { box.textContent = "Contract not deployed yet — directory will appear after deploy."; return; }
    box.textContent = "Loading…";
    const latest = await readProvider.getBlockNumber();
    const iface = new ethers.Interface(ABI);
    const topic = iface.getEvent("ProfileSet").topicHash;
    const holders = new Set();
    const CHUNK = 9000;
    for (let from = CONFIG.DEPLOY_BLOCK; from <= latest; from += CHUNK) {
      const to = Math.min(from + CHUNK - 1, latest);
      const logs = await readProvider.getLogs({ address: CONFIG.CONTRACT_ADDRESS, topics: [topic], fromBlock: from, toBlock: to });
      for (const l of logs) holders.add(ethers.getAddress("0x" + l.topics[1].slice(26)));
    }
    if (holders.size === 0) { box.textContent = "No profiles yet — be the first Agent ID holder to claim a card."; return; }
    let html = `<p class="muted">${holders.size} profile(s) found. Total on-chain: ${await contract.profileCount()}</p>`;
    for (const h of holders) {
      try { const p = await contract.getProfile(h); if (p.handle !== "") html += cardHtml(p); } catch (_) {}
    }
    box.innerHTML = html;
  } catch (e) { box.textContent = "Could not load directory: " + (e?.message || e); }
}

$("connectBtn").onclick = connect;
$("saveBtn").onclick = saveProfile;
$("removeBtn").onclick = removeProfile;
$("refreshBtn").onclick = loadDirectory;
initRead().then(loadDirectory);
