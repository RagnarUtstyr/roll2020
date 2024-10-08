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

// Start the highlight loop automatically
document.addEventListener('DOMContentLoaded', () => {
    setInterval(highlightNextEntry, 2000); // Automatically highlight next every 2 seconds

    // Add an event listener to the "Next" button
    const nextButton = document.getElementById('next-button');
    if (nextButton) {
        nextButton.addEventListener('click', moveHighlightNext);
    }
});
