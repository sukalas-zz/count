document.addEventListener('DOMContentLoaded', () => init())

function init() {
  var firebaseConfig = {
    apiKey: "AIzaSyD0PQvEE39LuCa1B7X08dhDf245fcIHmSw",
    authDomain: "days-66754.firebaseapp.com",
    databaseURL: "https://days-66754.firebaseio.com",
    projectId: "days-66754",
    storageBucket: "",
    messagingSenderId: "294928976358",
    appId: "1:294928976358:web:4f16c5d38781049c"
  };
  // Initialize Cloud Firestore through Firebase
  firebase.initializeApp(firebaseConfig);
  const app = firebase.app()
  this.db = firebase.firestore();
  this.day = this.db.collection('days').doc('daysEntry');
  this.counter = 0;
  this.data = this.counter;

  getData();
  bindEvents();
}

function bindEvents() {
  const incrementDayCount = document.getElementById('add-day-container');
  const resetDayCount = document.getElementById('reset-day-container');
  incrementDayCount.addEventListener("click", () => updateDay());
  resetDayCount.addEventListener("click", () => resetDB());
}

function getData() {
  this.day.get().then( doc => {
    this.counter = doc.data().day;
    updateHtmlDayValue();
  })
}

function resetDB(){
  this.counter = 0;
  updateHtmlDayValue();
  this.day.update({day: 0});
}

function updateDay() {
  this.counter++;
  updateHtmlDayValue();
  this.day.update({day: this.counter});
}

function updateHtmlDayValue() {
  document.getElementById('dayValue').innerText = this.counter;
}
