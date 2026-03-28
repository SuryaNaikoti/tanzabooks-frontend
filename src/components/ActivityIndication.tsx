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

const ActivityIndication: React.FC<Props> = ({
  style,
  children,
  modalVisible,
}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{ height: hp(6) }}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};
export default ActivityIndication;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
  },
});
