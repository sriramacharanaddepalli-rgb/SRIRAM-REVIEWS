// Convert Image to Base64 to save in LocalStorage
function processAndSave() {
    const file = document.getElementById('post-image').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            savePost(e.target.result);
        };
        reader.readAsDataURL(file);
    } else {
        savePost(null);
    }
}

function savePost(imageData) {
    const title = document.getElementById('post-title').value;
    const category = document.getElementById('post-category').value;
    const videoId = document.getElementById('post-video').value;
    const content = document.getElementById('post-content').value;

    if (!title || !content) return alert("Please fill title and content.");

    const newEntry = {
        id: Date.now(),
        title,
        category,
        content,
        image: imageData,
        video: videoId,
        date: new Date().toLocaleDateString()
    };

    let archive = JSON.parse(localStorage.getItem('sriram_media_db')) || [];
    archive.push(newEntry);
    localStorage.setItem('sriram_media_db', JSON.stringify(archive));
    
    location.reload(); 
}

function filterContent(type) {
    document.getElementById('view-indicator').innerText = `Feed: ${type.toUpperCase()}`;
    displayArchive(type);
}

function displayArchive(filter = 'all') {
    const list = document.getElementById('display-list');
    const archive = JSON.parse(localStorage.getItem('sriram_media_db')) || [];

    const filtered = archive.filter(item => {
        if (filter === 'all') return true;
        if (filter === 'image') return item.image;
        if (filter === 'video') return item.video;
        return item.category === filter;
    });

    list.innerHTML = filtered.map(item => `
        <div class="post-card ${item.category}">
            <span class="tag">${item.category}</span>
            <h3>${item.title}</h3>
            ${item.image ? `<img src="${item.image}" style="width:100%; border-radius:8px; margin:10px 0;">` : ''}
            ${item.video ? `<iframe width="100%" height="200" src="https://www.youtube.com/embed/${item.video}" frameborder="0" allowfullscreen></iframe>` : ''}
            <p>${item.content}</p>
            <button onclick="deletePost(${item.id})" style="color:red; background:none; border:none; cursor:pointer;">[Delete]</button>
        </div>
    `).reverse().join('');
}

function deletePost(id) {
    let archive = JSON.parse(localStorage.getItem('sriram_media_db')) || [];
    archive = archive.filter(item => item.id !== id);
    localStorage.setItem('sriram_media_db', JSON.stringify(archive));
    displayArchive();
}

window.onload = () => displayArchive('all');
