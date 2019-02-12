// Runs after page load has been completed
$(document).ready(function () {

    // Check if the broswer supports the navigator.geolocation API
    if (navigator.geolocation) {

        // call the navigator.geolocation API to get the user location
        navigator.geolocation.getCurrentPosition(
            // Successful call to geolocation API
            function success(pos) {

                // Store user latitude and longitude in sessionStorage (only have to check once per session)
                sessionStorage.setItem("myLat", pos.coords.latitude);
                sessionStorage.setItem("myLon", pos.coords.longitude);
            },

            function error(err) {
                // Something went wrong
                console.log(err);

                // Default to Sacramento coordinates
                sessionStorage.setItem("myLat", 38.58157);
                sessionStorage.setItem("myLon", -121.4944);
            }
        );
    }
});