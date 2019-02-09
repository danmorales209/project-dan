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
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });
})
