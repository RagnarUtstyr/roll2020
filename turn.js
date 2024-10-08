let currentHighlightIndex = 0;

function highlightNextEntry() {
    const listItems = document.querySelectorAll('#rankingList li');

    if (listItems.length === 0) return; // Exit if no items are present

    // Ensure the current index doesn't exceed the number of list items
    if (currentHighlightIndex >= listItems.length) {
        currentHighlightIndex = 0;
    }

    // Remove highlight from all items
    listItems.forEach(item => item.classList.remove('highlighted'));

    // Highlight the current item
    listItems[currentHighlightIndex].classList.add('highlighted');
}

function moveHighlightNext() {
    const listItems = document.querySelectorAll('#rankingList li');

    if (listItems.length === 0) return; // Exit if there are no items

    // Move to the next item or loop back to the first one
    currentHighlightIndex = (currentHighlightIndex + 1) % listItems.length;

    // Apply the new highlight
    highlightNextEntry();
}

// Function to refresh the highlight when an item is removed
function refreshHighlightAfterRemoval() {
    const listItems = document.querySelectorAll('#rankingList li');

    // If no items are left, do nothing
    if (listItems.length === 0) return;

    // Adjust the current highlight index if necessary
    if (currentHighlightIndex >= listItems.length) {
        currentHighlightIndex = 0; // Reset to first item if we exceeded the new length
    }

    // Reapply the highlight to the current item
    highlightNextEntry();
}

// Update the removeEntry function to refresh highlighting after an item is removed
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

    // Highlight the first item when the page loads
    highlightNextEntry();
});
