import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  AsyncStorage,
  ScrollView,
  TouchableOpacity,
  TextInput
} from "react-native";
import {
  Text,
  Avatar,
  Button,
  ListItem,
  CheckBox,
  Card,
  Icon,
  Header,
  Input
} from "react-native-elements";
//import Icon from "react-native-vector-icons/FontAwesome";

import DateTimePicker from "react-native-modal-datetime-picker";

import { isEmpty } from "lodash";
import { format, endOfDay, getTime, setHours , setMinutes } from "date-fns";

import firebase from "firebase";
import "firebase/firestore";

export default class Todo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title : "",
      description : "",
      visibleDate: false,
      visibleTime: false,
      dateArray : [],
      date: "",
      dateStr: "",
      hour: ""
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

  async addTodo() {
    let title = this.state.title;
    let description = this.state.description;
    let date = this.state.date;
    let hour = this.state.hour;
    let error = 0;

    if (isEmpty(title)) {
      error = 1;
      msg = "O título não pode ser vazio";
    }

    if (isEmpty(date)) {
      error = 1;
      msg = "Preencha o campo data";
    }

    if (isEmpty(hour)) {
      error = 1;
      msg = "Selecione a hora da tarefa";
    }

    if (error === 1) {
      Alert.alert("Opa", msg, [{ text: "OK" }], { cancelable: false });
      return false;
    } else {
      let id = getTime(new Date());

      date = new Date(this.state.dateArray);
      let hourSplit = hour.split(":");
      let hourStr = parseInt(hourSplit[0]);
      let minuteStr = parseInt(hourSplit[1]);

      date = getTime(date)

      let db = firebase.firestore();
      const settings = { timestampsInSnapshots: true };
      db.settings(settings);

      await db
        .collection("todo")
        .doc(JSON.stringify(date))
        .set({
          id,
          title,
          description,
          date,
          created_at : id
        })
        .then(async data => {
          Alert.alert("OK", "Tarefa adicionada com sucesso", [{ text: "OK" }], { cancelable: false });
          this.setState({
            title : "",
      description : "",
      dateArray : [],
      date: "",
      dateStr: "",
      hour: ""
          })
        })
        .catch(error => {
          Alert.alert("ERROR", "Ocorreu algum problema. Tente novamente", [{ text: "OK" }], { cancelable: false });
        });
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          placement="left"
          leftComponent={
            <TouchableOpacity onPress={() => this.props.navigation.replace("Home")}>
              <Icon
                size={16}
                name="arrow-left"
                type="font-awesome"
                color="#0F618E"
              />
            </TouchableOpacity>
          }
          centerComponent={{
            text: "Adicionar nova tarefa",
            style: { color: "#fff" }
          }}
        />

        <View style={styles.root}>
          <View style={{ marginBottom: 15 }}>
            <Input
              inputStyle={{ fontSize: 24 }}
              label={"Título"}
              labelStyle={{ fontSize: 12, color: "#1D9BE4" }}
              placeholder="Título"
              value={this.state.title}
              onChangeText={text => {
                this.setState({ title: text });
              }}
            />
          </View>

          <View style={{ marginBottom: 15 }}>
            <Input
              placeholder="Descrição"
              label={"Descrição"}
              labelStyle={{ fontSize: 12, color: "#1D9BE4" }}
              multiline={true}
              value={this.state.description}
              onChangeText={text => {
                this.setState({ description: text });
              }}
            />
          </View>

          <Text
            style={{ fontSize: 12, color: "#1D9BE4", marginHorizontal: 10 }}
          >
            Data e hora de conclusão
          </Text>
          <View style={{ margin: 10, flexDirection: "row", flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ visibleDate: true });
              }}
              style={{ flex: 0.6, position: "relative" }}
            >
              <Text
                style={{
                  fontSize: 12,
                  borderBottomWidth: 2,
                  borderBottomColor: "gray"
                }}
              >
                {this.state.dateStr}
              </Text>
              <Icon
                name="arrow-down"
                type="font-awesome"
                size={8}
                color="#1D9BE4"
                iconStyle={{ position: "absolute", right: 0, bottom: 5 }}
              />
            </TouchableOpacity>
            <DateTimePicker
              onCancel={() => {
                this.setState({
                  visibleDate: false
                });
              }}
              onConfirm={date => {
                dateFormat = format(
                  endOfDay(new Date(date)),
                  "YYYY-MM-DD[T]HH:mm:ssZZ"
                );
                dateStr = format(endOfDay(new Date(date)), "DD/MM/YYYY");
                console.warn(date, dateStr);
                this.setState({
                  date: dateFormat,
                  dateStr: dateStr,
                  dateArray : date,
                  visibleDate: false
                });
              }}
              isVisible={this.state.visibleDate}
            />

            <DateTimePicker
              mode="time"
              onCancel={() => {
                this.setState({
                  visibleTime: false
                });
              }}
              onConfirm={hour => {
                hourStr = format(new Date(hour), "HH:mm");
                console.warn(hourStr);
                this.setState({
                  hour: hourStr,
                  visibleTime: false
                });
              }}
              isVisible={this.state.visibleTime}
            />

            <TouchableOpacity
              onPress={() => {
                this.setState({
                  visibleTime: true
                });
              }}
              style={{ flex: 0.4, position: "relative" }}
            >
              <Text
                style={{
                  fontSize: 12,
                  borderBottomWidth: 2,
                  borderBottomColor: "gray"
                }}
              >
                {this.state.hour}
              </Text>
              <Icon
                name="arrow-down"
                type="font-awesome"
                size={8}
                color="#1D9BE4"
                iconStyle={{ position: "absolute", right: 0, bottom: 5 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            this.addTodo();
            //this.props.navigation.navigate("Todo");
          }}
        >
          <Icon
            reverse
            name="check"
            type="font-awesome"
            color="#FA7043"
            containerStyle={{ position: "absolute", bottom: 15, right: 15 }}
          />
        </TouchableOpacity>
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
