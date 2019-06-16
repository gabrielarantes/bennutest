import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDv61xRVnditQZhRTcHuEQhQNxh7x0_bbY",
  authDomain: "bennu-50505.firebaseapp.com",
  databaseURL: "https://bennu-50505.firebaseio.com",
  projectId: "bennu-50505",
  storageBucket: "bennu-50505.appspot.com",
  messagingSenderId: "263780330873",
  appId: "1:263780330873:web:ab87e7715673afbc"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const database = firebase.database();
