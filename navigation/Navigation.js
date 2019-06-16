import { createStackNavigator } from "react-navigation";

import Login from "../screens/Login/Login";
import Home from "../screens/Home/Home";
import Todo from "../screens/Todo/Todo";

const Navigation = createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: {
        headerVisible: false,
        header: null
      }
    },

    Home: {
      screen: Home,
      navigationOptions: {
        headerVisible: false,
        header: null
      }
    },

    Todo: {
      screen: Todo,
      navigationOptions: {
        headerVisible: false,
        header: null
      }
    }
  },
  {
    initialRouteName: "Login",
    gesturesEnabled: false
  }
);

export default Navigation;
