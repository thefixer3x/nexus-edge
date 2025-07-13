async function getReview() {
    const responseArea = document.getElementById('responseArea');
    responseArea.innerHTML = 'Analyzing...';
    
    try {
        const response = await fetch('/review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code: document.getElementById('codeInput').value,
                context: document.getElementById('contextInput').value
            })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail);
        
        responseArea.innerHTML = `<pre>${data.suggestions}</pre>`;
    } catch (error) {
        responseArea.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
}
