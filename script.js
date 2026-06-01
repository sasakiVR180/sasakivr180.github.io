const GIST_ID = "3e59762e763530c54c5d5659240f935b";

async function fetchStatus() {
  if (GIST_ID === "YOUR_GIST_ID_HERE") return;

  try {
    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`);
    const data = await response.json();
    
    const statusContent = data.files['status.json'].content;
    const statusData = JSON.parse(statusContent);

    const indicatorEl = document.getElementById('status-indicator');
    const queueEl = document.getElementById('queue-text');

    if (statusData.isOpen) {
      indicatorEl.textContent = "🟢 STATUS: OPEN / REGULAR REQUESTS AVAILABLE";
      indicatorEl.style.color = "var(--accent-color)";
    } else {
      indicatorEl.textContent = "🔴 STATUS: CLOSED / NO NEW REQUESTS";
      indicatorEl.style.color = "#ff5555";
    }

    queueEl.textContent = `Queue: ${statusData.currentQueue} / ${statusData.maxQueue} Slots Filled`;
  } catch (error) {
    console.error("ステータスの取得に失敗しました:", error);
  }
}

document.addEventListener('DOMContentLoaded', fetchStatus);
