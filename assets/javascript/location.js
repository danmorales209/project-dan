$(document).ready(function () {
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function success(pos) {

            sessionStorage.setItem("myLat", pos.coords.latitude);
            sessionStorage.setItem("myLon", pos.coords.longitude);
        })
    }

});