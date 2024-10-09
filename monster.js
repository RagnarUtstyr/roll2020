// Function to handle adding a monster to the list
function addToList(name, health, url) {
    const initiative = prompt(`Enter initiative for ${name}:`);
    if (initiative !== null && !isNaN(initiative)) {
        submitMonsterToFirebase(name, parseInt(initiative), health, url);
    } else {
        alert('Please enter a valid initiative number.');
    }
}

// Function to submit data to Firebase
async function submitMonsterToFirebase(name, initiative, health, url) {
    try {
        const db = firebase.database(); // Assuming firebase is initialized already
        const reference = db.ref('rankings/');
        const newEntryRef = await reference.push({ name, number: initiative, health, url });
        alert('Monster added successfully!');
        addMonsterToListUI(newEntryRef.key, name, initiative, health, url);
    } catch (error) {
        console.error('Error submitting monster:', error);
        alert('Failed to add monster.');
    }
}

// Function to add monster to the list UI
function addMonsterToListUI(id, name, initiative, health, url) {
    const rankingList = document.getElementById('rankingList');
    const listItem = document.createElement('li');
    listItem.textContent = `${name} (Int: ${initiative}, HP: ${health})`;
    listItem.className = 'list-item';
    listItem.dataset.url = url;
    listItem.onclick = function() {
        window.open(this.dataset.url, '_blank');
    };
    rankingList.appendChild(listItem);
}
