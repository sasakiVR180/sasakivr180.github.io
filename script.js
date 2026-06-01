const GIST_ID = "3e59762e763530c54c5d5659240f935b"; // 取得したGistのID

async function fetchStatus() {
  if (GIST_ID === "YOUR_GIST_ID_HERE") return; // IDが設定されるまでは元のHTMLのまま表示する

  try {
    // GitHub GistのAPIからデータを取得
    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`);
    const data = await response.json();
    
    // Gistに書かれたテキスト（status.json）を読み込んでデータ化
    const statusContent = data.files['status.json'].content;
    const statusData = JSON.parse(statusContent);

    // 画面の要素を取得
    const indicatorEl = document.getElementById('status-indicator');
    const queueEl = document.getElementById('queue-text');

    // 開いているか閉じているかで表示を分岐
    if (statusData.isOpen) {
      indicatorEl.textContent = "🟢 STATUS: OPEN / REGULAR REQUESTS AVAILABLE";
      indicatorEl.style.color = "var(--accent-color)"; // 元の白文字
    } else {
      indicatorEl.textContent = "🔴 STATUS: CLOSED / NO NEW REQUESTS";
      indicatorEl.style.color = "#ff5555"; // 赤文字にする
    }

    // Queueの数字を更新
    queueEl.textContent = `Queue: ${statusData.currentQueue} / ${statusData.maxQueue} Slots Filled`;
  } catch (error) {
    console.error("ステータスの取得に失敗しました:", error);
  }
}

// ページが読み込まれたら自動で取得を実行する
document.addEventListener('DOMContentLoaded', fetchStatus);
