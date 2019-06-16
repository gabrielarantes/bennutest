import React from "react";
import {
  Text,
  Image,
  View,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import { DrawerItems } from "react-navigation";

import { isDeviceTablet } from "../config/sizeConfig";

const logout = async props => {
  await AsyncStorage.removeItem("userToken");
  await AsyncStorage.removeItem("currentUser");
  await AsyncStorage.removeItem("pushToken");
  await AsyncStorage.removeItem("notificationsList");
  await AsyncStorage.removeItem("promotionPrize");
  props.navigation.navigate("Login");
};

const SideMenuContent = props => {
  const { items, ...rest } = props;
  const filteredItems = items.filter(item => item.key !== "ApdpNavigator");
  return (
    <View style={[styles.container]}>
      <View style={styles.drawerHeader}>
        <Image
          source={require("../assets/imgs/logoOiBranco.png")}
          style={styles.image}
        />
      </View>

      <TouchableOpacity style={{ margin: 15 }} onPress={() => logout(props)}>
        <Text
          style={{
            color: theme.colors.white,
            fontFamily: theme.fonts.simplonBold
          }}
        >
          Sair
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ margin: 15 }} onPress={() => logout(props)}>
        <Text
          style={{
            color: theme.colors.white,
            fontFamily: theme.fonts.simplonBold
          }}
        >
          Sair
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          marginTop: "90%",
          fontSize: theme.fonts.smaller,
          color: theme.colors.white,
          fontFamily: theme.fonts.simplonRegular,
          marginLeft: 5
        }}
      >
        Desenvolvido por Total Commit
      </Text>
    </View>
  );
};

export default SideMenuContent;

const stylesTablet = StyleSheet.create({});

const styles = StyleSheet.create({
  menuItem: {},

  container: {
    flex: 1,
    backgroundColor: theme.colors.grayMenu
  },

  drawerHeader: {
    backgroundColor: theme.colors.grayMenu,
    marginLeft: 20,
    width: 100,
    borderWidth: 0,
    marginTop: 40
  },

  image: {
    width: 80,
    height: 68,
    marginBottom: 75
  },

  drawerImage: {
    height: 150,
    width: 150,
    borderRadius: 75
  }
});
