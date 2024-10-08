// Import Firebase modules
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

// Firebase configuration (same as in group.html and server.js)
const firebaseConfig = {
  apiKey: "AIzaSyD_4kINWig7n6YqB11yM2M-EuxGNz5uekI",
  authDomain: "roll202-c0b0d.firebaseapp.com",
  databaseURL: "https://roll202-c0b0d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "roll202-c0b0d",
  storageBucket: "roll202-c0b0d.appspot.com",
  messagingSenderId: "607661730400",
  appId: "1:607661730400:web:b4b3f97a12cfae373e7105",
  measurementId: "G-L3JB5YC43M"
};

// Initialize Firebase only if it's not already initialized
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

// Initialize the database
const db = getDatabase(app);

// Function to fetch the current list from Firebase (the same list displayed in group.html)
function fetchCurrentListFromFirebase() {
    const reference = ref(db, 'rankings/');
    return get(reference)
        .then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                alert('No current list found in Firebase.');
                return null;
            }
        })
        .catch((error) => {
            console.error('Error fetching current list:', error);
        });
}

// Function to save the current list under a new name in Firebase
function saveList() {
    const listName = document.getElementById('list-name').value.trim();
    if (!listName) {
        alert('Please enter a name for the list.');
        return;
    }

    // Fetch the current list from Firebase
    fetchCurrentListFromFirebase().then((currentList) => {
        if (currentList) {
            // Save the list under a new name in Firebase
            const newListReference = ref(db, 'savedLists/' + listName);
            set(newListReference, { list: currentList })
                .then(() => {
                    alert(`List "${listName}" saved successfully!`);
                    loadSavedLists();  // Reload the saved lists
                })
                .catch((error) => {
                    console.error('Error saving the list:', error);
                });
        }
    });
}

// Function to load and display all saved lists
function loadSavedLists() {
    const savedListsContainer = document.getElementById('savedLists');
    const reference = ref(db, 'savedLists/');
    
    get(reference)
        .then((snapshot) => {
            savedListsContainer.innerHTML = '';  // Clear the list
            if (snapshot.exists()) {
                const savedLists = snapshot.val();
                Object.keys(savedLists).forEach((listName) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = listName;
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

// Attach event listeners
document.getElementById('save-list-button').addEventListener('click', saveList);
document.addEventListener('DOMContentLoaded', loadSavedLists);
