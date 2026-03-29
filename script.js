let currentMediaType = '';
let currentCategory = '';
let postImageBase64 = null; // Stores image for the review

// --- GALLERY MODAL (Home Only) ---
function openMediaModal(type) {
    currentMediaType = type;
    document.getElementById('media-modal').classList.remove('hidden');
    document.getElementById('modal-title').innerText = `Add ${type.toUpperCase()}`;
}

function closeModal() {
    document.getElementById('media-modal').classList.add('hidden');
    document.getElementById('media-url').value = '';
    document.getElementById('media-file').value = '';
}

function saveHomeMedia() {
    const urlVal = document.getElementById('media-url').value;
    const fileInput = document.getElementById('media-file').files[0];

    if (fileInput) {
        const reader = new FileReader();
        reader.onload = (e) => finalizeHomeSave(e.target.result);
        reader.readAsDataURL(fileInput);
    } else if (urlVal) {
        finalizeHomeSave(urlVal);
    }
}

function finalizeHomeSave(data) {
    let media = JSON.parse(localStorage.getItem('sriram_media_db')) || [];
    media.push({ type: currentMediaType, content: data });
    localStorage.setItem('sriram_media_db', JSON.stringify(media));
    closeModal();
    loadGallery();
}

// --- WHITE WORKSPACE LOGIC (With Image Tools) ---
function openWriter(cat) {
    currentCategory = cat;
    currentWriterEntryId = null; // Reset for new post
    postImageBase64 = null; // Reset image
    document.getElementById('image-preview').innerHTML = ''; // Clear preview
    document.getElementById('image-preview').classList.add('hidden');
    document.getElementById('post-title').value = '';
    document.getElementById('post-body').value = '';
    document.getElementById('post-image-input').value = ''; // Reset input

    document.getElementById('writer-page').classList.remove('hidden');
    document.getElementById('writer-title').innerText = `New ${cat === 'review' ? 'Movie Review' : 'Cinema News'}`;
}

function closeWriter() {
    document.getElementById('writer-page').classList.add('hidden');
}

// Image Tool: Show preview when file selected
function previewPostImage() {
    const file = document.getElementById('post-image-input').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            postImageBase64 = e.target.result;
            const previewArea = document.getElementById('image-preview');
            previewArea.innerHTML = `<img src="${postImageBase64}" alt="Poster Preview">`;
            previewArea.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

// FORMATTING TOOLS (Bold, Italic)
function format(cmd) {
    document.execCommand(cmd, false, null);
    document.getElementById('post-body').focus();
}

// SUBMIT POST (Text + Image)
function submitPost() {
    const title = document.getElementById('post-title').value;
    const body = document.getElementById('post-body').value;

    if (!title || !body) {
        alert("Alert: Title and Body cannot be empty.");
        return;
    }

    const postData = {
        id: Date.now(),
        category: currentCategory,
        title: title,
        body: body,
        image: postImageBase64, // The uploaded image
        date: new Date().toLocaleDateString()
    };

    let db = JSON.parse(localStorage.getItem('sriram_posts_db')) || [];
    db.push(postData);
    localStorage.setItem('sriram_posts_db', JSON.stringify(db));

    alert(`${currentCategory === 'review' ? 'Review' : 'News'} published successfully.`);
    closeWriter();
    // After closing writer, we should ideally render the new card in the white page... 
    // This requires a separate render function which can be called on page load or after submit.
    // For now, reload to see the new entry (optional).
    // location.reload(); 
}

// --- RENDERING GALLERIES ---
function loadGallery() {
    const media = JSON.parse(localStorage.getItem('sriram_media_db')) || [];
    const vGrid = document.getElementById('video-grid');
    const iGrid = document.getElementById('image-grid');

    vGrid.innerHTML = media.filter(m => m.type === 'video').map(m => {
        const vidId = m.content.includes('v=') ? m.content.split('v=')[1].split('&')[0] : m.content;
        return `<div class="card"><iframe src="https://www.youtube.com/embed/${vidId}" frameborder="0" allowfullscreen></iframe></div>`;
    }).join('') || '<p style="color:#444">No videos.</p>';

    iGrid.innerHTML = media.filter(m => m.type === 'image').map(m => `
        <div class="card"><img src="${m.content}"></div>
    `).join('') || '<p style="color:#444">No images.</p>';
}

window.onload = loadGallery;
