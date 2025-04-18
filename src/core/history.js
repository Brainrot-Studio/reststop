function saveRequestToHistory({ url = "", method = "", headers = "", body = "" }) {
    const history = JSON.parse(localStorage.getItem('reststop-history') || '[]')

    const newEntry = {
        url,
        method,
        timestamp: new Date().toISOString(),
        headers,
        body
    };

    // Duplicate checker
    const filtered = history.filter(
        item => item.url !== newEntry.url || item.method !== newEntry.method
    );

    const updated = [newEntry, ...filtered].slice(0, 50);

    localStorage.setItem('reststop-history', JSON.stringify(updated));
    renderHistorySidebar();
}

function renderHistorySidebar() {
    const history = JSON.parse(localStorage.getItem('reststop-history') || '[]');
    const list = document.getElementById('history-list');
    list.innerHTML = '';
  
    history.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <button class="w-full text-left px-2 py-1 rounded hover:bg-zinc-800 transition text-white"
                data-history-index="${index}">
          <span class="block font-semibold">${item.method} ${item.url}</span>
          <span class="block text-xs text-zinc-400">${new Date(item.timestamp).toLocaleString()}</span>
        </button>
      `;
      list.appendChild(li);
    });
}

document.getElementById('history-list').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-history-index]');
    if (!btn) return
  
    const index = parseInt(btn.dataset.historyIndex);
    const history = JSON.parse(localStorage.getItem('reststop-history') || '[]');
    const item = history[index];
  
    // Populate the fields
    document.getElementById('url').value = item.url;
    document.getElementById('method').value = item.method;
    if (item.headers == '') {
        document.getElementById('headers').value = '';
    }
    else {
        document.getElementById('headers').value = JSON.stringify(item.headers, null, 2);
    }
  
    if (item.body == '') {
        document.getElementById('body').value = '';
    }
    else {
        document.getElementById('body').value = JSON.stringify(item.body, null, 2);
    }
    
});
  
  // Dom loaded events
window.addEventListener('DOMContentLoaded', () => {
    renderHistorySidebar();
});