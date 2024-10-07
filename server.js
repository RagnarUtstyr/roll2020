// Import necessary Firebase modules from the SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

// Firebase Configuration from your provided SDK
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

// Function to add a new entry to Firebase
export async function addEntryToFirebase(name, number) {
    try {
        const reference = ref(db, 'rankings/');
        await push(reference, { name, number });
        console.log('Entry added to Firebase:', { name, number });
    } catch (error) {
        console.error('Error adding entry to Firebase:', error);
        throw error; // Re-throw the error so it can be caught in the calling function
    }
}

// Function to fetch and display rankings from Firebase
export function fetchRankings() {
    const reference = ref(db, 'rankings/');
    onValue(reference, (snapshot) => {
        const data = snapshot.val();
        const rankingList = document.getElementById('rankingList');
        rankingList.innerHTML = ''; // Clear existing list

        if (data) {
            const rankings = [];
            for (const id in data) {
                rankings.push({ id, ...data[id] });
            }

            // Sort by number in descending order
            rankings.sort((a, b) => b.number - a.number);
            rankings.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = `${item.name}: ${item.number}`;

                // Add a delete button to each entry
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    removeEntryFromFirebase(item.id);
                });

                listItem.appendChild(deleteButton);
                rankingList.appendChild(listItem);
            });
        } else {
            console.log('No data available');
        }
    }, (error) => {
        console.error('Error fetching data:', error);
    });
}

// Function to remove an individual entry from Firebase
export async function removeEntryFromFirebase(entryId) {
    try {
        const entryRef = ref(db, `rankings/${entryId}`);
        await remove(entryRef);
        console.log('Entry removed from Firebase:', entryId);
    } catch (error) {
        console.error('Error removing entry from Firebase:', error);
    }
}

// Function to clear all entries from Firebase
export async function clearAllEntriesFromFirebase() {
    try {
        const reference = ref(db, 'rankings/');
        await set(reference, null); // Setting the reference to null deletes all data at that location
        console.log('All entries removed from Firebase.');

        // Clear the UI after deleting entries
        const rankingList = document.getElementById('rankingList');
        rankingList.innerHTML = ''; // Clear the list in the UI as well
    } catch (error) {
        console.error('Error clearing all entries from Firebase:', error);
    }
}

// Event listeners for DOM actions
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('submit-button')) {
        document.getElementById('submit-button').addEventListener('click', async () => {
            const name = document.getElementById('name').value;
            const number = parseInt(document.getElementById('number').value);

            if (name && !isNaN(number)) {
                try {
                    await addEntryToFirebase(name, number);
                    alert('Entry submitted successfully!');
                    document.getElementById('name').value = '';
                    document.getElementById('number').value = '';
                } catch (error) {
                    console.error('Error submitting entry:', error);
                    alert('Failed to submit entry. Please try again.');
                }
            } else {
                alert('Please enter a valid name and number.');
            }
        });
    }

    if (document.getElementById('rankingList')) {
        fetchRankings(); // Fetch and display rankings if on group.html page
    }

    if (document.getElementById('clear-all-button')) {
        document.getElementById('clear-all-button').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete all entries?')) {
                clearAllEntriesFromFirebase();
            }
        });
    }
});
