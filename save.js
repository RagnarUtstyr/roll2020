import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, set, get, child, remove } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

// Firebase Configuration (your provided config)
const firebaseConfig = {
    apiKey: "AIzaSyD_4kINWig7n6YqB11yM2M-EuxGNz5uekI",
    authDomain: "roll202-c0b0d.firebaseapp.com",
    databaseURL: "https://roll202-c0b0d-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "roll202-c0b0d",
    storageBucket: "roll202-c0b0d.appspot.com",
    messagingSenderId: "607661730400",
    appId: "1:607661730400:web:b4b3f97a12cfae373e7105",
    measurementId: "G-6X5L39W56C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Get references to the DOM elements
const saveButton = document.getElementById('save-list-button');
const loadButton = document.getElementById('load-list-button');
const deleteButton = document.getElementById('delete-list-button');
const listNameInput = document.getElementById('list-name');
const savedListsContainer = document.getElementById('savedLists');
const goBackButton = document.getElementById('go-back-button');

// Save the current list to Firebase with the provided name
function saveList() {
    const listName = listNameInput.value.trim(); // Get the list name from the input
    if (!listName) {
        alert('Please provide a name for the list.');
        return;
    }

    const listItems = JSON.parse(localStorage.getItem('loadedList')); // Get the currently loaded list from localStorage
    if (!listItems) {
        alert('No list data found to save.');
        return;
    }

    // Save the list to Firebase under the provided name
    set(ref(db, 'savedLists/' + listName), {
        list: listItems
    }).then(() => {
        alert(`List "${listName}" saved successfully!`);
        loadSavedLists(); // Reload the saved lists after saving
    }).catch((error) => {
        console.error('Error saving list:', error);
        alert('Failed to save the list. Please try again.');
    });
}

// Load a list from Firebase by name and redirect to group.html
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
            localStorage.setItem('loadedList', JSON.stringify(savedList)); // Temporarily store the list in localStorage

            alert(`List "${listName}" loaded successfully! Redirecting to the group page.`);
            window.location.href = 'group.html'; // Redirect to group.html
        } else {
            alert(`No list found with the name "${listName}".`);
        }
    }).catch((error) => {
        console.error('Error loading the list:', error);
        alert('Failed to load the list. Please try again.');
    });
}

// Delete a list from Firebase by name
function deleteList() {
    const listName = listNameInput.value.trim(); // Get the list name from the input
    if (!listName) {
        alert('Please provide the name of the list to delete.');
        return;
    }

    const dbRef = ref(db, `savedLists/${listName}`);
    
    remove(dbRef).then(() => {
        alert(`List "${listName}" deleted successfully!`);
        loadSavedLists(); // Reload the saved lists after deletion
    }).catch((error) => {
        console.error('Error deleting the list:', error);
        alert('Failed to delete the list. Please try again.');
    });
}

// Load the list of saved lists from Firebase and display them
function loadSavedLists() {
    const dbRef = ref(db);

    get(child(dbRef, 'savedLists')).then((snapshot) => {
        if (snapshot.exists()) {
            const savedLists = snapshot.val();
            savedListsContainer.innerHTML = ''; // Clear the list before populating
            
            // Populate the list of saved lists
            Object.keys(savedLists).forEach(listName => {
                const listItem = document.createElement('li');
                listItem.textContent = listName;
                listItem.className = 'saved-list-item';
                listItem.addEventListener('click', () => loadListToGroup(listName)); // Click event to load the list
                savedListsContainer.appendChild(listItem);
            });
        } else {
            savedListsContainer.innerHTML = '<li>No saved lists found.</li>';
        }
    }).catch((error) => {
        console.error('Error loading saved lists:', error);
        savedListsContainer.innerHTML = '<li>Failed to load saved lists.</li>';
    });
}

// Load the selected list and redirect to group.html (helper function)
function loadListToGroup(listName) {
    const dbRef = ref(db);

    get(child(dbRef, `savedLists/${listName}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const savedList = snapshot.val().list;
            localStorage.setItem('loadedList', JSON.stringify(savedList)); // Temporarily store the list in localStorage

            alert(`List "${listName}" loaded successfully! Redirecting to the group page.`);
            window.location.href = 'group.html'; // Redirect to group.html
        } else {
            alert(`No list found with the name "${listName}".`);
        }
    }).catch((error) => {
        console.error('Error loading the list:', error);
        alert('Failed to load the list. Please try again.');
    });
}

// Attach event listeners to the buttons
saveButton.addEventListener('click', saveList);
loadButton.addEventListener('click', loadList);
deleteButton.addEventListener('click', deleteList);
goBackButton.addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirect to the main page if needed
});

// Load the saved lists when save.html loads
document.addEventListener('DOMContentLoaded', loadSavedLists);
