document.addEventListener('DOMContentLoaded', () => init())

const init = () => {
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
    // const.
    // Terms of service url/callback.
    tosUrl: '<your-tos-url>',
    // Privacy policy url/callback.
    privacyPolicyUrl: () => {
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
  this.date = null;
  this.loggerIsBusy = false;
  this.$counterInterface = document.getElementById('counter-container');
  this.$firebaseuiAuthContainer = document.getElementById('firebaseui-auth-container');
  this.$day = document.getElementById('dayValue');
  this.$error = document.getElementById('errorMessage');
  this.allowLog = true;
  initDisplay();
  bindEvents();
}

const bindEvents = () => {
  const incrementDayCount = document.getElementById('add-day-container');
  const resetDayCount = document.getElementById('reset-day-container');
  incrementDayCount.addEventListener("click", () => incrementDay());
  resetDayCount.addEventListener("click", () => resetDaysDb());
}

const initDisplay = () => {
  getData().then( res => {
    this.counter = res.day;
    this.date = res.date;
    updateHtmlDayValue();
  })
}

const getData = () => {
  return this.day.get().then( doc => {
    return doc.data();
  })
}

const resetDaysDb = () => {
  this.counter = 0;
  updateHtmlDayValue();
  this.day.update({day: this.counter, date: getDateInMs(), firstDay: true});
  this.$error.classList.add('is-hidden');
}

const incrementDay = () => {
  getData().then( res => {
    if( isEntryValid() || res.firstDay ) {
      this.counter = res.day + 1;
      updateHtmlDayValue();
      this.day.update({day: this.counter, date: getDateInMs(), firstDay: false});
    } else {
      if(!this.loggerIsBusy) {
        this.loggerIsBusy = true;
        logHtmlError();
        hideHtmlError();
      }
    }
  })
}

const getDateInMs = () => {
  return new Date().getTime();
}

const updateHtmlDayValue = () => {
  this.$day.innerText = this.counter;
}

const logHtmlError = () => {
  this.$error.innerText = `Time left: ${remainingTimeFormated()}`;
  if(!this.loggerIsBusy) {
    clearTimeout(showMessage);
  }
}

const showMessage = () => { 
  this.$error.classList.add('is-hidden');
  this.loggerIsBusy = false;
};

const hideHtmlError = () => {
  this.$error.classList.remove('is-hidden');
  this.$error.innerText = `Time left: ${remainingTimeFormated()}`;
  setTimeout(showMessage, 3000);
}

const remainingTimeFormated = () => {
  const timeDiff = getTimeDiff();
  const clockTime = msToTime(timeDiff);
  return `${ 24 - clockTime.hours}:${ 60 - clockTime.minutes}:${ 60 - clockTime.seconds}`;
}

const isEntryValid = () => {
  return isWithin24Hours();
}

const getTimeDiff = () => {
  return getDateInMs() - this.date;
}

const isWithin24Hours = () => {
  const msDiff = getTimeDiff();
  return msDiff <= 1 ? true : false;
}

const msToTime = (ms) => {
  const seconds = Math.floor(ms/1000);
  const minutes = Math.floor(seconds/60);
  const hours = Math.floor(minutes/60);
  return {
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
  };
}
