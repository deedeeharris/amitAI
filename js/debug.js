// Debug script to check for step visibility
document.addEventListener('DOMContentLoaded', () => {
    console.log('Debug: Checking step visibility');
    
    const steps = document.querySelectorAll('.step');
    console.log('Steps found:', steps.length);
    
    const contents = document.querySelectorAll('.step-content-item');
    console.log('Content sections found:', contents.length);
    
    contents.forEach((content, index) => {
        console.log(`Step ${index + 1} display:`, window.getComputedStyle(content).display);
        console.log(`Step ${index + 1} visibility:`, window.getComputedStyle(content).visibility);
        console.log(`Step ${index + 1} classes:`, content.className);
    });
});
