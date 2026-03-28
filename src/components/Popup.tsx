import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { View, Modal } from "react-native";
import { hp, scale, shadow, wp } from "../utils";

interface Props {
  style?: any;
  children?: React.ReactNode;
  type?: any;
  modalVisible: boolean;
}

const Popup: React.FC<Props> = ({ style, children, modalVisible }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View>{children}</View>
        </View>
      </View>
    </Modal>
  );
};
export default Popup;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: wp(100) <= 768 ? wp(80) : wp(50),
    // height: wp(100) < 426 ?  hp(90) : hp(93)
  },
});
