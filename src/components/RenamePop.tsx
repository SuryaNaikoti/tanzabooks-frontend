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

const RenamePop: React.FC<Props> = ({ style, children, modalVisible }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView style={{ height: hp(6) }}>{children}</ScrollView>
        </View>
      </View>
    </Modal>
  );
};
export default RenamePop;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    // padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: wp(120) <= 768 ? wp(80) : wp(40),
    height: hp(14),
  },
});
