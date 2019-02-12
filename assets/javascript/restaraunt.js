function distanceBetweenLatLong(origin, location) {
    // Function uses Haversince's formula to determine the distance between two sets of latitudes and longitudes
    // project has link to Wikipedia article
    let radiusOfEarth = 6371 // km
    let dLat = degToRad(location.latitude - origin.latitude); // radians
    let dLong = degToRad(location.longitude - origin.longitude);// radians

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(degToRad(location.latitude)) * Math.cos(degToRad(origin.latitude)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = radiusOfEarth * c;

    return (d * 0.621371) // return miles
}

function degToRad(degrees) {
    // formula to convert degrees into radians
    return (degrees * (Math.PI / 180));
}

// Add event listener to restaurant seach button
$("#restaurantButton").on("click", function (event) {
    // Prevent page from reloading after function execution
    event.preventDefault();

    // Get user input from <input> in html
    var searchTerm = $("#user-search").val().trim();

    // pull location from sessionStorage
    var myLocation = {
        "latitude": sessionStorage.myLat,
        "longitude": sessionStorage.myLon
    };

    // Initialize the distance between user and restaurant
    let distance = 0;

    // check for comma separated values.
    if (searchTerm.includes(",")) { // string has commas

        // searchterm is split into an array of strings with ","  as the deliminator
        // assign seachTerm the first element of the slit array
        searchTerm = searchTerm.split(",")[0];
    }

    // Ajax query for Zomato API
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
            radius: 10000, // meters
            sort: "rating",
            order: "desc"
        }
        // build jQuery objects to make Bootstrap 4 cards
    }).then(function (response) {

        // Initialize card Array
        let cardArray = [];

        // iterate through the returned restaurant array
        for (let i = 0; i < response.restaurants.length; i++) {

            // Get restaurant location in lat / long
            let restaurantLocation = {
                "latitude": response.restaurants[i].restaurant.location.latitude,
                "longitude": response.restaurants[i].restaurant.location.longitude
            };

            // Calculate the distance between the user location and the restaurant. Distance is the length of the arc
            // between the user and restaurant, "as the crow flies".
            distance = distanceBetweenLatLong(myLocation, restaurantLocation);

            // jQuery methods to build out the Bootstrap Cards
            let newCard = $("<div>").addClass("card restaurant-card");

            let newCardBody = $("<div>").addClass("card-body");
            let saveButton = $("<button>").addClass("btn btn-success float-right").text("Save");

            // Functionality not needed? Can change this to something more useful
            let cardBodyText = $("<div>");
            cardBodyText.addClass("w-75");

            // Get cost of restaurant for 2 (from Zomato data)
            cardBodyText.append($("<p>").text(
                `Average price for two: ${response.restaurants[i].restaurant.currency}${response.restaurants[i].restaurant.average_cost_for_two}`));

            // Get the sored restaurant address
            cardBodyText.append($("<p>").text(
                `Address: ${response.restaurants[i].restaurant.location.address}`));

            // Header is a link with the provided information about the restaurant website
            let newA = $("<a>").attr({
                "href": response.restaurants[i].restaurant.url,
                "target": "_blank"
            });

            // Add restaurant name, rateing, and distnace to the text of thie link
            newA.addClass("card-header").text(`${response.restaurants[i].restaurant.name} | Rating: ${response.restaurants[i].restaurant.user_rating.aggregate_rating} | Distance from you: ${distance.toFixed(1)} miles`);

            newCard.append(newA);
            newCardBody.append(saveButton);
            newCardBody.append(cardBodyText);
            newCard.append(newCardBody);

            // After all components of the card have been added, push the jQuery object to cardArray
            cardArray.push(newCard);
        }
        // pass the card array to the next function to build out the cards once the ajax query is complete
        return cardArray;

        // Place cards into index.html
    }).then(function (jQueryObjectArray) {

        // create bootstrap 4 div with row class
        let newRow = $("<div>").addClass("row");

        //Clear recipe display
        $("#recipe-display").empty();

        // Check for empty array
        if (jQueryObjectArray.length === 0) {
            $("#recipe-display").append($("<p>").text(`no restaurants found relating to ${searchTerm}`));
        }
        else { // Array has cards
            for (let i = 0; i < jQueryObjectArray.length; i++) {

                // Create bootstrap 4 col-12 class with margin
                newCol = $("<div>").addClass("col-12 my-sm-2");

                // Append the card to the col
                jQueryObjectArray[i].appendTo(newCol);

                // append the col to the row 
                // each col is essentially its own row due to bootstrap rendering
                newCol.appendTo(newRow);

            }
            // append row to HTML
            $("#recipe-display").append(newRow);
        }

    });

    // clear the user-search input
    $("#user-search").val("");

})