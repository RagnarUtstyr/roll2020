import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

const db = getDatabase();

// HTML elements for saving and loading lists
const saveButton = document.getElementById('save-list-button');
const loadButton = document.getElementById('load-list-button');
const listNameInput = document.getElementById('list-name');
const rankingList = document.getElementById('rankingList');

// Save the current list to Firebase
function saveList() {
    const listName = listNameInput.value.trim(); // Get the list name from the input
    if (!listName) {
        alert('Please provide a name for the list.');
        return;
    }

    const listItems = [];
    const items = document.querySelectorAll('#rankingList li');
    
    // Collect the current list's data (name, initiative, health)
    items.forEach((item) => {
        const name = item.querySelector('.name').textContent;
        const number = item.querySelector('.number').textContent.replace('Int: ', '');
        const health = item.querySelector('.health').textContent.replace('HP: ', '');
        listItems.push({ name, number, health });
    });

    // Save the list to Firebase under the provided name
    set(ref(db, 'savedLists/' + listName), {
        list: listItems
    }).then(() => {
        alert(`List "${listName}" saved successfully!`);
    }).catch((error) => {
        console.error('Error saving list:', error);
        alert('Failed to save the list. Please try again.');
    });
}

// Load a list from Firebase by name
function loadList() {
    const listName = listNameInput.value.trim(); // Get the list name from the input
    if (!listName) {
        alert('Please provide the name of the list to load.');
        return;
    }

    const dbRef = ref(db);
    get(child(dbRef, `savedLists/${listName}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const savedList = snapshot.val().list;
            displayRankings(savedList); // Call a function to display the list on the page
            alert(`List "${listName}" loaded successfully!`);
        } else {
            alert(`No list found with the name "${listName}".`);
        }
    }).catch((error) => {
        console.error('Error loading list:', error);
        alert('Failed to load the list. Please try again.');
    });
}

// Display rankings on the page
function displayRankings(rankings) {
    rankingList.innerHTML = ''; // Clear the current list

    rankings.forEach(({ name, number, health }) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="name">${name}</div>
            <div class="number">Int: ${number}</div>
            <div class="health">HP: ${health}</div>
            ${health > 0 ? `<input type="number" class="damage-input" placeholder="Damage" />` : ''}
        `;
        rankingList.appendChild(listItem);
    });
}

// Attach event listeners to save and load buttons
saveButton.addEventListener('click', saveList);
loadButton.addEventListener('click', loadList);
