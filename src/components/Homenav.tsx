//import liraries
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
// import { TextInput } from 'react-native-paper';
import { hp, wp, colors } from "../utils";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
// import { colors } from 'react-native-elements';
import Partner from "../components/Partner";
import { Input } from "native-base";
import { navigate, navigationRef } from "../utils/RootNavigation";
import { storeToken, userDetails } from "../reduxStore/actions";
import { CommonActions } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxStore/store";
import { NETWORK_URL } from "../utils/config";
import Modal from "react-native-modal";
import { useScrollPosition } from "../hooks/useScrollPosition";
import { useNavigation } from "@react-navigation/core";
// create a component

export default function Homenav({ navigation }: any) {
  const [visiblePop, setVisiblePop] = React.useState(false);
  const [fullName, setFullName] = React.useState("");
  const [orgName, setOrgName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedscroll, setselectedscroll] = useState<string>("Home");
  const ContactRef = useRef();
  const AboutRef = useRef();
  const HomeRef = useRef();
  const navigating = useNavigation<any>();
  const token = useSelector((e: any) => e.userReducer.auth_token);

  const scrollPosition = useScrollPosition();
  console.log(scrollPosition, "scrollposition");

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  SplashScreen.preventAutoHideAsync();

  const [fontsLoaded] = useFonts({
    lato: require("../assets/fonts/Lato-Regular.ttf"),
    "lato-bold": require("../assets/fonts/Lato-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      {wp(100) >= 768 && (
        <View style={[styles.container, styles.shadowProp]}>
          <View style={{ width: wp(100) }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: wp(95),
              }}
            >
              <Image
                source={require("../../assets/logo.png")}
                style={{
                  marginLeft: wp(3),
                  marginTop: hp(1),
                  width: wp(12),
                  resizeMode: "contain",
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  padding: 10,
                  gap: wp(5),
                }}
              >
                {/* <TouchableOpacity onPress={()=>navigating.goback()}><Text>Back</Text></TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => navigating.navigate("Home")}
                  style={{ marginTop: hp(1) }}
                >
                  <Text style={{ fontFamily: "lato-bold", fontSize: 16 }}>
                    Home
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => (window.location.href = "tanzapedia")}
                  style={{ marginTop: hp(1) }}
                >
                  <Text style={{ fontFamily: "lato-bold", fontSize: 16 }}>
                    Tanzapedia
                  </Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                  onPress={() => {
                    window.scrollTo(0, 5000);
                  }}
                  style={{ marginTop: hp(1) }}
                >
                  <Text style={{ fontFamily: "lato-bold", fontSize: 16 }}>
                    Contact us
                  </Text>
                </TouchableOpacity> */}

                {/* <TouchableOpacity
                  onPress={() => {}}


                  style={{ marginTop: hp(1) }}
                >
                  <Text style={{ fontFamily: "lato-bold", fontSize: 16 }}>
                    About
                  </Text>
                </TouchableOpacity> */}

                {/* <TouchableOpacity
                  onPress={() => (window.location.href = "Sample")}
                  style={{ marginTop: hp(1) }}
                >
                  <Text style={{ fontFamily: "lato-bold", fontSize: 16 }}>
                    Sample Library
                  </Text>
                </TouchableOpacity> */}

                {token == "" ? (
                  <TouchableOpacity
                    onPress={() => {
                      window.location.href = "landing";
                    }}
                    style={{ marginTop: hp(1) }}
                  >
                    <Text style={{ fontFamily: "lato-bold", fontSize: 16 }}>
                      Login
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      navigating.navigate("DashboardWeb");
                    }}
                    style={{ marginTop: hp(1) }}
                  >
                    <Text style={{ fontFamily: "lato-bold", fontSize: 16 }}>
                      Dashboard
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <Partner modalVisible={visiblePop}>
            <View>
              <Text
                style={{
                  marginTop: hp(5),
                  fontFamily: "Lato",
                  fontWeight: "800",
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                Create
              </Text>
              <View style={{ marginTop: hp(1) }}>
                <TextInput
                  value={fullName}
                  style={styles.input}
                  onChangeText={(text) => setFullName(text)}
                  placeholder={"Enter Full name"}
                />
                <TextInput
                  value={orgName}
                  style={styles.input}
                  onChangeText={(text) => setOrgName(text)}
                  placeholder={"Enter Orgnaization name"}
                />
                <TextInput
                  value={email}
                  style={styles.input}
                  onChangeText={(text) => setEmail(text)}
                  placeholder={"Enter your email address"}
                />
                <TextInput
                  value={mobile}
                  style={styles.input}
                  onChangeText={(text) => setMobile(text)}
                  placeholder={"Enter 10 digit mobile number"}
                />
              </View>
              <View
                style={{
                  flexDirection: wp(100) <= 768 ? "column" : "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></View>
              <View
                style={{
                  justifyContent: "flex-start",
                  padding: 4,
                  marginTop: hp(2),
                  marginLeft: wp(1),
                }}
              ></View>
              <View
                style={{ flexDirection: "row", justifyContent: "space-around" }}
              >
                <TouchableOpacity
                  style={{
                    width: "25%",
                    marginTop: 20,
                    backgroundColor: colors.primary,
                    borderRadius: wp(5),
                    alignSelf: "center",
                  }}
                  onPress={() => {
                    setVisiblePop(!visiblePop);
                    alert("Admin will contact you");
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      margin: 10,
                      fontSize: 12,
                      fontFamily: "Lato",
                      color: "white",
                    }}
                  >
                    Enquire
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: "25%",
                    marginTop: 20,
                    backgroundColor: colors.lightBlack,
                    borderRadius: wp(5),
                    alignSelf: "center",
                  }}
                  onPress={() => {
                    setVisiblePop(!visiblePop);
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      margin: 10,
                      fontSize: 12,
                      color: "white",
                    }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Partner>
        </View>
      )}

      {wp(100) <= 500 && (
        <View style={[styles.shadowProp, { backgroundColor: "white" }]}>
          <View
            style={{
              flexDirection: "row",
              padding: 10,
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={{ alignSelf: "center", marginLeft: wp(0) }}
            >
              <Image
                source={require("../../assets/logo.png")}
                style={{
                  resizeMode: "contain",
                  width: wp(40),
                  height: hp(10),
                  marginTop: wp(-3),
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleModal()}>
              <Image
                source={require("../../assets/Hamenu.png")}
                style={{
                  marginLeft: wp(1),
                  resizeMode: "contain",
                  padding: wp(6),
                }}
              />
            </TouchableOpacity>
          </View>
          <Modal
            style={{ margin: 0, padding: 0 }}
            animationIn="slideInLeft"
            animationOut="slideOutLeft"
            isVisible={isModalVisible}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View
                  style={{
                    height: wp(100) < 425 ? hp(30) : hp(50),
                    justifyContent: "space-around",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => (window.location.href = "Home")}
                  >
                    <Text style={{ fontFamily: "lato-bold", fontSize: 18 }}>
                      {" "}
                      Home
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => (window.location.href = "tanzapedia")}
                  >
                    <Text style={{ fontFamily: "lato-bold", fontSize: 18 }}>
                      Tanzapedia
                    </Text>
                  </TouchableOpacity>

                  {token == "" ? (
                    <TouchableOpacity
                      onPress={() => {
                        window.location.href = "landing";
                      }}
                    >
                      <Text style={{ fontFamily: "lato-bold", fontSize: 18 }}>
                        {" "}
                        Login
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        window.location.href = "DashboardWeb";
                      }}
                      style={{ marginTop: hp(1) }}
                    >
                      <Text style={{ fontFamily: "lato-bold", fontSize: 18 }}>
                        {" "}
                        Dashboard
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* <TouchableOpacity
                  onPress={() => (window.location.href = "Sample")}
                >
                  
                    <Text style={{ fontFamily: "lato-bold", fontSize: 18 }}>
                      {" "}
                      Sample Library
                    </Text>
                 
                </TouchableOpacity> */}
                </View>

                <Partner modalVisible={visiblePop}>
                  <View>
                    <Text
                      style={{
                        marginTop: hp(5),
                        fontFamily: "Lato",
                        fontWeight: "800",
                        fontSize: 16,
                        textAlign: "center",
                      }}
                    >
                      Create
                    </Text>
                    <View style={{ marginTop: hp(1) }}>
                      <TextInput
                        value={fullName}
                        style={styles.input}
                        onChangeText={(text) => setFullName(text)}
                        placeholder={"Enter Full name"}
                      />
                      <TextInput
                        value={orgName}
                        style={styles.input}
                        onChangeText={(text) => setOrgName(text)}
                        placeholder={"Enter Orgnaization name"}
                      />
                      <TextInput
                        value={email}
                        style={styles.input}
                        onChangeText={(text) => setEmail(text)}
                        placeholder={"Enter your email address"}
                      />
                      <TextInput
                        value={mobile}
                        style={styles.input}
                        onChangeText={(text) => setMobile(text)}
                        placeholder={"Enter 10 digit mobile number"}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: wp(100) <= 768 ? "column" : "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    ></View>
                    <View
                      style={{
                        justifyContent: "flex-start",
                        padding: 4,
                        marginTop: hp(2),
                        marginLeft: wp(1),
                      }}
                    ></View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          width: "25%",
                          marginTop: 20,
                          backgroundColor: colors.primary,
                          borderRadius: wp(5),
                          alignSelf: "center",
                        }}
                        onPress={() => {
                          setVisiblePop(!visiblePop);
                          alert("Admin will contact you");
                        }}
                      >
                        <Text
                          style={{
                            alignSelf: "center",
                            margin: 10,
                            fontSize: 12,
                            fontFamily: "Lato",
                            color: "white",
                          }}
                        >
                          Enquire
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          width: "25%",
                          marginTop: 20,
                          backgroundColor: colors.lightBlack,
                          borderRadius: wp(5),
                          alignSelf: "center",
                        }}
                        onPress={() => {
                          setVisiblePop(!visiblePop);
                        }}
                      >
                        <Text
                          style={{
                            alignSelf: "center",
                            margin: 10,
                            fontSize: 12,
                            color: "white",
                          }}
                        >
                          Close
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Partner>
              </View>
              <TouchableOpacity
                style={{ position: "absolute", top: 10, left: 10 }}
                onPress={() => {
                  toggleModal();
                }}
              >
                <Image
                  source={{
                    uri: "https://www.pngitem.com/pimgs/m/215-2152164_left-arrow-black-arrow-key-png-transparent-png.png",
                  }}
                  style={{ width: hp(3), height: hp(3) }}
                  resizeMode={"contain"}
                />
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    width: wp(100) <= 500 ? wp(60) : wp(20),
    alignSelf: "center",
    borderRadius: 6,
    borderWidth: 0.2,
    height: hp(4),
    marginTop: hp(2),
    borderColor: "#d8d8e8",
  },

  centeredRightView: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalView: {
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderRightColor: "white",
    padding: 40,
    paddingTop: 55,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: wp(85),
    minHeight: hp(100),
  },
  container: {
    position: "fixed",
    width: wp(100),
    padding: 10,
    borderRadius: 2,
    backgroundColor: "white",
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 20000,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});
