// --- PUBLISHING LOGIC ---
function handlePublish() {
    const file = document.getElementById('img-input').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => saveToDB(e.target.result);
        reader.readAsDataURL(file);
    } else {
        saveToDB(null);
    }
}

function saveToDB(imgData) {
    const entry = {
        id: Date.now(),
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        content: document.getElementById('content').value,
        image: imgData,
        date: new Date().toLocaleDateString()
    };

    if (!entry.title || !entry.content) return alert("Please fill title and content.");

    let db = JSON.parse(localStorage.getItem('sriram_no_video_db')) || [];
    db.push(entry);
    localStorage.setItem('sriram_no_video_db', JSON.stringify(db));
    location.reload();
}

// --- NAVIGATION ---
function openCategory(cat) {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('white-page').classList.remove('hidden');
    document.getElementById('page-title').innerText = cat === 'review' ? 'Movie Reviews' : 'Latest News';
    renderCategory(cat);
}

function closeCategory() {
    document.getElementById('white-page').classList.add('hidden');
    document.getElementById('home-page').classList.remove('hidden');
}

// --- RENDERING ---
function renderHomeMedia() {
    const db = JSON.parse(localStorage.getItem('sriram_no_video_db')) || [];
    const iGrid = document.getElementById('image-grid');

    iGrid.innerHTML = db.filter(i => i.image).map(i => `
        <div class="media-card">
            <img src="${i.image}" alt="${i.title}">
            <p>${i.title}</p>
        </div>
    `).reverse().join('') || '<p style="color:#444">No images uploaded yet.</p>';
}

function renderCategory(cat) {
    const db = JSON.parse(localStorage.getItem('sriram_no_video_db')) || [];
    const container = document.getElementById('category-content');
    
    container.innerHTML = db.filter(i => i.category === cat).map(i => `
        <div class="content-entry">
            <small>${i.date}</small>
            <h3>${i.title}</h3>
            <p>${i.content.replace(/\n/g, '<br>')}</p>
            <button onclick="deletePost(${i.id})" style="color:red; border:none; background:none; cursor:pointer;">[Delete Entry]</button>
        </div>
    `).reverse().join('') || '<p>No stories found in this category.</p>';
}

function deletePost(id) {
    let db = JSON.parse(localStorage.getItem('sriram_no_video_db')) || [];
    db = db.filter(i => i.id !== id);
    localStorage.setItem('sriram_no_video_db', JSON.stringify(db));
    location.reload();
}

window.onload = renderHomeMedia;
