let currentHighlightIndex = 0;

function highlightNextEntry() {
    const listItems = document.querySelectorAll('#rankingList li');

    if (listItems.length === 0) return;

    // If the current highlight index exceeds the number of list items, reset to 0
    if (currentHighlightIndex >= listItems.length) {
        currentHighlightIndex = 0;
    }

    // Remove highlight from all items (in case the current one was removed)
    listItems.forEach(item => item.classList.remove('highlighted'));

    // Highlight the current item
    listItems[currentHighlightIndex].classList.add('highlighted');
}

function moveHighlightNext() {
    const listItems = document.querySelectorAll('#rankingList li');
    
    if (listItems.length === 0) return;

    // Remove highlight from the current item
    listItems[currentHighlightIndex].classList.remove('highlighted');

    // Move to the next item, or loop back to the first item
    currentHighlightIndex = (currentHighlightIndex + 1) % listItems.length;

    // Highlight the next item
    listItems[currentHighlightIndex].classList.add('highlighted');
}

// Function to refresh highlight when an item is removed
function refreshHighlightAfterRemoval() {
    const listItems = document.querySelectorAll('#rankingList li');

    // If there are still items in the list, highlight the appropriate one
    if (listItems.length > 0) {
        // If the removed item was the last one in the list, reset to the first item
        if (currentHighlightIndex >= listItems.length) {
            currentHighlightIndex = 0;
        }
        highlightNextEntry(); // Apply highlight
    }
}

// Update the removeEntry function to refresh highlighting
function removeEntry(id, listItem) {
    const reference = ref(db, `rankings/${id}`);
    remove(reference)
        .then(() => {
            console.log(`Entry with id ${id} removed successfully`);
            listItem.remove(); // Remove the corresponding list item from the DOM
            refreshHighlightAfterRemoval(); // Refresh highlight after removal
        })
        .catch((error) => {
            console.error('Error removing entry:', error);
        });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add an event listener to the "Next" button
    const nextButton = document.getElementById('next-button');
    if (nextButton) {
        nextButton.addEventListener('click', moveHighlightNext);
    }
});
