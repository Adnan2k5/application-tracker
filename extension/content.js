const JOB_DOMAINS = [
  "linkedin.com",
  "workday",
  "greenhouse.io",
  "lever.co",
  "indeed.com",
  "ashbyhq.com",
  "wellfound.com",
];

function isJobSite() {
  return JOB_DOMAINS.some((d) => window.location.hostname.includes(d));
}

function getCompany() {
  return document.title.split("-")[0].trim();
}

function getRole() {
  const h1 = document.querySelector("h1");
  return h1 ? h1.innerText.trim() : "Unknown Role";
}

document.addEventListener("click", (e) => {
  if (!isJobSite()) return;
  const btn = e.target.closest("button, input[type='submit']");
  if (!btn) return;
  const text = btn.innerText.toLowerCase();
  if (!text.includes("apply") || !text.includes("submit")) return;
  const data = {
    company: getCompany(),
    role: getRole(),
    url: window.location.href,
    source: window.location.hostname,
  };
  chrome.runtime.sendMessage({
    type: "APPLICATION_DETECTED",
    payload: data,
  });
});
