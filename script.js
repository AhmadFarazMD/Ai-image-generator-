document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('promptInput');
    const generateBtn = document.getElementById('generateBtn');
    const loadingSpinner = document.getElementById('loading');
    const imageContainer = document.getElementById('imageContainer');
    const generatedImage = document.getElementById('generatedImage');
    const downloadBtn = document.getElementById('downloadBtn');

    // Function to generate image
    async function generateImage() {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert('Please enter a description for the image you want to generate.');
            return;
        }

        // Show loading spinner
        loadingSpinner.style.display = 'block';
        imageContainer.style.display = 'none';
        generatedImage.style.display = 'none';
        downloadBtn.style.display = 'none';

        try {
            const apiUrl = `https://text-to-image.bjcoderx.workers.dev/?text=${encodeURIComponent(prompt)}`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Set the image source directly from the API response
            generatedImage.src = apiUrl;
            
            // Display the generated image
            generatedImage.onload = () => {
                loadingSpinner.style.display = 'none';
                imageContainer.style.display = 'block';
                generatedImage.style.display = 'block';
                downloadBtn.style.display = 'block';
            };

            generatedImage.onerror = () => {
                throw new Error('Failed to load the generated image');
            };

        } catch (error) {
            console.error('Error:', error);
            loadingSpinner.style.display = 'none';
            alert('An error occurred while generating the image. Please try again. Error: ' + error.message);
        }
    }

    // Function to download image
    async function downloadImage() {
        try {
            const originalText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
            downloadBtn.disabled = true;

            const response = await fetch(generatedImage.src);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            
            // Create a timestamp for the filename
            const date = new Date();
            const timestamp = date.toISOString().split('T')[0];
            const promptText = promptInput.value.trim().replace(/[^a-z0-9]/gi, '_').substring(0, 30);
            
            a.href = url;
            a.download = `AI_Image_${promptText}_${timestamp}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Show success feedback
            downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
            downloadBtn.classList.add('download-success');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                downloadBtn.innerHTML = originalText;
                downloadBtn.disabled = false;
                downloadBtn.classList.remove('download-success');
            }, 2000);

        } catch (error) {
            console.error('Error downloading image:', error);
            alert('Failed to download the image. Please try again.');
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Image';
            downloadBtn.disabled = false;
        }
    }

    // Event Listeners
    generateBtn.addEventListener('click', generateImage);
    downloadBtn.addEventListener('click', downloadImage);

    // Allow generating image with Enter key
    promptInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateImage();
        }
    });

    // Add loading animation for generated image
    generatedImage.addEventListener('load', () => {
        generatedImage.style.opacity = '1';
    });
});
