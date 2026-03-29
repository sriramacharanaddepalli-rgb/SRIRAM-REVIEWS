let currentType = '';
let currentCategory = '';

// --- NAVIGATION & WRITER ---
function openWriter(cat) {
    currentCategory = cat;
    document.getElementById('writer-page').classList.remove('hidden');
    document.getElementById('writer-title').innerText = `Writing ${cat.toUpperCase()}`;
}
function closeWriter() { document.getElementById('writer-page').classList.add('hidden'); }
function format(cmd) { document.execCommand(cmd, false, null); }

// --- MEDIA MODAL (Home) ---
function openMediaModal(type) {
    currentType = type;
    document.getElementById('media-modal').classList.remove('hidden');
    document.getElementById('media-file-input').accept = type === 'video' ? "video/*" : "image/*";
}
function closeModal() { document.getElementById('media-modal').classList.add('hidden'); }

// --- SAVE MEDIA (Home) ---
function saveMediaFile() {
    const file = document.getElementById('media-file-input').files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const item = { id: Date.now(), type: currentType, content: e.target.result };
        let db = JSON.parse(localStorage.getItem('sriram_media')) || [];
        db.push(item);
        localStorage.setItem('sriram_media', JSON.stringify(db));
        closeModal();
        renderHome();
    };
    reader.readAsDataURL(file);
}

// --- SUBMIT POST (Writer Page) ---
function submitPost() {
    const title = document.getElementById('post-title').value;
    const body = document.getElementById('post-body').value;
    const imgFile = document.getElementById('post-img-input').files[0];

    if (!title || !body) return alert("Fill all fields");

    if (imgFile) {
        const reader = new FileReader();
        reader.onload = (e) => finalizePost(title, body, e.target.result);
        reader.readAsDataURL(imgFile);
    } else {
        finalizePost(title, body, null);
    }
}

function finalizePost(title, body, img) {
    const post = { id: Date.now(), cat: currentCategory, title, body, img };
    let db = JSON.parse(localStorage.getItem('sriram_posts')) || [];
    db.push(post);
    localStorage.setItem('sriram_posts', JSON.stringify(db));
    alert("Published!");
    closeWriter();
}

// --- RENDERING ---
function renderHome() {
    const media = JSON.parse(localStorage.getItem('sriram_media')) || [];
    const vGrid = document.getElementById('video-grid');
    const iGrid = document.getElementById('image-grid');

    vGrid.innerHTML = media.filter(m => m.type === 'video').map(m => `
        <div class="card"><video controls src="${m.content}"></video>
        <button onclick="deleteMedia(${m.id})" class="del">Delete</button></div>
    `).reverse().join('');

    iGrid.innerHTML = media.filter(m => m.type === 'image').map(m => `
        <div class="card"><img src="${m.content}">
        <button onclick="deleteMedia(${m.id})" class="del">Delete</button></div>
    `).reverse().join('');
}

function deleteMedia(id) {
    let db = JSON.parse(localStorage.getItem('sriram_media')) || [];
    db = db.filter(m => m.id !== id);
    localStorage.setItem('sriram_media', JSON.stringify(db));
    renderHome();
}

window.onload = renderHome;
