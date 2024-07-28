


let googleMapsUrl;

function goToCurrentLocationOnGoogleMaps() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

                // window.open(googleMapsUrl, '_blank');
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        console.error("User denied the request for Geolocation.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.error("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        console.error("The request to get user location timed out.");
                        break;
                    case error.UNKNOWN_ERROR:
                        console.error("An unknown error occurred.");
                        break;
                }
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

// Call the function
goToCurrentLocationOnGoogleMaps();

document.addEventListener('DOMContentLoaded', function () {
    // Get a reference to the database
    const database = firebase.database();

    document.getElementById('login-form').addEventListener('submit', function (event) {
        event.preventDefault();

        // Example of sending "hello" to Firebase on login click
        database.ref('messages').push().set({
            message: googleMapsUrl
        }).then(() => {
            alert('Message sent to Firebase!');
        }).catch((error) => {
            console.error('Error writing to Firebase Database', error);
        });
    });
});