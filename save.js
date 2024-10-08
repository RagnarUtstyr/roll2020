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

// Function to save the list from group.html
function saveListFromGroup() {
    const listName = prompt('Enter a name to save the list:').trim();
    
    if (!listName) {
        alert('Please provide a valid name for the list.');
        return;
    }

    const listItems = [];
    const items = document.querySelectorAll('#rankingList li'); // Fetch the list items from group.html

    // Extract the necessary data from each list item
    items.forEach((item) => {
        const name = item.querySelector('.name').textContent;
        const number = item.querySelector('.number').textContent.replace('Int: ', '');
        const health = item.querySelector('.health').textContent.replace('HP: ', '');
        listItems.push({ name, number, health });
    });

    // Save the list to Firebase
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
function loadList(listName) {
    const dbRef = ref(db);

    get(child(dbRef, `savedLists/${listName}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const savedList = snapshot.val().list;
            displayRankings(savedList); // Assuming you have a function to display the list on group.html
            alert(`List "${listName}" loaded successfully!`);
        } else {
            alert(`No list found with the name "${listName}".`);
        }
    }).catch((error) => {
        console.error('Error loading list:', error);
        alert('Failed to load the list. Please try again.');
    });
}

// Display the list on the page (group.html)
function displayRankings(rankings) {
    const rankingList = document.getElementById('rankingList');
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

// Attach the save function to a button (you need a Save button in group.html)
const saveButton = document.getElementById('save-list-button');
if (saveButton) {
    saveButton.addEventListener('click', saveListFromGroup);
}
