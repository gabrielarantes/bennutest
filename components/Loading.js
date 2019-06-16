import React, { Component } from "react";
import Spinner from "react-native-loading-spinner-overlay";

const Loading = visible => {
  return (
    <View style={styles.container}>
      <Spinner
        visible={visible}
        textContent={"Carregando..."}
        textStyle={styles.spinnerTextStyle}
      />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});
