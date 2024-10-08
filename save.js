import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, set, get, child, remove } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

// Firebase Configuration
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

// DOM elements
const saveButton = document.getElementById('save-list-button');
const loadButton = document.getElementById('load-list-button');
const deleteButton = document.getElementById('delete-list-button');
const listNameInput = document.getElementById('list-name');
const savedListsContainer = document.getElementById('savedLists');

// Fetch the current list from localStorage (created in group.html)
function getCurrentListFromLocalStorage() {
    const currentList = JSON.parse(localStorage.getItem('currentList'));
    if (!currentList) {
        alert('No current list found.');
        return null;
    }
    return currentList;
}

// Save the current list (from localStorage) to Firebase with a provided name
function saveList() {
    const listName = listNameInput.value.trim();
    if (!listName) {
        alert('Please enter a name for the list.');
        return;
    }

    const listItems = getCurrentListFromLocalStorage();
    if (!listItems) {
        return;
    }

    // Save to Firebase
    set(ref(db, 'savedLists/' + listName), { list: listItems })
        .then(() => {
            alert(`List "${listName}" saved successfully!`);
            loadSavedLists(); // Reload the saved lists
        })
        .catch((error) => {
            console.error('Error saving the list:', error);
        });
}

// Load a list from Firebase into localStorage and redirect to group.html
function loadList() {
    const listName = listNameInput.value.trim();
    if (!listName) {
        alert('Please enter the name of the list to load.');
        return;
    }

    const dbRef = ref(db);
    get(child(dbRef, `savedLists/${listName}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const savedList = snapshot.val().list;
                localStorage.setItem('loadedList', JSON.stringify(savedList));
                alert(`List "${listName}" loaded successfully!`);
                window.location.href = 'group.html'; // Redirect to group.html
            } else {
                alert(`No list found with the name "${listName}".`);
            }
        })
        .catch((error) => {
            console.error('Error loading the list:', error);
        });
}

// Delete a list from Firebase by name
function deleteList() {
    const listName = listNameInput.value.trim();
    if (!listName) {
        alert('Please enter the name of the list to delete.');
        return;
    }

    remove(ref(db, `savedLists/${listName}`))
        .then(() => {
            alert(`List "${listName}" deleted successfully!`);
            loadSavedLists(); // Reload the saved lists
        })
        .catch((error) => {
            console.error('Error deleting the list:', error);
        });
}

// Load and display all saved lists from Firebase
function loadSavedLists() {
    const dbRef = ref(db);
    get(child(dbRef, 'savedLists'))
        .then((snapshot) => {
            if (snapshot.exists()) {
                savedListsContainer.innerHTML = ''; // Clear the current list

                const savedLists = snapshot.val();
                Object.keys(savedLists).forEach((listName) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = listName;
                    listItem.className = 'saved-list-item';
                    listItem.addEventListener('click', () => loadListToGroup(listName));
                    savedListsContainer.appendChild(listItem);
                });
            } else {
                savedListsContainer.innerHTML = '<li>No saved lists found.</li>';
            }
        })
        .catch((error) => {
            console.error('Error loading saved lists:', error);
        });
}

// Load a list and redirect to group.html (for clicking on saved lists)
function loadListToGroup(listName) {
    const dbRef = ref(db);
    get(child(dbRef, `savedLists/${listName}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const savedList = snapshot.val().list;
                localStorage.setItem('loadedList', JSON.stringify(savedList));
                alert(`List "${listName}" loaded successfully! Redirecting to group.html.`);
                window.location.href = 'group.html'; // Redirect to group.html
            } else {
                alert(`No list found with the name "${listName}".`);
            }
        })
        .catch((error) => {
            console.error('Error loading the list:', error);
        });
}

// Attach event listeners
saveButton.addEventListener('click', saveList);
loadButton.addEventListener('click', loadList);
deleteButton.addEventListener('click', deleteList);

// Load the saved lists when the page loads
document.addEventListener('DOMContentLoaded', loadSavedLists);
