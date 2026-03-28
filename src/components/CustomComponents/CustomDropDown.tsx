import React, { FC, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { colors, wp } from "../../utils";

interface Props {
  label: string;
  data: Array<string>;
  value: string;
  onSelect: (value: string) => void;
}

const CustomDropdown: FC<Props> = ({ label, value, onSelect, data }) => {
  const DropdownButton = useRef();
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [dropdownRight, setDropdownRight] = useState(0);
  const [visible, setVisible] = useState(false);
  const toggleDropdown = (): void => {
    visible ? closeDropdown() : openDropdown();
  };

  const closeDropdown = () => {
    document.body.style.overflow = "auto";
    setVisible(false);
  };

  const openDropdown = (): void => {
    DropdownButton.current?.measure((_fx, _fy, w, h, px, py) => {
      console.log({ _fx, _fy, w, h, px, py });
      setDropdownTop(py + h);
      setDropdownLeft(px);
      setDropdownRight(w);
    });
    setVisible(true);
    document.body.style.overflow = "hidden";
    //  document.body.style.='none'
  };

  const onItemPress = (item: any) => {
    onSelect(item);
    closeDropdown();
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
      <Text style={{ fontFamily: "poppins-Regular" }}>{item}</Text>
    </TouchableOpacity>
  );

  const renderDropdown = () => {
    return (
      <Modal visible={visible} transparent animationType="none">
        <ScrollView>
          <TouchableOpacity style={styles.overlay} onPress={toggleDropdown}>
            <View
              style={[
                styles.dropdown,
                { top: dropdownTop, left: dropdownLeft, width: dropdownRight },
              ]}
            >
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    );
  };

  return (
    <TouchableOpacity
      ref={DropdownButton}
      style={styles.button}
      onPress={toggleDropdown}
    >
      {renderDropdown()}
      <Text style={value ? styles.buttonText : styles.labelText}>
        {value ? value : label}
      </Text>
      {/* <AntDesign name={visible ? "up" : "down"} size={20} /> */}
      {visible ? (
        <View>
          <AntDesign name="up" size={20} color="black" />
        </View>
      ) : (
        <View>
          <AntDesign name="down" size={20} color="black" />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    height: 38,
    width: "100%",
    paddingHorizontal: 14,
    gap: 20,
    zIndex: 1,
  },
  buttonText: {
    flex: 1,
    fontFamily: "poppins-Regular",
  },
  labelText: {
    flex: 1,
    fontFamily: "poppins-Regular",
    color: "gray",
  },
  dropdown: {
    position: "fixed",
    backgroundColor: "#ffff",
    shadowColor: "#000000",
    shadowRadius: 4,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.5,
    borderRadius: 10,
    marginTop: 10,
  },
  overlay: {},
  item: {
    padding: 5,
    borderRadius: 10,
    fontFamily: "poppins-Regular",
  },
  image: {
    alignSelf: "center",
    resizeMode: "contain",
    padding: 5,
    // marginTop: 15,
  },
});
