let currentMediaType = '';

function openMediaModal(type) {
    currentMediaType = type;
    document.getElementById('media-modal').classList.remove('hidden');
    document.getElementById('modal-title').innerText = `Add ${type.toUpperCase()}`;
}

function closeMedia() {
    document.getElementById('media-modal').classList.add('hidden');
    document.getElementById('media-url').value = '';
    document.getElementById('media-file').value = '';
}

function saveMedia() {
    const urlVal = document.getElementById('media-url').value;
    const fileInput = document.getElementById('media-file').files[0];

    if (fileInput) {
        const reader = new FileReader();
        reader.onload = (e) => finalizeSave(e.target.result);
        reader.readAsDataURL(fileInput);
    } else if (urlVal) {
        finalizeSave(urlVal);
    }
}

function finalizeSave(data) {
    let media = JSON.parse(localStorage.getItem('sriram_final_db')) || [];
    media.push({ type: currentMediaType, content: data });
    localStorage.setItem('sriram_final_db', JSON.stringify(media));
    closeMedia();
    loadGallery();
}

function loadGallery() {
    const data = JSON.parse(localStorage.getItem('sriram_final_db')) || [];
    const vGrid = document.getElementById('video-grid');
    const iGrid = document.getElementById('image-grid');

    vGrid.innerHTML = data.filter(m => m.type === 'video').map(m => {
        // Simple logic to extract YouTube ID if a full link is pasted
        const vidId = m.content.includes('v=') ? m.content.split('v=')[1].split('&')[0] : m.content;
        return `<div class="card"><iframe src="https://www.youtube.com/embed/${vidId}" frameborder="0" allowfullscreen></iframe></div>`;
    }).join('');

    iGrid.innerHTML = data.filter(m => m.type === 'image').map(m => `
        <div class="card"><img src="${m.content}"></div>
    `).join('');
}

// Writer Page Logic
function openWriter(cat) {
    document.getElementById('writer-page').classList.remove('hidden');
    document.getElementById('writer-title').innerText = `Writing ${cat.toUpperCase()}`;
}
function closeWriter() { document.getElementById('writer-page').classList.add('hidden'); }
function format(cmd) { document.execCommand(cmd, false, null); }

window.onload = loadGallery;
