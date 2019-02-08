// Initialize Firebase
var config = {
    apiKey: "AIzaSyCPuxUPfHfGN8dNwXc-K9h2j4fE5Re1nU0",
    authDomain: "project-dan-a33a0.firebaseapp.com",
    databaseURL: "https://project-dan-a33a0.firebaseio.com",
    projectId: "project-dan-a33a0",
    storageBucket: "project-dan-a33a0.appspot.com",
    messagingSenderId: "151263152160"
};
firebase.initializeApp(config);
var database = firebase.database();

$("#signin").on("click", function (event) {
    event.preventDefault();

    // Sign in
    var email = $("#userEmail").val();
    var password = $("#userPassword").val();

    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
        });
});
// Add signup event
$("#signUpButton").on("click", e => {
    e.preventDefault();
    var input = $("#user-input").val().trim();
    // database.ref().push({
    //     input: input,
    // })
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
