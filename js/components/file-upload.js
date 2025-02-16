// File upload handling
document.addEventListener('DOMContentLoaded', () => {
    const uploadSection = document.getElementById('file-upload');
    const fileInput = uploadSection.querySelector('input[type="file"]');
    const sourcesList = document.querySelector('.sources-list');

    if (!uploadSection || !fileInput || !sourcesList) return;

    // Handle drag and drop
    uploadSection.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadSection.classList.add('drag-over');
    });

    uploadSection.addEventListener('dragleave', () => {
        uploadSection.classList.remove('drag-over');
    });

    uploadSection.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadSection.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    // Handle click upload
    uploadSection.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        Array.from(files).forEach(file => {
            // Add file to sources list
            const sourceItem = document.createElement('div');
            sourceItem.className = 'source-item';
            sourceItem.innerHTML = `
                <i class="fas fa-file"></i>
                <span>${file.name}</span>
                <button class="remove-source">
                    <i class="fas fa-times"></i>
                </button>
            `;
            sourcesList.appendChild(sourceItem);

            // Handle remove button
            sourceItem.querySelector('.remove-source').addEventListener('click', () => {
                sourceItem.remove();
            });

            // TODO: Handle actual file upload to server
            // This is just a placeholder for the file upload logic
            console.log('File to upload:', file);
        });
    }
});