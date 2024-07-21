document.getElementById('downloadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const youtubeUrl = document.getElementById('youtubeUrl').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const responseMessage = document.getElementById('responseMessage');

    responseMessage.textContent = 'Processing...';

    try {
        const response = await fetch('https://your-backend-server-url.com/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ youtubeUrl, phoneNumber }),
        });

        const data = await response.json();

        if (data.success) {
            responseMessage.textContent = 'Download started! You will receive the music on WhatsApp shortly.';
        } else {
            responseMessage.textContent = 'Error: ' + data.message;
        }
    } catch (error) {
        responseMessage.textContent = 'Error: ' + error.message;
    }
});
