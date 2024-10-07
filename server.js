// Import necessary Firebase modules from the SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

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
                rankings.push(data[id]);
            }

            // Sort by number in descending order
            rankings.sort((a, b) => b.number - a.number);
            rankings.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = `${item.name}: ${item.number}`;
                rankingList.appendChild(listItem);
            });
        } else {
            console.log('No data available');
        }
    }, (error) => {
        console.error('Error fetching data:', error);
    });
}

// Function to add a new entry to Firebase
export async function addEntryToFirebase(name, number) {
    try {
        const reference = ref(db, 'rankings/');
        await push(reference, { name, number });
        console.log('Entry added to Firebase:', { name, number });
        // Automatically updates the list as onValue listener is set
    } catch (error) {
        console.error('Error adding entry to Firebase:', error);
    }
}

// Event listeners for page-specific actions
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('submit-button')) {
        document.getElementById('submit-button').addEventListener('click', () => {
            const name = document.getElementById('name').value;
            const number = parseInt(document.getElementById('number').value);
            addEntryToFirebase(name, number);
        });
    }
    if (document.getElementById('rankingList')) {
        fetchRankings();
    }
});
