
// Order recipes from most to least in terms of grams of the required ingredient
function sortByWeight(ingredient, data) {
    let sortedRecipes = [];
    let weightsIndex = [];
    let maxWeight = Number.NEGATIVE_INFINITY;

    for(let i = 0; i < data.hits.length; i++) {
        for(let j = 0; j < data.hits[i].recipe.ingredients.length; j++) {

        }
    }
}

$("#searchButton").on("click", function (e) {
    e.preventDefault();
    var input = $("#user-input").val().trim();
    console.log(input);

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
        console.log("Edamam", response);

        for (let i = 0; i < response.hits.length; i++) {

            let foundRecipes = response.hits[i].recipe;

            let newCard = $("<div>").addClass("card");
            let recipePic = $("<img>").attr({
                "src": foundRecipes.image,
                "alt": foundRecipes.label + " recipe"
            });

            let newCardBody = $("<div>").addClass("card-body");
            let saveButton = $("<button>").addClass("btn btn-success").text("Save");
            let cardBodyText = $("<p>").text("Placeholder");
            let newA = $("<a>").attr({
                "href": foundRecipes.url,
                "target": "_blank"
            });
            newA.addClass("card-img-top");

            newA.append(recipePic);
            
            newCard.append(newA);
            newCardBody.append(cardBodyText);
            newCardBody.append(saveButton);
            newCard.append(newCardBody);

            newCard.appendTo($("#recipe-display"));
        }
    });


    $("#user-input").val("");
});