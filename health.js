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
                healthDiv.textContent = `HP: ${health || 'N/A'}`;

                // Input and button to subtract health
                const healthInput = document.createElement('input');
                healthInput.type = 'number';
                healthInput.placeholder = 'Damage';
                healthInput.className = 'damage-input';

                const healthButton = document.createElement('button');
                healthButton.textContent = 'Apply Damage';
                healthButton.className = 'apply-damage-button';

                healthButton.addEventListener('click', () => {
                    const damage = parseInt(healthInput.value);
                    if (!isNaN(damage) && health !== null && health > 0) {
                        const updatedHealth = health - damage > 0 ? health - damage : 0; // Ensure health doesn't go below 0
                        updateHealth(id, updatedHealth);
                    }
                });

                // Append the elements to the list item
                listItem.appendChild(nameDiv);
                listItem.appendChild(numberDiv);
                listItem.appendChild(healthDiv);
                listItem.appendChild(healthInput);
                listItem.appendChild(healthButton);

                rankingList.appendChild(listItem);
            });
        } else {
            console.log('No data available');
        }
    });
}

// Function to update health in Firebase
function updateHealth(id, newHealth) {
    const reference = ref(db, `rankings/${id}`);
    update(reference, { health: newHealth })
        .then(() => {
            console.log(`Health updated to ${newHealth}`);
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

