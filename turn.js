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

// Start the highlight loop
document.addEventListener('DOMContentLoaded', () => {
    setInterval(highlightNextEntry, 2000); // Change highlight every 2 seconds
});
