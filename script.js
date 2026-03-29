// Function to Save New Content
function savePost() {
    const title = document.getElementById('post-title').value;
    const category = document.getElementById('post-category').value;
    const content = document.getElementById('post-content').value;

    if (!title || !content) {
        alert("Action Required: Please enter both title and content.");
        return;
    }

    const newEntry = {
        id: Date.now(),
        title,
        category,
        content,
        date: new Date().toLocaleDateString()
    };

    let archive = JSON.parse(localStorage.getItem('sriram_v3_data')) || [];
    archive.push(newEntry);
    localStorage.setItem('sriram_v3_data', JSON.stringify(archive));

    // Reset Form
    document.getElementById('post-title').value = '';
    document.getElementById('post-content').value = '';
    
    displayArchive('all');
}

// Function to Filter the List
function filterContent(type) {
    const indicator = document.getElementById('view-indicator');
    indicator.innerText = `Current Feed: ${type === 'all' ? 'All' : type.toUpperCase()}`;
    displayArchive(type);
}

// Function to Render to UI
function displayArchive(filter = 'all') {
    const displayList = document.getElementById('display-list');
    const archive = JSON.parse(localStorage.getItem('sriram_v3_data')) || [];

    const filtered = filter === 'all' 
        ? archive 
        : archive.filter(item => item.category === filter);

    if (filtered.length === 0) {
        displayList.innerHTML = `<p style="text-align:center; color:#666;">No posts in this category yet.</p>`;
        return;
    }

    displayList.innerHTML = filtered.map(item => `
        <div class="post-card ${item.category}">
            <span class="tag">${item.category}</span>
            <small style="float:right; color:#777;">${item.date}</small>
            <h3>${item.title}</h3>
            <p>${item.content.replace(/\n/g, '<br>')}</p>
            <button onclick="deletePost(${item.id})" style="background:none; border:none; color:#e50914; cursor:pointer; font-size:11px; padding:0;">[Delete Post]</button>
        </div>
    `).reverse().join('');
}

function deletePost(id) {
    if(confirm("Are you sure you want to remove this?")){
        let archive = JSON.parse(localStorage.getItem('sriram_v3_data')) || [];
        archive = archive.filter(item => item.id !== id);
        localStorage.setItem('sriram_v3_data', JSON.stringify(archive));
        displayArchive();
    }
}

// Initial Load
window.onload = () => displayArchive('all');
