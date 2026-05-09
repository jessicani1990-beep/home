let items = JSON.parse(localStorage.getItem('my_items')) || [];

document.getElementById('buyDate').valueAsDate = new Date();

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    if(pageId === 'add-page') document.getElementById('btn-add').classList.add('active');
    if(pageId === 'search-page') {
        document.getElementById('btn-search').classList.add('active');
        renderItems();
    }
    if(pageId === 'backup-page') {
        document.getElementById('btn-backup').classList.add('active');
        updateBackupDateDisplay();
    }
}

function saveItem() {
    const newItem = {
        id: Date.now(),
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        buyDate: document.getElementById('buyDate').value,
        price: document.getElementById('price').value,
        expiryDate: document.getElementById('expiryDate').value,
        warrantyDate: document.getElementById('warrantyDate').value,
        note: document.getElementById('note').value,
        timestamp: new Date().toISOString()
    };

    if(!newItem.name) return alert('請輸入名稱');
    
    items.push(newItem);
    localStorage.setItem('my_items', JSON.stringify(items));
    alert('儲存成功！');
    clearForm();
    showPage('search-page');
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('price').value = '';
    document.getElementById('note').value = '';
    document.getElementById('expiryDate').value = '';
    document.getElementById('warrantyDate').value = '';
}

function renderItems() {
    const list = document.getElementById('item-list');
    const alerts = document.getElementById('expiry-alerts');
    const search = document.getElementById('searchInput').value.toLowerCase();
    
    list.innerHTML = '';
    alerts.innerHTML = '';

    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    // Analysis for 30 days
    items.forEach(item => {
        const checkDates = [];
        if(item.expiryDate) checkDates.push({d: new Date(item.expiryDate), t: '即將過期'});
        if(item.warrantyDate) checkDates.push({d: new Date(item.warrantyDate), t: '保固即將到期'});

        checkDates.forEach(dateObj => {
            if(dateObj.d >= today && dateObj.d <= thirtyDaysLater) {
                alerts.innerHTML += `<div class="item-card warning" style="border-left:4px solid #C0392B">
                    ⚠️ ${item.name} - ${dateObj.t}: ${dateObj.d.toLocaleDateString()}
                </div>`;
            }
        });
    });

    // Filtered List
    const filtered = items.filter(i => i.name.toLowerCase().includes(search));
    
    filtered.sort((a,b) => new Date(b.buyDate) - new Date(a.buyDate)).forEach(item => {
        list.innerHTML += `
            <div class="item-card">
                <div class="item-header">
                    <span class="item-name">${item.name}</span>
                    <span class="item-category">${item.category}</span>
                </div>
                <div class="item-info">購買：${item.buyDate} | 金額：$${item.price}</div>
                ${item.warrantyDate ? `<div class="item-info" style="color:var(--accent-color)">保固至：${item.warrantyDate}</div>` : ''}
            </div>
        `;
    });
}

function downloadBackup() {
    const dataStr = JSON.stringify(items, null, 2);
    const blob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    localStorage.setItem('last_backup', new Date().toLocaleString());
    updateBackupDateDisplay();
}

function importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if(Array.isArray(imported)) {
                items = imported;
                localStorage.setItem('my_items', JSON.stringify(items));
                alert('匯入成功！');
                renderItems();
            }
        } catch(err) {
            alert('無效的備份檔案');
        }
    };
    reader.readAsText(file);
}

function updateBackupDateDisplay() {
    const last = localStorage.getItem('last_backup') || '尚未備份';
    document.getElementById('lastBackupDisplay').innerText = `上次備份：${last}`;
}

// Initial Call
showPage('add-page');
script.js
目前顯示的是「script.js」。
