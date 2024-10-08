// Select the list and the button
const listItems = document.querySelectorAll('li'); // Get all list items
const nextButton = document.getElementById('next-button'); // Button for moving to next

let currentIndex = 0; // Start with the first entry

// Function to update the highlighted list item
function highlightNextItem() {
    // Remove the highlight from the current item
    listItems[currentIndex].classList.remove('highlighted');

    // Move to the next item, or loop back to the first if we're at the end
    currentIndex = (currentIndex + 1) % listItems.length;

    // Add highlight to the next item
    listItems[currentIndex].classList.add('highlighted');
}

// Add event listener to the "Next" button to progress the highlight
nextButton.addEventListener('click', highlightNextItem);

// Highlight the first item when the page loads
window.addEventListener('DOMContentLoaded', () => {
    listItems[currentIndex].classList.add('highlighted');
});
