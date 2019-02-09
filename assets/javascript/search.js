
// Order recipes from most to least in terms of grams of the required ingredient
function sortByWeight(ingredientQuery, data) {
    let outputArray = [];
    let recipeWeights = [];
    let maxWeight;
    let maxWeightIndex = 0;
    let isSorted = false;

    // find the weight of the ingredient of choice and add to an recipeWeights array
    // recipeWeights weights array is built iteratively using the following loop:

    // outer loop iterates throught the array of recipe hits
    for (let i = 0; i < data.hits.length; i++) {

        // inner loop iterates through the ingredients array in the recipe
        for (let j = 0; j < data.hits[i].recipe.ingredients.length; j++) {

            // ingredients is an array of objects, with properties:
            //      text:   A string containing a description of the ingredient with contextual information
            //      weight: The weight of the ingredient in grams
            // Check that the text property contains the ingredient of choice. Use .toLowerCase to align with input.
            // Actual comparison is accomplished using String.includes() method
            if (data.hits[i].recipe.ingredients[j].text.toLowerCase().includes(ingredientQuery)) {

                // Recipe weights array grows when the ingredient is found, so should be 1 shorter than the index
                if (recipeWeights.length - 1 < i) { // ingredient hasn't been found yet

                    // Add 2 element array at index i to recipeWeights
                    // recipeWeights [i][0] containes the weight of the ingredient,
                    // recipeWeights [i][1] containes the index of the original array (important for later)
                    recipeWeights.push([
                        data.hits[i].recipe.ingredients[j].weight,
                        i
                    ]);
                }

                // Case to deal with multiple instances of the ingredient. Will update if the next line has a higher weight of the ingredient
                // Might be appropiate to check for duplicates / accumulate more <-- addition for later date --> 
                else if (((recipeWeights.length - 1) === i) && (recipeWeights[i][0] < data.hits[i].recipe.ingredients[j].weight)) {
                    recipeWeights[i][0] = data.hits[i].recipe.ingredients[j].weight;
                }
            }
        }
    }

    for (let i = 0; i < recipeWeights.length; i++) {
    }

    // Now have a 2D array of weights and indices. 
    // The outer loop iterates until isSorted is true. Use this to iterate over recipeWeights array. Loop checks for highest
    // weight, and adds the recipe data to the output array from the original JSON query array. After the max is found, the
    // element is removed from the recipeWeights array, until the recipe wieghts array is empty.
    while (!isSorted) {
        // Reset values
        maxWeight = [0, 0];
        maxWeightIndex = 0;

        // inner loops finds the max weight in the iteration. maxWeight stores the appicable 2 element array from 
        // recipeWeights array.
        for (let i = 0; i < recipeWeights.length; i++) {
            if (recipeWeights[i][0] > maxWeight[0]) {
                maxWeight = recipeWeights[i];
                maxWeightIndex = i;
            }
        }

        // Use the second element of maxWeights to push the corresponsing element from API query result to output
        // array.
        outputArray.push(data.hits[maxWeight[1]]);

        // This removes the max weight from the recipeWeights array. Use different methods depending on where the
        // max weight was in the array
        if (maxWeightIndex === 0) { // if first index 
            recipeWeights.shift();
        }

        else if (maxWeightIndex === recipeWeights.length - 1) { // if last index
            recipeWeights.pop();
        }

        else { // somewhere in between
            recipeWeights.splice(maxWeightIndex, 1);
        }

        // Exit condition for while loop
        if (recipeWeights.length === 0) {
            isSorted = true;
        }
    }

    return outputArray;
}

// Add event listener for user-search button
$("#searchButton").on("click", function (e) {

    e.preventDefault();
    var input = $("#user-search").val().trim();
    $("#user-search").val(" ");

    e.preventDefault(); // Prevent the page from reloading on click

    // Get user input from the input text
    var rawInput = $("#user-search").val().trim();

    // check input for multiple ingredients. Only uses first ingredient for sorting
    // Also use .toLowerCase to ensure uniform input
    if (rawInput.includes(",")) { // multiple ingredients
        input = rawInput.split(",")[0].toLowerCase();
    }
    else { // only one input
        input = rawInput.toLowerCase();
    }


    // jQuery Ajax call for the edamam API
    $.ajax({
        url: "https://api.edamam.com/search",
        type: "GET",
        dataType: "json",
        data: {
            "q": rawInput.toLowerCase(),
            "app_id": "66831f0c",
            "app_key": "ddc7c6490ffc861d706c7d47d312419d",
        }

        // Build out jQuery cards (based upon Bootstrap 4)
    }).then(function (response) {

        // Call the sortByWeigt function to get an array of the recipes sorted in decensing order of grams of the
        // chose ingredient
        sortedRecipes = sortByWeight(input, response);

        let cardArray = [];

        // iterate through the sorted recipe array
        for (let i = 0; i < sortedRecipes.length; i++) {

            // reset this index value (will store the array value of the ingredient of interest)
            let ingredientOfInterestIndex = 0;

            // find the index of the ingredient. *** Finds first instancse, not necesarily the hightest*** 
            /* Functionality Not needed? */
            for (let j = 0; j < sortedRecipes[i].recipe.ingredients.length; j++) {
                if (sortedRecipes[i].recipe.ingredients[j].text.includes(input)) {
                    ingredientOfInterestIndex = j;
                }
            }

            // jQuery methods to build out the Bootstrap Cards
            let newCard = $("<div>").addClass("card");
            let recipePic = $("<img>").attr({
                "src": sortedRecipes[i].recipe.image,
                "alt": sortedRecipes[i].recipe.label + " recipe"
            });
            recipePic.addClass("card-img-top");

            let newCardBody = $("<div>").addClass("card-body");
            let saveButton = $("<button>").addClass("btn btn-success").text("Save");

            // Functionality not needed? Can change this to something more useful
            let cardBodyText = $("<p>").text(input + ": " + parseInt(sortedRecipes[i].recipe.ingredients[ingredientOfInterestIndex].weight) + " grams.");
            let newA = $("<a>").attr({
                "href": sortedRecipes[i].recipe.url,
                "target": "_blank"
            });
            newA.addClass("card-header").text(sortedRecipes[i].recipe.label);

            newCard.append(newA);
            newCard.append(recipePic);
            newCardBody.append(cardBodyText);
            newCardBody.append(saveButton);
            newCard.append(newCardBody);

            // After all components of the card have been added, push the jQuery object to cardArray
            cardArray.push(newCard);
        }
        return cardArray;

        // Updates the cards on the HTML after the previous queries are completed
    }).then(function (jQueryObjectArray) {
        let newRow = $("<div>").addClass("row");
        let newCol;

        //Clear recipe display
        $("#recipe-display").empty();

        // Check for empty array
        if (jQueryObjectArray.length === 0) {
            $("#recipe-display").append($("<p>").text("Something went wrong..."));
        }
        else { // Array has cards
            for (let i = 0; i < jQueryObjectArray.length; i++) {

                newCol = $("<div>").addClass("col-sm-4 my-sm-2");

                jQueryObjectArray[i].appendTo(newCol);

                newCol.appendTo(newRow);

                if ((i + 1) % 3 === 0) {
                    $("#recipe-display").append(newRow);
                    newRow = $("<div>").addClass("row");
                }
            }
            $("#recipe-display").append(newRow);
        }
    });



});

});

