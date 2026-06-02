const GIST_ID = "3e59762e763530c54c5d5659240f935b";

async function fetchStatus() {
  if (GIST_ID === "YOUR_GIST_ID_HERE") return;

  try {
    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`);
    const data = await response.json();
    
    const statusContent = data.files['status.json'].content;
    const statusData = JSON.parse(statusContent);

    const indicatorEl = document.getElementById('status-indicator');

    if (statusData.isOpen) {
      indicatorEl.textContent = `🟢 COMMISSIONS: OPEN (Queue: ${statusData.currentQueue} / ${statusData.maxQueue})`;
      indicatorEl.style.color = "var(--accent-color)";
    } else {
      indicatorEl.textContent = `🔴 COMMISSIONS: CLOSED (Queue: ${statusData.currentQueue} / ${statusData.maxQueue})`;
      indicatorEl.style.color = "#ff5555";
    }

  } catch (error) {
    console.error("ステータスの取得に失敗しました:", error);
  }
}

document.addEventListener('DOMContentLoaded', fetchStatus);
