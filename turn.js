let currentHighlightIndex = 0;

function highlightCurrentEntry() {
    const listItems = document.querySelectorAll('#rankingList li');

    // Debugging: Log the list items found
    console.log('List Items Found:', listItems.length);

    if (listItems.length === 0) {
        console.log('No items to highlight.');
        return; // Exit if there are no items
    }

    // Ensure the index is within bounds
    if (currentHighlightIndex >= listItems.length) {
        currentHighlightIndex = 0;
    }

    // Remove the 'highlighted' class from all items
    listItems.forEach((item) => item.classList.remove('highlighted'));

    // Apply the 'highlighted' class to the current item
    listItems[currentHighlightIndex].classList.add('highlighted');

    // Debugging: Log the current highlighted item
    console.log('Current Highlight Index:', currentHighlightIndex);
}

function moveToNextEntry() {
    const listItems = document.querySelectorAll('#rankingList li');

    if (listItems.length === 0) {
        return; // Exit if there are no items
    }

    // Increment the index and wrap around if necessary
    currentHighlightIndex = (currentHighlightIndex + 1) % listItems.length;

    // Highlight the next item
    highlightCurrentEntry();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page Loaded');

    // Attach event listener to the "Next" button
    const nextButton = document.getElementById('next-button');
    if (nextButton) {
        nextButton.addEventListener('click', moveToNextEntry);
        console.log('Next button event listener attached.');
    }

    // Highlight the first item when the page loads
    highlightCurrentEntry();
});
