// Import necessary Firebase modules from the SDK
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

// Initialize Firebase Database (assuming it is already initialized in server.js)
const db = getDatabase(); // Assuming Firebase is already initialized

// Function to fetch and display the list with editable health values
function fetchAndDisplayHealthList() {
    const reference = ref(db, 'rankings/');
    onValue(reference, (snapshot) => {
        const data = snapshot.val();
        const rankingList = document.getElementById('rankingList');
        rankingList.innerHTML = '';

        if (data) {
            const rankings = Object.entries(data).map(([id, entry]) => ({ id, ...entry }));

            rankings.forEach(({ id, name, number, health }) => {
                const listItem = document.createElement('li');

                const nameDiv = document.createElement('div');
                nameDiv.className = 'name';
                nameDiv.textContent = name;

                const numberDiv = document.createElement('div');
                numberDiv.className = 'number';
                numberDiv.textContent = `Int: ${number}`;

                const healthDiv = document.createElement('div');
                healthDiv.className = 'health';
                
                // Create input field to modify health
                const healthInput = document.createElement('input');
                healthInput.type = 'number';
                healthInput.value = health !== undefined && health !== null ? health : 0; // Default to 0 if health is missing
                healthInput.className = 'health-input';

                // Add event listener to update health when changed
                healthInput.addEventListener('change', () => {
                    updateHealth(id, healthInput.value); // Update health in Firebase
                });

                healthDiv.appendChild(healthInput);

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.addEventListener('click', () => removeEntry(id));

                listItem.appendChild(nameDiv);
                listItem.appendChild(numberDiv);
                listItem.appendChild(healthDiv);
                listItem.appendChild(removeButton);

                rankingList.appendChild(listItem);
            });
        } else {
            console.log('No data available');
        }
    }, (error) => {
        console.error('Error fetching data:', error);
    });
}

// Function to update health in Firebase
function updateHealth(id, newHealthValue) {
    const reference = ref(db, `rankings/${id}`);
    update(reference, { health: parseInt(newHealthValue) })
        .then(() => {
            console.log(`Health updated successfully for id ${id}: ${newHealthValue}`);
        })
        .catch((error) => {
            console.error('Error updating health:', error);
        });
}

// Function to remove entry (can remain in server.js if already there)
function removeEntry(id) {
    const reference = ref(db, `rankings/${id}`);
    remove(reference)
        .then(() => {
            console.log(`Entry with id ${id} removed successfully`);
        })
        .catch((error) => {
            console.error('Error removing entry:', error);
        });
}

// When the page loads, fetch and display the health list
document.addEventListener('DOMContentLoaded', fetchAndDisplayHealthList);
