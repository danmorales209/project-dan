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

