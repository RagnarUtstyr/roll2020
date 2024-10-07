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
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Function to submit data to Firebase
async function submitData() {
    const name = document.getElementById('name').value;
    const number = parseInt(document.getElementById('number').value);

    if (name && !isNaN(number)) {
        try {
            const reference = db.ref('rankings/');
            await reference.push({ name, number });
            alert('Data submitted successfully!');
            console.log('Data submitted:', { name, number });
            document.getElementById('name').value = '';
            document.getElementById('number').value = '';
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Failed to submit data. Please try again.');
        }
    } else {
        alert('Please enter a valid name and number.');
    }
}

// Function to fetch and display rankings
async function fetchRankings() {
    const reference = db.ref('rankings/');
    reference.on('value', (snapshot) => {
        const data = snapshot.val();
        const rankingList = document.getElementById('rankingList');
        rankingList.innerHTML = '';

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

// Event listeners for page-specific actions
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('submit-button')) {
        document.getElementById('submit-button').addEventListener('click', submitData);
    }
    if (document.getElementById('rankingList')) {
        fetchRankings();
    }
});
