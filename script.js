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

async function fetchSupporters() {
  const supporters = new Set();
  
  // FANBOX
  try {
    const res = await fetch('supporters/fanbox_supporter.txt');
    if (res.ok) {
      const text = await res.text();
      const lines = text.split(/\r?\n/).map(l => l.trim());
      for (let i = 0; i < lines.length; i += 3) {
        if (lines[i] && lines[i] !== '名前') {
          supporters.add(lines[i]);
        }
      }
    }
  } catch(e) { console.error('Fanbox load failed', e); }

  // Patreon
  try {
    const res = await fetch('supporters/Patreon_supporter.csv');
    if (res.ok) {
      const text = await res.text();
      const lines = text.split(/\r?\n/);
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        // Simple CSV parse
        const cols = lines[i].split(',');
        if (cols.length >= 4 && cols[3] === 'Active patron') {
          supporters.add(cols[0].replace(/^"|"$/g, '').trim());
        }
      }
    }
  } catch(e) { console.error('Patreon load failed', e); }

  const tickerEl = document.getElementById('supporters-ticker');
  
  // Local file:// fetch usually fails. Provide dummy data if empty so user can see it.
  if (supporters.size === 0) {
    supporters.add("Test User A");
    supporters.add("Test User B (※ブラウザのローカル制限のためダミー表示中)");
    supporters.add("Test User C");
  }

  if (supporters.size > 0) {
    const arr = Array.from(supporters);
    
    // Add commissioners multiple times so they appear more frequently
    const commissioners = ["匿名", "リーヴェ", "zhovke", "ヤマト", "ManGuy", "William", "someone", "Pat89", "baraKIKI", "Dwas", "BlueBerry", "NotXP", "Holoman", "hiecchi"];
    commissioners.forEach(c => {
      for(let k=0; k<3; k++) {
        arr.push(c);
      }
    });

    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const baseText = "/// SPECIAL THANKS : " + arr.join(" /// ") + " ";
    
    // Repeat twice to avoid sudden cut-offs, but not too many times.
    tickerEl.textContent = baseText.repeat(2); 
    
    // Calculate duration based on the actual text length to keep the scrolling speed constant and readable.
    // e.g., 15 characters per second
    const totalChars = tickerEl.textContent.length;
    const duration = Math.max(30, totalChars / 12);
    tickerEl.style.animationDuration = `${duration}s`;
  } else {
    tickerEl.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchStatus();
  fetchSupporters();
});
