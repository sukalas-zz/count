document.addEventListener('DOMContentLoaded', () => init())

function init() {
  const firebaseConfig = {
    apiKey: "AIzaSyD0PQvEE39LuCa1B7X08dhDf245fcIHmSw",
    authDomain: "days-66754.firebaseapp.com",
    databaseURL: "https://days-66754.firebaseio.com",
    projectId: "days-66754",
    storageBucket: "",
    messagingSenderId: "294928976358",
    appId: "1:294928976358:web:4f16c5d38781049c"
  };

  // FirebaseUI config.
  const uiConfig = {
    signInSuccessUrl: 'https://days-66754.firebaseapp.com',
    signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    // tosUrl and privacyPolicyUrl accept either url string or a callback
    // function.
    // Terms of service url/callback.
    tosUrl: '<your-tos-url>',
    // Privacy policy url/callback.
    privacyPolicyUrl: function() {
    window.location.assign('<your-privacy-policy-url>');
    }
  };

  // Initialize Cloud Firestore through Firebase
  firebase.initializeApp(firebaseConfig);

  // // Initialize the FirebaseUI Widget using Firebase.
  const ui = new firebaseui.auth.AuthUI(firebase.auth());
  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseui-auth-container', uiConfig);

  firebase.auth().onAuthStateChanged( (user) => {
    if (user.email === "litridis@gmail.com") {
      // User is signed in.
      this.$counterInterface.classList.remove('is-hidden');
      this.$firebaseuiAuthContainer.classList.add('is-hidden');
    } else {
      console.error('fuck off');
    }
  })
  const app = firebase.app();

  this.db = firebase.firestore();
  this.day = this.db.collection('days').doc('daysEntry');
  this.counter = 0;
  this.data = this.counter;
  this.date = getDate();
  this.$counterInterface = document.getElementById('counter-container');
  this.$firebaseuiAuthContainer = document.getElementById('firebaseui-auth-container');
  this.$day = document.getElementById('dayValue');
  this.$error = document.getElementById('errorMessage');
  this.allowLog = true;
  initDisplay();
  bindEvents();
}

function bindEvents() {
  const incrementDayCount = document.getElementById('add-day-container');
  const resetDayCount = document.getElementById('reset-day-container');
  incrementDayCount.addEventListener("click", () => incrementDay());
  resetDayCount.addEventListener("click", () => resetDaysDb());
}

function initDisplay() {
  getData().then( res => {
    this.counter = res.day;
    updateHtmlDayValue();
  })
}

function getData() {
  return this.day.get().then( doc => {
    return doc.data();
  })
}

function resetDaysDb(){
  this.counter = 0;
  updateHtmlDayValue();
  this.day.update({day: this.counter, date: getDate(), firstDay: true});
  this.$error.classList.add('is-hidden');
}

function incrementDay() {
  getData().then( res => {
    if( dayEntryIsValid() || res.firstDay ) {
      this.counter = res.day + 1;
      updateHtmlDayValue();
      this.day.update({day: this.counter, date: getDate(), firstDay: false});
    } else {
      logHtmlError();
    }
  })
}

function getDate() {
  return new Date().getTime();
}

function updateHtmlDayValue() {
  this.$day.innerText = this.counter;
}

function logHtmlError() {
  this.$error.classList.remove('is-hidden');
  const hoursToLogAgain = 24 - (msToDays(getDate()) - msToDays(this.date));
  this.$error.innerText = `You can log again in ${hoursToLogAgain} hrs`;
  setTimeout(() => {
    this.$error.classList.add('is-hidden');
  }, 3000);
}

function calculateHoursLeftToEnableDayLoging(){
  return 24 - (msToDays(getDate()) - msToDays(this.date))
}

function dayEntryIsValid() {
  const daysRecord = msToDays(this.date);
  const daysNow =  msToDays(getDate());
  const daysDiff = daysNow - daysRecord;
  return ((daysDiff > 1) && (daysDiff < 2)) ? true : false;
}

function msToDays(ms) {
  return (((ms / 1000 ) / 60) / 60) / 24
}
