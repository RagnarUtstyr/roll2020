let currentHighlightIndex = 0;

function highlightNextEntry() {
    const listItems = document.querySelectorAll('#rankingList li');
    
    if (listItems.length === 0) return;

    // Remove highlight from the current item
    listItems[currentHighlightIndex].classList.remove('highlighted');

    // Move to the next item, or loop back to the first item
    currentHighlightIndex = (currentHighlightIndex + 1) % listItems.length;

    // Highlight the next item
    listItems[currentHighlightIndex].classList.add('highlighted');
}

// Function to move the highlight manually when the "Next" button is clicked
function moveHighlightNext() {
    highlightNextEntry();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add an event listener to the "Next" button
    const nextButton = document.getElementById('next-button');
    if (nextButton) {
        nextButton.addEventListener('click', moveHighlightNext);
    }
});
