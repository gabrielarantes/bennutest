/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { createStore } from "redux";
import { Provider } from "react-redux";

import firebase from "firebase";

import Navigation from "./navigation/Navigation";

export default class App extends Component {
  componentDidMount() {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyDv61xRVnditQZhRTcHuEQhQNxh7x0_bbY",
        authDomain: "bennu-50505.firebaseapp.com",
        databaseURL: "https://bennu-50505.firebaseio.com",
        projectId: "bennu-50505",
        storageBucket: "bennu-50505.appspot.com",
        messagingSenderId: "263780330873",
        appId: "1:263780330873:web:ab87e7715673afbc"
      });
    }
  }

  render() {
    return <Navigation />;
  }
}
