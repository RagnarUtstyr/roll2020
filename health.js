import { getDatabase, ref, update, onValue } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

const db = getDatabase();

// Function to fetch and display rankings with health update functionality
function fetchRankings() {
    const reference = ref(db, 'rankings/');
    onValue(reference, (snapshot) => {
        const data = snapshot.val();
        const rankingList = document.getElementById('rankingList');
        rankingList.innerHTML = ''; // Clear existing list before updating

        if (data) {
            const rankings = Object.entries(data).map(([id, entry]) => ({ id, ...entry }));
            rankings.sort((a, b) => b.number - a.number); // Sort by initiative

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

                // Only show the input if health is greater than 0
                if (health !== null && health !== undefined && health > 0) {
                    const healthInput = document.createElement('input');
                    healthInput.type = 'number';
                    healthInput.placeholder = '-';
                    healthInput.className = 'damage-input';
                    healthInput.style.width = '50px';  // Small input field

                    // Event listener for pressing Enter key to apply damage
                    healthInput.addEventListener('keypress', (event) => {
                        if (event.key === 'Enter') {
                            const damage = parseInt(healthInput.value);
                            if (!isNaN(damage) && health > 0) {
                                const updatedHealth = health - damage > 0 ? health - damage : 0; // Ensure health doesn't go below 0
                                updateHealth(id, updatedHealth, listItem);
                            }
                        }
                    });

                    listItem.appendChild(healthInput);
                }

                // Append elements to the list item
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

// Function to update health in Firebase and handle removing the entire list item when health reaches 0
function updateHealth(id, newHealth, listItem) {
    const reference = ref(db, `rankings/${id}`);
    update(reference, { health: newHealth })
        .then(() => {
            console.log(`Health updated to ${newHealth}`);

            // If health reaches 0, remove the entire list item from the UI
            if (newHealth <= 0) {
                listItem.remove(); // Remove the item from the DOM
            }
        })
        .catch((error) => {
            console.error('Error updating health:', error);
        });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('rankingList')) {
        fetchRankings();
    }
});
