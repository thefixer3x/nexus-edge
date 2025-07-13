document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        const response = await fetch('/review', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        document.getElementById('result').innerText = data.suggestions;
    } catch (error) {
        document.getElementById('result').innerText = 'Error: ' + error.message;
    }
});

document.getElementById('repo-dir').addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    const repoFiles = document.getElementById('repo-files');
    
    repoFiles.innerHTML = '<h4>Repository Files:</h4><ul>';
    files.forEach(file => {
        if (file.name.startsWith('.git')) return;
        repoFiles.innerHTML += `<li>${file.webkitRelativePath}</li>`;
    });
    repoFiles.innerHTML += '</ul>';
});

document.querySelector('form[action="/import-repo"]').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const repoPath = formData.get('repo-path');
    
    try {
        const response = await fetch('/import-repo', {
            method: 'POST',
            body: repoPath ? 
                JSON.stringify({ repoPath }) : 
                formData,
            headers: repoPath ? {
                'Content-Type': 'application/json'
            } : undefined
        });
        const result = await response.json();
        document.getElementById('result').textContent = result.message;
    } catch (error) {
        console.error('Error importing repository:', error);
        document.getElementById('result').textContent = 'Error importing repository: ' + error.message;
    }
});
