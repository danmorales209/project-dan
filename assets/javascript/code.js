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

$("#searchButton").on("click", function (e) {
    e.preventDefault();
   var input = $("#user-input").val().trim();
    // database.ref().push({
    //     input: input,
    // })
    console.log(input);
    $("#user-input").val(" ");
});