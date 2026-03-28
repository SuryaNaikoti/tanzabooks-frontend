import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Homenav from "../components/Homenav";
import { wp } from "../utils";

const TanzaPedia = () => {
  return (
    <>
      <Homenav />
      <View style={styles.container}>
        <Image
          source={require("../../assets/comingGIF.gif")}
          style={{
            width: 600,
            height: 350,
            resizeMode: "contain",
            alignSelf: "center",
            borderRadius: 10,
          }}
        />
        <Text style={{ fontSize: 25 }}>Coming Soon...</Text>
      </View>
    </>
  );
};
export default TanzaPedia;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: wp(100) < 425 ? 0 : 60,
    backgroundColor: "white",
    flex: 1,
  },
});
