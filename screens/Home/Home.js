import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  AsyncStorage,
  ScrollView,
  TouchableOpacity
} from "react-native";
import {
  Text,
  Avatar,
  Button,
  ListItem,
  CheckBox,
  Card,
  Icon
} from "react-native-elements";
//import Icon from "react-native-vector-icons/FontAwesome";

import { isEmpty } from "lodash";

import firebase from "firebase";
import "firebase/firestore";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: [],
      todoList: [],
      loading: true,
      courses: [
        {
          name: "React Native"
        },
        {
          name: "ReactJS"
        },
        {
          name: "Dialog Flow"
        },
        {
          name: "NodeJS"
        },
        {
          name: "Flutter"
        }
      ]
    };
  }

  logout() {
    //clearning the token
    AsyncStorage.setItem("token", "");
    this.props.navigation.navigate("Login");
  }

  async getTodoList() {
    let db = firebase.firestore();
    const settings = { timestampsInSnapshots: true };
    db.settings(settings);

    db.collection("todo").onSnapshot(docs => {
      docs.forEach(async doc => {
        await this.setState({
          todoList: [...this.state.todoList, doc.data()]
        });

        console.warn(JSON.stringify(this.state.todoList));
        //return await this.state.todoList;
      });
    });
  }

  async componentDidMount() {
    //getting all data from todo list
    this.getTodoList();
  }

  completeTodo(id, completed) {
    completed = !completed;
    console.warn(id, completed);
  }

  render() {
    return (
      <View style={styles.root}>
        <View style={{ flex: 1, marginTop: 25 }}>
          <ScrollView>
            {this.state.todoList.map((todo, index) => {
              return (
                <View key={index}>
                  <View style={{ flexDirection: "row" }}>
                    <CheckBox
                      onPress={() => {
                        this.completeTodo(todo.id, todo.completed);
                      }}
                      checked={todo.completed}
                    />

                    <Text style={styles.itemTodo}>{todo.title}</Text>
                  </View>
                </View>
              );
            })}

            <TouchableOpacity
              onPress={() => {
                this.addTodo;
              }}
            >
              <Icon
                reverse
                name="plus"
                type="font-awesome"
                color="#FA7043"
                containerStyle={{}}
              />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* <View>
          <Button
            icon={
              <Icon
                name="close"
                size={15}
                color="white"
                style={{ marginRight: 10 }}
              />
            }
            title="Sair"
            onPress={() => this.logout()}
          />
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 15,
    paddingTop: Platform.OS === "ios" ? 40 : 10
  },

  itemTodo: {
    marginTop: 15
  }
});
