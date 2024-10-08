// Import Firebase modules from the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, set, get, child, remove } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

// Firebase configuration (NEW SDK details)
const firebaseConfig = {
  apiKey: "AIzaSyD_4kINWig7n6YqB11yM2M-EuxGNz5uekI",
  authDomain: "roll202-c0b0d.firebaseapp.com",
  databaseURL: "https://roll202-c0b0d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "roll202-c0b0d",
  storageBucket: "roll202-c0b0d.appspot.com",
  messagingSenderId: "607661730400",
  appId: "1:607661730400:web:4b4ccfb6524b69393e7105",
  measurementId: "G-L3JB5YC43M"
};

// Initialize Firebase with the new configuration
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM elements
const saveButton = document.getElementById('save-list-button');
const loadButton = document.getElementById('load-list-button');
const deleteButton = document.getElementById('delete-list-button');
const listNameInput = document.getElementById('list-name');
const savedListsContainer = document.getElementById('savedLists');

// Fetch the current list from Firebase (assuming it's stored under 'currentList')
function getCurrentListFromFirebase() {
    const dbRef = ref(db);
    return get(child(dbRef, 'currentList')) // Assuming your current list is stored under 'currentList' node
        .then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                alert('No current list found.');
                return null;
            }
        })
        .catch((error) => {
            console.error('Error fetching current list:', error);
        });
}

// Save the current list from Firebase to a new node in Firebase
function saveList() {
    const listName = listNameInput.value.trim();
    if (!listName) {
        alert('Please enter a name for the list.');
        return;
    }

    // Fetch the current list from Firebase and save it under the specified name
    getCurrentListFromFirebase().then((currentList) => {
        if (currentList) {
            // Save the current list under the specified name
            set(ref(db, 'savedLists/' + listName), { list: currentList })
                .then(() => {
                    alert(`List "${listName}" saved successfully!`);
                    loadSavedLists(); // Reload the saved lists
                })
                .catch((error) => {
                    console.error('Error saving list:', error);
                });
        }
    });
}

// Load a saved list from Firebase and sync it to the 'currentList' node
function loadList() {
    const listName = listNameInput.value.trim();
    if (!listName) {
        alert('Please enter the name of the list to load.');
        return;
    }

    const dbRef = ref(db);
    get(child(dbRef, `savedLists/${listName}`)) // Fetch the saved list from 'savedLists'
        .then((snapshot) => {
            if (snapshot.exists()) {
                const savedList = snapshot.val().list;
                // Sync the saved list back to the 'currentList' node
                set(ref(db, 'currentList'), savedList)
                    .then(() => {
                        alert(`List "${listName}" loaded successfully!`);
                        window.location.href = 'group.html'; // Redirect to group.html to view the updated list
                    })
                    .catch((error) => {
                        console.error('Error loading the list:', error);
                    });
            } else {
                alert(`No list found with the name "${listName}".`);
            }
        })
        .catch((error) => {
            console.error('Error fetching saved list:', error);
        });
}

// Delete a saved list from Firebase
function deleteList() {
    const listName = listNameInput.value.trim();
    if (!listName) {
        alert('Please enter the name of the list to delete.');
        return;
    }

    remove(ref(db, `savedLists/${listName}`)) // Delete the list from 'savedLists'
        .then(() => {
            alert(`List "${listName}" deleted successfully!`);
            loadSavedLists(); // Reload the saved lists after deletion
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

// Load a list directly by clicking on a saved list name
function loadListToGroup(listName) {
    const dbRef = ref(db);
    get(child(dbRef, `savedLists/${listName}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const savedList = snapshot.val().list;
                set(ref(db, 'currentList'), savedList)
                    .then(() => {
                        alert(`List "${listName}" loaded successfully! Redirecting to group.html.`);
                        window.location.href = 'group.html'; // Redirect to group.html
                    })
                    .catch((error) => {
                        console.error('Error loading the list:', error);
                    });
            } else {
                alert(`No list found with the name "${listName}".`);
            }
        })
        .catch((error) => {
            console.error('Error loading saved list:', error);
        });
}

// Attach event listeners
saveButton.addEventListener('click', saveList);
loadButton.addEventListener('click', loadList);
deleteButton.addEventListener('click', deleteList);

// Load the saved lists when the page loads
document.addEventListener('DOMContentLoaded', loadSavedLists);
