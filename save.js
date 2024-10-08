import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

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

// HTML elements for saving and loading lists in save.html
const savedListsContainer = document.getElementById('savedLists');
const goBackButton = document.getElementById('go-back-button');

// Load the list of saved lists from Firebase and display them in save.html
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

// Function to load the selected list and redirect to group.html
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

// Go back to the main page (optional)
goBackButton.addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirect to your main page if needed
});

// Load the saved lists when save.html loads
document.addEventListener('DOMContentLoaded', loadSavedLists);
