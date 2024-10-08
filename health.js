import { getDatabase, ref, update, onValue, remove } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

const db = getDatabase();

// Function to fetch and display rankings with health update functionality
function fetchRankings() {
    const reference = ref(db, 'rankings/');
    onValue(reference, (snapshot) => {
        const data = snapshot.val();
        const rankingList = document.getElementById('rankingList');
        rankingList.innerHTML = ''; // Clear the list

        if (data) {
            const rankings = Object.entries(data).map(([id, entry]) => ({ id, ...entry }));
            rankings.sort((a, b) => b.number - a.number); // Sort by initiative (number)

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
                
                // Display "N/A" if health is not provided
                healthDiv.textContent = `HP: ${health !== null && health !== undefined ? health : 'N/A'}`;

                // If health is greater than 0, show the damage input field
                if (health !== null && health !== undefined && health > 0) {
                    const healthInput = document.createElement('input');
                    healthInput.type = 'number';
                    healthInput.placeholder = '-';
                    healthInput.className = 'damage-input';
                    healthInput.style.width = '50px';  // Small input field

                    // Event listener for pressing Enter key to apply damage
                    healthInput.addEventListener('keypress', (event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault(); // Prevent the default "focus next input" behavior
                            const damage = parseInt(healthInput.value);
                            if (!isNaN(damage) && health > 0) {
                                const updatedHealth = health - damage > 0 ? health - damage : 0; // Ensure health doesn't go below 0
                                updateHealth(id, updatedHealth, listItem, healthDiv, healthInput, removeButton);
                            }
                        }
                    });

                    listItem.appendChild(healthInput);
                }

                // Add the remove button
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.className = 'remove-button';
                removeButton.addEventListener('click', () => {
                    removeEntry(id, listItem); // Pass listItem to remove it from DOM
                });

                // If health is 0 or less, show the remove button only
                if (health === 0) {
                    listItem.appendChild(removeButton);
                }

                // Append all the elements to the list item
                listItem.appendChild(nameDiv);
                listItem.appendChild(numberDiv);
                listItem.appendChild(healthDiv);

                // Append the list item to the ranking list
                rankingList.appendChild(listItem);
            });
        } else {
            console.log('No data available');
        }
    });
}

// Function to update health in Firebase and toggle input/remove button
function updateHealth(id, newHealth, listItem, healthDiv, healthInput, removeButton) {
    const reference = ref(db, `rankings/${id}`);
    update(reference, { health: newHealth })
        .then(() => {
            console.log(`Health updated to ${newHealth}`);
            healthDiv.textContent = `HP: ${newHealth}`; // Update health display

            // If health reaches 0, remove the input field and show the remove button
            if (newHealth <= 0) {
                if (healthInput) {
                    healthInput.remove(); // Remove input field
                }
                listItem.appendChild(removeButton); // Show remove button
            }
        })
        .catch((error) => {
            console.error('Error updating health:', error);
        });
}

// Function to remove an entry from Firebase and the DOM
function removeEntry(id, listItem) {
    const reference = ref(db, `rankings/${id}`);
    remove(reference)
        .then(() => {
            console.log(`Entry with id ${id} removed successfully`);
            // Remove the corresponding list item from the DOM
            listItem.remove();
        })
        .catch((error) => {
            console.error('Error removing entry:', error);
        });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('rankingList')) {
        fetchRankings();
    }
});
