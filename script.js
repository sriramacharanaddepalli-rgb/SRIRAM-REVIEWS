let currentType = '';

function openMediaModal(type) {
    currentType = type;
    document.getElementById('media-modal').classList.remove('hidden');
    document.getElementById('modal-title').innerText = `Add to ${type === 'video' ? 'Videos' : 'Images'}`;
    
    // Update file input to accept specific types
    const input = document.getElementById('media-file');
    input.accept = type === 'video' ? "video/mp4,video/webm" : "image/*";
}

function closeModal() {
    document.getElementById('media-modal').classList.add('hidden');
    document.getElementById('media-file').value = '';
}

function saveMediaFile() {
    const file = document.getElementById('media-file').files[0];
    if (!file) return alert("Please select a file first.");

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = {
            id: Date.now(),
            type: currentType,
            content: e.target.result // Base64 Data
        };
        
        let db = JSON.parse(localStorage.getItem('sriram_local_media')) || [];
        db.push(data);
        localStorage.setItem('sriram_local_media', JSON.stringify(db));
        
        closeModal();
        renderHome();
    };
    reader.readAsDataURL(file);
}

function renderHome() {
    const db = JSON.parse(localStorage.getItem('sriram_local_media')) || [];
    const vGrid = document.getElementById('video-grid');
    const iGrid = document.getElementById('image-grid');

    vGrid.innerHTML = db.filter(m => m.type === 'video').map(m => `
        <div class="card">
            <video controls width="100%" style="border-radius:10px;">
                <source src="${m.content}" type="video/mp4">
            </video>
            <button onclick="deleteMedia(${m.id})" class="del-small">Delete</button>
        </div>
    `).reverse().join('');

    iGrid.innerHTML = db.filter(m => m.type === 'image').map(m => `
        <div class="card">
            <img src="${m.content}" style="width:100%; border-radius:10px;">
            <button onclick="deleteMedia(${m.id})" class="del-small">Delete</button>
        </div>
    `).reverse().join('');
}

function deleteMedia(id) {
    let db = JSON.parse(localStorage.getItem('sriram_local_media')) || [];
    db = db.filter(m => m.id !== id);
    localStorage.setItem('sriram_local_media', JSON.stringify(db));
    renderHome();
}

window.onload = renderHome;
