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
var signOutButton = $("#signOutButton");
$("#searchField").hide();
$("#about").show();


var aboutParagraph = $("<p>").attr({
    "id" : "about",
    "class" : "animated fadeInDown m-sm-2 m-1"
}).html("<span class='title'>TOO MUCH FOOD</span> is what you have and WHERE YOU LOOK if you got carried away at your local farmers market or at Costco, or if your neighbor (the proud gardener) gave you 20 lbs. of zucchini. Simply enter the name of the food item that you have too much of into our recipe search and the results will be those recipes that utilize the greatest amount of that food item.  Alternatively, put it all in a crock pot set for tomorrow and pick a restaurant tonight using our restaurant search. Bon appetit.");

$("#signInButton").on("click", function (event) {
    event.preventDefault();
    // Sign in
    var email = $("#userEmail").val();
    var password = $("#userPassword").val();

    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(function (error) {
            // Handle Errors here.
            console.log(error)
        });
});
// Add signup event
$("#signUpButton").on("click", e => {
    e.preventDefault();
    var email = $("#newEmail").val();
    var password = $("#newPassword").val();
    console.log(email);
    console.log(password);
    // Get  FB authentication
    auth = firebase.auth();
    // Sign In
    promise = auth.createUserWithEmailAndPassword(email, password);
    promise.catch(e => console.log(e.message));
});

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        $("#signInModalButton").hide();
        $("#signUpModalButton").hide();
        $("#searchField").show();
        $("#searchField").css("display: inline-block;");
        $("#results-container").show();
        $("#recipe-display").append(aboutParagraph);
        signOutButton.show();

    } else {
        // No user is signed in.
        console.log("no user")
    }
});


signOutButton.on("click", function () {
    $("#signInModalButton").show();
    $("#signUpModalButton").show();
    $("#searchField").hide();
    signOutButton.hide();
    $("#recipe-display").empty();
    $("#results-container").hide();
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        console.log("signed out")
    }).catch(function (error) {
        // An error happened.
    });
})
