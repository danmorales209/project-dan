function distanceBetweenLatLong(origin, location) {
    // Function uses Haversince's formula to determine the distance between two sets of latitudes and longitudes
    let radiusOfEarth = 6371 // km
    let dLat = degToRad(location.latitude - origin.latitude);
    let dLong = degToRad(location.longitude - origin.longitude);

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(degToRad(location.latitude)) * Math.cos(degToRad(origin.latitude)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = radiusOfEarth * c;

    return (d * 0.621371) // return miles
}

function degToRad(degrees) {
    return (degrees * (Math.PI / 180));
}

$("#restaurantButton").on("click", function (event) {
    event.preventDefault();
    console.log("working")

    var searchTerm = $("#user-search").val().trim();
    var myLocation = {
        "latitude": sessionStorage.myLat,
        "longitude": sessionStorage.myLon
    };
    let distance = 0;

    if (searchTerm.includes(",")) {
        searchTerm = searchTerm.split(",")[0];
    }

    $.ajax({
        url: "https://developers.zomato.com/api/v2.1/search",
        type: "GET",
        dataType: "json",
        headers: {
            "user-key": "02308553736bbacac2a5665f7ec68257"
        },
        data: {
            q: searchTerm,
            lat: myLocation.latitude,
            long: myLocation.longitude,
            radius: 10000,
            sort: "rating",
            order: "desc"
        }
    }).then(function (response) {

        let cardArray = [];

        // iterate through the sorted recipe array
        for (let i = 0; i < response.restaurants.length; i++) {

            let restaurantLocation = {
                "latitude": response.restaurants[i].restaurant.location.latitude,
                "longitude": response.restaurants[i].restaurant.location.longitude
            };

            distance = distanceBetweenLatLong(myLocation, restaurantLocation);



            // jQuery methods to build out the Bootstrap Cards
            let newCard = $("<div>").addClass("card animated bounceInRight");

            let newCardBody = $("<div>").addClass("card-body");
            let saveButton = $("<button>").addClass("btn btn-success float-right").text("Save");

            // Functionality not needed? Can change this to something more useful
            let cardBodyText = $("<div>");
            cardBodyText.addClass("w-75");
            
            cardBodyText.append($("<p>").text(
                `Average price for two: ${response.restaurants[i].restaurant.currency}${response.restaurants[i].restaurant.average_cost_for_two}`));
            cardBodyText.append($("<p>").text(
                `Address: ${response.restaurants[i].restaurant.location.address}`));


            let newA = $("<a>").attr({
                "href": response.restaurants[i].restaurant.url,
                "target": "_blank"
            });
            newA.addClass("card-header").text(`${response.restaurants[i].restaurant.name} | Rating: ${response.restaurants[i].restaurant.user_rating.aggregate_rating} | Distance from you: ${distance.toFixed(1)} miles`);

            newCard.append(newA);
            newCardBody.append(saveButton);
            newCardBody.append(cardBodyText);
            newCard.append(newCardBody);

            // After all components of the card have been added, push the jQuery object to cardArray
            cardArray.push(newCard);
        }
        return cardArray;

    }).then(function (jQueryObjectArray) {
        let newRow = $("<div>").addClass("row");
        //let newCol;

        //Clear recipe display
        $("#recipe-display").empty();

        // Check for empty array
        if (jQueryObjectArray.length === 0) {
            $("#recipe-display").append($("<p>").text("Something went wrong..."));
        }
        else { // Array has cards
            for (let i = 0; i < jQueryObjectArray.length; i++) {

                newCol = $("<div>").addClass("col-12 my-sm-2");

                jQueryObjectArray[i].appendTo(newCol);

                newCol.appendTo(newRow);

            }
            $("#recipe-display").append(newRow);
        }

    });

    $("#user-search").val(" ");

})