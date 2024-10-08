import { getDatabase, ref, update, onValue } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

const db = getDatabase();

// Function to fetch and display rankings with health update functionality
function fetchRankings() {
    const reference = ref(db, 'rankings/');
    onValue(reference, (snapshot) => {
        const data = snapshot.val();
        const rankingList = document.getElementById('rankingList');
        rankingList.innerHTML = '';

        if (data) {
            const rankings = Object.entries(data).map(([id, entry]) => ({ id, ...entry }));
            rankings.sort((a, b) => b.number - a.number);

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

                // Show "N/A" if no health is provided
                healthDiv.textContent = `HP: ${health !== null && health !== undefined ? health : 'N/A'}`;

                // Add input field for damage if health is provided and greater than 0
                if (health !== null && health !== undefined && health > 0) {
                    const healthInput = document.createElement('input');
                    healthInput.type = 'number';
                    healthInput.placeholder = '-';
                    healthInput.className = 'damage-input';
                    healthInput.style.width = '50px';  // Smaller input field

                    // Event listener for pressing Enter key to apply damage
                    healthInput.addEventListener('keypress', (event) => {
                        if (event.key === 'Enter') {
                            const damage = parseInt(healthInput.value);
                            if (!isNaN(damage) && health > 0) {
                                const updatedHealth = health - damage > 0 ? health - damage : 0; // Ensure health doesn't go below 0
                                updateHealth(id, updatedHealth, listItem, healthDiv, healthInput);
                            }
                        }
                    });

                    listItem.appendChild(healthInput);
                }

                // Append the elements to the list item
                listItem.appendChild(nameDiv);
                listItem.appendChild(numberDiv);
                listItem.appendChild(healthDiv);

                rankingList.appendChild(listItem);
            });
        } else {
            console.log('No data available');
        }
    });
}

// Function to update health in Firebase and handle UI changes
function updateHealth(id, newHealth, listItem, healthDiv, healthInput) {
    const reference = ref(db, `rankings/${id}`);
    update(reference, { health: newHealth })
        .then(() => {
            console.log(`Health updated to ${newHealth}`);
            // Update health in the DOM
            healthDiv.textContent = `HP: ${newHealth}`;

            // If health reaches 0, remove the input field but keep the item
            if (newHealth <= 0 && healthInput) {
                healthInput.remove(); // Remove the input field when health reaches 0
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
