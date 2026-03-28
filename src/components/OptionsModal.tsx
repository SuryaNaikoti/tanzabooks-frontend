import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { wp } from "../utils";
import { useNavigation, useRoute } from "@react-navigation/core";
import Bounce from "react-reveal/Bounce";
import { Entypo } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";

export const OptionsModal = ({ setModel, setselected_tab }: any) => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  return (
    <Bounce right>
      <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
        <View>
          <View style={styles.model}>
            <TouchableOpacity
              style={styles.profile}
              onPress={() => {
                setModel(false);
                window.location.href = "tanzapedia";
              }}
            >
              {/* <AntDesign
                name="user"
                size={20}
                color="black"
                style={{ marginLeft: 10 }}
              /> */}
              <Text style={styles.profileText}>Tanzapedia</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
                style={styles.profile}
                onPress={() => {
                  setModel(false);
                }}
              >
                <Octicons
                  name="list-unordered"
                  size={20}
                  color="black"
                  style={{ marginLeft: 10 }}
                />
                <Text style={styles.profileText}>Orders</Text>
              </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.profile}
              onPress={() => {
                setModel(false);
                navigation.navigate("Subscription");
              }}
            >
              {/* <AntDesign
                name="user"
                size={20}
                color="black"
                style={{ marginLeft: 10 }}
              /> */}
              <Text style={styles.profileText}>Plan</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.logout}
              onPress={() => {
                setModel(false);
                setselected_tab("Published Tanzabooks");
              }}
            >
              <Entypo
                name="upload"
                size={20}
                color="black"
                style={{ marginLeft: 10 }}
              />

              <Text style={styles.logoutText}>Published Tanzabooks</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Bounce>
  );
};

const styles = StyleSheet.create({
  image: {
    height: "20%",
    padding: 10,
    resizeMode: "contain",
    marginLeft: 30,
  },
  model: {
    width: wp(100) < 425 ? wp(30) : wp(10),
    position: "absolute",
    marginTop: wp(100) < 425 ? wp(16) : wp(5),
    marginLeft: wp(100) < 425 ? wp(60) : wp(86),
    borderRadius: 10,
    zIndex: 999999,
    backgroundColor: "white",
    paddingBottom: 10,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 10,
    marginBottom: wp(1),
  },
  profileText: {
    // fontFamily: "Poppins-Regular",
    marginLeft: 10,
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 10,
    marginBottom: wp(1),
  },
  logoutText: {
    // fontFamily: "Poppins-Regular",
  },
});
