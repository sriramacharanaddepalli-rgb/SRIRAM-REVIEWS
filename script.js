let archive = JSON.parse(localStorage.getItem('sriram_vault_final')) || [];
let activeCat = 'image';

// --- DEEP SEARCH ---
function executeSearch() {
    const term = document.getElementById('globalSearch').value.toLowerCase();
    const filtered = archive.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.content.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term)
    );
    renderWall(filtered);
}

// --- NAVIGATION ---
function showSection(name) {
    const sections = ['wall-section', 'reviews-section', 'news-section', 'about-section'];
    sections.forEach(s => document.getElementById(s).style.display = 'none');
    document.getElementById(name + '-section').style.display = 'block';
    window.scrollTo(0,0);
}

// --- STUDIO LOGIC ---
function openStudio(cat) {
    activeCat = cat;
    document.getElementById('writingStudio').style.display = 'block';
    document.getElementById('studioTitle').value = "";
    document.getElementById('editor').innerHTML = "Start writing...";
}

function closeStudio() { document.getElementById('writingStudio').style.display = 'none'; }

function format(cmd) { document.execCommand(cmd, false, null); }

function insertImage() { document.getElementById('imageUpload').click(); }

document.getElementById('imageUpload').onchange = function(e) {
    const reader = new FileReader();
    reader.onload = (ev) => {
        document.execCommand('insertHTML', false, `<img src="${ev.target.result}" style="max-width:100%; border-radius:8px; margin:20px 0;">`);
    };
    reader.readAsDataURL(e.target.files[0]);
};

function promptVideo() {
    const url = prompt("YouTube URL:");
    if(url) {
        const id = url.includes("v=") ? url.split("v=")[1].substring(0,11) : url;
        const vid = `<div style="position:relative; padding-bottom:56.25%; height:0; margin:20px 0;"><iframe src="https://www.youtube.com/embed/${id}" style="position:absolute; top:0; left:0; width:100%; height:100%; border-radius:8px;" allowfullscreen></iframe></div>`;
        document.execCommand('insertHTML', false, vid);
    }
}

// --- DATA PERSISTENCE ---
function saveEntry() {
    const title = document.getElementById('studioTitle').value;
    const content = document.getElementById('editor').innerHTML;
    if(!title || content.trim() === "") return;

    const entry = { id: Date.now(), title, content, type: activeCat, date: new Date().toLocaleDateString() };
    archive.unshift(entry);
    localStorage.setItem('sriram_vault_final', JSON.stringify(archive));
    
    closeStudio();
    renderWall();
}

function renderWall(data = archive) {
    const grids = {
        image: document.getElementById('imageGrid'),
        video: document.getElementById('videoGrid'),
        review: document.getElementById('reviewsGrid'),
        news: document.getElementById('newsGrid')
    };

    Object.values(grids).forEach(g => { if(g) g.innerHTML = ''; });

    data.forEach(item => {
        const card = `
        <div class="review-card">
            <span style="font-size:0.6rem; color:var(--primary); font-weight:bold; letter-spacing:1px; display:block; margin-bottom:5px;">${item.type.toUpperCase()}</span>
            <h3>${item.title}</h3>
            <p style="font-size:0.85rem; color:#bbb; line-height:1.5;">${item.content.replace(/<[^>]*>?/gm, '').substring(0, 120)}...</p>
            <div style="display:flex; justify-content:space-between; margin-top:15px; font-size:0.75rem; color:#444;">
                <span>${item.date}</span>
                <button onclick="deleteItem(${item.id})" style="background:none; border:none; color:#444; cursor:pointer;">Delete</button>
            </div>
        </div>`;
        if (grids[item.type]) grids[item.type].innerHTML += card;
    });
}

function deleteItem(id) {
    if(confirm("Delete this entry?")) {
        archive = archive.filter(a => a.id !== id);
        localStorage.setItem('sriram_vault_final', JSON.stringify(archive));
        renderWall();
    }
}

document.addEventListener('DOMContentLoaded', renderWall);