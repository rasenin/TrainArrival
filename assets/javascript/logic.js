// Initialize Firebase
var config = {
  apiKey: "AIzaSyCCyiwT5TUFMktEeaxKkXwuL_B6fqI6kgg",
  authDomain: "train-activity-bc697.firebaseapp.com",
  databaseURL: "https://train-activity-bc697.firebaseio.com",
  projectId: "train-activity-bc697",
  storageBucket: "train-activity-bc697.appspot.com",
  messagingSenderId: "650070743653"
};
firebase.initializeApp(config);

let trainName, destination, firstTime, frequency;

$("#add-train").on("click", function() {
  event.preventDefault();
  trainName = $("#trainNameInput")
    .val()
    .trim();
  destination = $("#destinationInput")
    .val()
    .trim();
  firstTime = $("#firstTimeInput")
    .val()
    .trim();
  frequency = $("#frequencyInput")
    .val()
    .trim(); 

  let firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

  // Difference between now and first train arrival time
  let diffTime = moment().diff(moment(firstTimeConverted), "minutes");

  // Time apart (remainder)
  let tRemainder = diffTime % parseInt(frequency);

  // Minute Until Train
  let tMinutesTillTrain = parseInt(frequency) - tRemainder;

  // Next Train
  let nextTrain = moment().add(tMinutesTillTrain, "minutes");

  firebase
    .database()
    .ref()
    .push({
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      arrivalTime: nextTrain,
      minutesTill: tMinutesTillTrain
    });
});

firebase.database().ref().on(
  "child_added",
  function(snapshot) {
    let tableRow = $("<tr>");

    let nameField = $("<td>").text(snapshot.val().trainName);
    let destinationField = $("<td>").text(snapshot.val().destination);
    let frequencyField = $("<td>").text(snapshot.val().frequency);
    let arrivalTimeField = $("<td>").text(snapshot.val().arrivalTime);
    let minutesTillField = $("<td>").text(snapshot.val().minutesTill);

    tableRow.append(nameField);
    tableRow.append(destinationField);
    tableRow.append(frequencyField);
    tableRow.append(arrivalTimeField);
    tableRow.append(minutesTillField);

    $("#train-info").append(tableRow);
  }, // Handle the errors
  function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  }
);
