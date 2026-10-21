(() => {
  const KEY = "votesecure_github_pages_demo_v1";
  const candidates = [
    { id: "maya", name: "Maya Patel", role: "Student Council Candidate" },
    { id: "aarav", name: "Aarav Shah", role: "Student Council Candidate" },
    { id: "sana", name: "Sana Khan", role: "Student Council Candidate" }
  ];
  let pending = null;
  let selected = null;
  let currentEmail = null;
  let otp = null;
  let toastTimer;

  const $ = id => document.getElementById(id);
  const load = () => {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || '{"voters":{},"votes":{}}');
      if (!data.voters || !data.votes) throw new Error("bad data");
      return data;
    } catch (_) { return { voters: {}, votes: {} }; }
  };
  const save = data => localStorage.setItem(KEY, JSON.stringify(data));
  const cleanEmail = value => value.trim().toLowerCase();
  const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function toast(message) {
    $("toast").textContent = message;
    $("toast").classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2600);
  }
  function setStatus(message, kind="") {
    $("accessStatus").textContent = message;
    $("accessStatus").className = "status" + (kind ? " " + kind : "");
  }
  function activeVoter() {
    const data = load();
    return currentEmail && data.voters[currentEmail] && data.voters[currentEmail].verified
      ? { email: currentEmail, ...data.voters[currentEmail] } : null;
  }
  function renderCandidates() {
    const voter = activeVoter();
    const data = load();
    const alreadyVoted = voter && Object.prototype.hasOwnProperty.call(data.votes, voter.email);
    $("voteState").textContent = !voter ? "Not verified" : alreadyVoted ? "Vote submitted" : "Verified";
    $("candidateList").innerHTML = candidates.map(c => `
      <label class="candidate">
        <input type="radio" name="candidate" value="${c.id}" ${selected === c.id ? "checked" : ""} ${!voter || alreadyVoted ? "disabled" : ""}>
        <span class="avatar">${escapeHtml(c.name.split(" ").map(x=>x[0]).join(""))}</span>
        <span><strong>${escapeHtml(c.name)}</strong><small>${escapeHtml(c.role)}</small></span>
      </label>`).join("");
    $("candidateList").querySelectorAll('input[name="candidate"]').forEach(input => input.addEventListener("change", () => {
      selected = input.value; $("castVote").disabled = !activeVoter();
    }));
    $("castVote").disabled = !voter || alreadyVoted || !selected;
    if (alreadyVoted) $("castVote").textContent = "Vote already submitted";
    else $("castVote").textContent = "Submit vote";
  }
  function renderResults() {
    const data = load();
    const counts = Object.fromEntries(candidates.map(c => [c.id, 0]));
    Object.values(data.votes).forEach(id => { if (counts[id] !== undefined) counts[id]++; });
    const total = Object.values(counts).reduce((a,b)=>a+b,0);
    $("resultsList").innerHTML = candidates.map(c => {
      const count = counts[c.id], percent = total ? Math.round(count / total * 100) : 0;
      return `<div class="result-row"><strong>${escapeHtml(c.name)}</strong><div class="bar-track"><div class="bar" style="width:${percent}%"></div></div><span class="result-count">${count}</span></div>`;
    }).join("");
    $("totalVotes").textContent = `Total votes cast: ${total}`;
  }
  function renderAccount() {
    const voter = activeVoter();
    const data = load();
    if (!voter) $("accountDetails").textContent = "No verified voter in the current session.";
    else {
      const voted = Object.prototype.hasOwnProperty.call(data.votes, voter.email);
      $("accountDetails").innerHTML = `<strong>${escapeHtml(voter.name)}</strong><br>${escapeHtml(voter.email)}<br>Status: <strong>${voted ? "Vote submitted" : "Verified — not yet voted"}</strong>`;
    }
  }
  function renderAll() { renderCandidates(); renderResults(); renderAccount(); }
  document.querySelectorAll(".tab").forEach(btn => btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b === btn));
    document.querySelectorAll(".view").forEach(v => v.classList.toggle("hidden", v.id !== btn.dataset.view));
    if (btn.dataset.view === "resultsView") renderResults();
    if (btn.dataset.view === "accountView") renderAccount();
  }));
  $("registerForm").addEventListener("submit", event => {
    event.preventDefault();
    const name = $("voterName").value.trim(), email = cleanEmail($("voterEmail").value);
    if (name.length < 2) return setStatus("Please enter your full name.", "bad");
    const data = load();
    if (data.voters[email]?.verified) {
      currentEmail = email;
      setStatus("This email is already verified in this browser. You can continue to voting.", "good");
      renderAll(); return;
    }
    pending = { name, email };
    otp = String(Math.floor(100000 + Math.random() * 900000));
    $("otpCode").textContent = otp;
    $("otpBox").classList.remove("hidden");
    $("otpInput").value = "";
    setStatus("Demo OTP generated. Enter the code shown above to verify.", "good");
  });
  $("otpForm").addEventListener("submit", event => {
    event.preventDefault();
    if (!pending || !otp) return setStatus("Register first to generate an OTP.", "bad");
    if ($("otpInput").value.trim() !== otp) return setStatus("Incorrect OTP. Please try again.", "bad");
    const data = load();
    if (!data.voters[pending.email]) data.voters[pending.email] = { name: pending.name, verified: true, createdAt: new Date().toISOString() };
    else { data.voters[pending.email].verified = true; data.voters[pending.email].name = pending.name; }
    save(data);
    currentEmail = pending.email; otp = null; pending = null;
    $("otpBox").classList.add("hidden");
    setStatus("OTP verified successfully. You can now cast your demo vote.", "good");
    renderAll(); toast("Voter verified!");
  });
  $("castVote").addEventListener("click", () => {
    const voter = activeVoter();
    if (!voter) return toast("Verify your demo OTP first.");
    if (!selected || !candidates.some(c => c.id === selected)) return toast("Choose a candidate first.");
    const data = load();
    if (Object.prototype.hasOwnProperty.call(data.votes, voter.email)) return toast("This email has already voted.");
    data.votes[voter.email] = selected;
    save(data); selected = null;
    setStatus("Your demo vote was submitted successfully.", "good");
    renderAll(); toast("Vote submitted successfully!");
  });
  $("refreshResults").addEventListener("click", () => { renderResults(); toast("Results refreshed."); });
  $("logout").addEventListener("click", () => {
    currentEmail = null; selected = null; pending = null; otp = null;
    $("otpBox").classList.add("hidden");
    setStatus("Logged out. Register or verify a test voter to continue.");
    renderAll(); toast("Logged out.");
  });
  $("resetDemo").addEventListener("click", () => {
    if (!confirm("Clear all demo voters and votes stored in this browser?")) return;
    localStorage.removeItem(KEY); currentEmail = null; selected = null; pending = null; otp = null;
    $("registerForm").reset(); $("otpForm").reset(); $("otpBox").classList.add("hidden");
    setStatus("Demo data reset. Register with a test name and email to begin.");
    renderAll(); toast("Demo data cleared.");
  });
  renderAll();
})();