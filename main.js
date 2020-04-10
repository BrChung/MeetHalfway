// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAqfICa7uRQ6gF4MHy6hoVECO2KHKE1CkY",
    authDomain: "fir-practice-cc622.firebaseapp.com",
    databaseURL: "https://fir-practice-cc622.firebaseio.com",
    projectId: "fir-practice-cc622",
    storageBucket: "fir-practice-cc622.appspot.com",
    messagingSenderId: "349390897990",
    appId: "1:349390897990:web:0724c2fbbf9d1f2a945b47",
    measurementId: "G-13DVP4WD2H"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

//reference messages
var messagesRef = firebase.database().ref('messages');

//listen for for submit
document.getElementById('profileForm').addEventListener('submit', submitForm);

//submit the form
function submitForm(e)
{
    e.preventDefault();

    //get values
    var name = getInput('name');
    var email = getInput('email');
    var gender = getInput('gender');
    var city = getInput('city');
    var food = getInput('food');
    var activities = getInput('activities');
    var Meeting = getCheckbox('Meeting'); //
    var Dates = getCheckbox('Dates');
    var Celebration = getCheckbox('Celebration');
    var bio = getInput('bio');

    console.log(name);

    //save the messages to put in database
    saveMessage(name, email, gender, city, food, activities, Meeting, Dates, Celebration, bio);
    
}

//get form values

function getInput(id)
{
    return document.getElementById(id).value;
}

function getCheckbox(id)
{
    return document.getElementById(id).checked;
}

// save messages to firebase
function saveMessage(name, email, gender, city, food, activities, Meeting, Dates, Celebration, bio)
{
    var newMessageRef = messagesRef.push();
    newMessageRef.set({
        name: name,
        email: email,
        gender: gender,
        city: city,
        food: food,
        activities: activities,
        Meeting: Meeting,
        Dates: Dates,
        Celebration: Celebration,
        bio:bio
    })
}