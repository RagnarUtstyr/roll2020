let currentHighlightIndex = 0;

function highlightNextEntry() {
    const listItems = document.querySelectorAll('#rankingList li');

    if (listItems.length === 0) return; // If no items, exit

    // Ensure the current index does not exceed the number of items
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

    // Move to the next item, or loop back to the first
    currentHighlightIndex = (currentHighlightIndex + 1) % listItems.length;

    // Highlight the next item
    highlightNextEntry();
}

// Function to refresh highlighting after removal
function refreshHighlightAfterRemoval() {
    const listItems = document.querySelectorAll('#rankingList li');

    // If no items, exit
    if (listItems.length === 0) return;

    // Adjust the current index if it exceeds the new list size
    if (currentHighlightIndex >= listItems.length) {
        currentHighlightIndex = 0;
    }

    // Reapply the highlight to the correct item
    highlightNextEntry();
}

// Update the removeEntry function to refresh highlighting after an item is removed
function removeEntry(id, listItem) {
    const reference = ref(db, `rankings/${id}`);
    remove(reference)
        .then(() => {
            console.log(`Entry with id ${id} removed successfully`);
            listItem.remove(); // Remove the item from the DOM
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
