let currentCategory = '';
let currentMediaType = '';

// --- NAVIGATION ---
function openWriter(cat) {
    currentCategory = cat;
    document.getElementById('writer-page').classList.remove('hidden');
    document.getElementById('writer-title').innerText = `Writing ${cat.toUpperCase()}...`;
}

function closeWriter() {
    document.getElementById('writer-page').classList.add('hidden');
}

// --- MEDIA MODAL ---
function openMediaLink(type) {
    currentMediaType = type;
    document.getElementById('media-modal').classList.remove('hidden');
    document.getElementById('modal-title').innerText = `Add ${type.toUpperCase()}`;
}

function closeMedia() {
    document.getElementById('media-modal').classList.add('hidden');
    document.getElementById('media-input').value = '';
}

// --- DATABASE & SUBMIT ---
function submitPost() {
    const title = document.getElementById('post-title').value;
    const body = document.getElementById('post-body').value;

    if(!title || !body) return alert("Please fill title and content.");

    const post = { id: Date.now(), category: currentCategory, title, body, date: new Date().toLocaleDateString() };
    let data = JSON.parse(localStorage.getItem('sriram_v4_posts')) || [];
    data.push(post);
    localStorage.setItem('sriram_v4_posts', JSON.stringify(data));
    
    alert("Post Published Successfully!");
    closeWriter();
}

function saveMedia() {
    const val = document.getElementById('media-input').value;
    if(!val) return;

    let media = JSON.parse(localStorage.getItem('sriram_v4_media')) || [];
    media.push({ type: currentMediaType, link: val });
    localStorage.setItem('sriram_v4_media', JSON.stringify(media));
    
    closeMedia();
    loadHome();
}

// --- RENDERING ---
function loadHome() {
    const media = JSON.parse(localStorage.getItem('sriram_v4_media')) || [];
    const vGrid = document.getElementById('video-grid');
    const iGrid = document.getElementById('image-grid');

    vGrid.innerHTML = media.filter(m => m.type === 'video').map(m => `
        <div class="card"><iframe src="https://www.youtube.com/embed/${m.link.split('v=')[1] || m.link}" frameborder="0"></iframe></div>
    `).join('');

    iGrid.innerHTML = media.filter(m => m.type === 'image').map(m => `
        <div class="card"><img src="${m.link}"></div>
    `).join('');
}

// Basic Formatting Tool Simulation
function format(cmd) {
    document.execCommand(cmd, false, null);
    document.getElementById('post-body').focus();
}

window.onload = loadHome;
