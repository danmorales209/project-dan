
// Order recipes from most to least in terms of grams of the required ingredient
function sortByWeight(ingredient, data) {
    let outputArray = [];
    let recipeWeights = [];
    let maxWeight;
    let maxWeightIndex = 0;
    let isSorted = false;
    let ingredientQuery = "";


    if (ingredient.includes(",")) {
        ingredientQuery = ingredient.split(",")[0];
    }
    else if (ingredient.includes(" ")) {
        ingredientQuery = ingredient.split(" ")[0];
    }
    else {
        ingredientQuery = ingredient;
    }

    // find the weight of the ingredient of choice and add to an recipeWeights array
    // not very efficient, 
    for (let i = 0; i < data.hits.length; i++) {
        console.log(data.hits[i].recipe.label)
        for (let j = 0; j < data.hits[i].recipe.ingredients.length; j++) {
            if (data.hits[i].recipe.ingredients[j].text.includes(ingredientQuery)) {
                recipeWeights.push([
                    data.hits[i].recipe.ingredients[j].weight,
                    i
                ]);
            }
        }
        //alert(recipeWeights[i][0] + " " + recipeWeights[i][1]);
    }

    while (!isSorted) {
        maxWeight = [0, 0];
        maxWeightIndex = 0;

        for (let i = 0; i < recipeWeights.length; i++) {
            if (recipeWeights[i][0] > maxWeight[0]) {
                maxWeight = recipeWeights[i];
                maxWeightIndex = i;
            }
        }

        if (maxWeight.length === 0) { // weight was not reassigned during previous loop
            maxWeight = [0, 0];
            maxWeightIndex = 0;
        }

        outputArray.push(data.hits[maxWeight[1]]);
        console.log(data.hits[maxWeight[1]].recipe.label);

        console.log(maxWeight + " " + maxWeightIndex + " array length: " + recipeWeights.length);

        if (maxWeightIndex === 0) { // if first index 
            recipeWeights.shift();
            console.log("case 1");
        }
        else if (maxWeightIndex === recipeWeights.length - 1) { // if last index
            recipeWeights.pop();
            console.log("case 2");
        }
        else { // somewhere inbetween
            recipeWeights.splice(maxWeightIndex, 1);
            console.log("case 3");
        }

        if (recipeWeights.length === 0) {
            isSorted = true;
        }
    }

    return outputArray;
}

$("#searchButton").on("click", function (e) {
    e.preventDefault();
    var input = $("#user-search").val().trim();
    $("#user-search").val(" ");
    $.ajax({
        url: "https://api.edamam.com/search",
        type: "GET",
        dataType: "json",
        data: {
            "q": input,
            "app_id": "66831f0c",
            "app_key": "ddc7c6490ffc861d706c7d47d312419d",
        }
    }).then(function (response) {

        sortedRecipes = sortByWeight(input, response);
        console.log("Edamam", sortedRecipes);
        let cardArray = [];

        for (let i = 0; i < sortedRecipes.length; i++) {

            let ingredientOfInterestIndex = 0;

            for (let j = 0; j < sortedRecipes[i].recipe.ingredients.length; j++) {
                if (sortedRecipes[i].recipe.ingredients[j].text.includes(input)) {
                    ingredientOfInterestIndex = j;
                }
            }

            let newCard = $("<div>").addClass("card");
            let recipePic = $("<img>").attr({
                "src": sortedRecipes[i].recipe.image,
                "alt": sortedRecipes[i].recipe.label + " recipe"
            });
            recipePic.addClass("card-img-top");

            let newCardBody = $("<div>").addClass("card-body");
            let saveButton = $("<button>").addClass("btn btn-success").text("Save");
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

            cardArray.push(newCard);
        }
        return cardArray;
    }).then(function (jQueryObjectArray) {
        $("#recipe-display").empty();
        if (jQueryObjectArray.length === 0) {
            $("#recipe-display").append($("<p>").text("Something went wrong..."));
        }
        else {
            for (let i = 0; i < jQueryObjectArray.length; i++) {
                jQueryObjectArray[i].appendTo($("#recipe-display"));
                if ((i+1) %3 ===0) {
                    $("#recipe.display").append($("<br>"));
                }
            }
        }
    });


});