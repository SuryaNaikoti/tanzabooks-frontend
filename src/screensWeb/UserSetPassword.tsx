import * as Sentry from "@sentry/browser";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { scale, colors, device, wp, hp } from "../utils";
import * as WebBrowser from "expo-web-browser";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxStore/store";
import { API_BASE_URL } from "../utils/config";
import { storeToken, userDetails } from "../reduxStore/actions";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
// import DashboardTeacher from './Dashboard_Teacher';

WebBrowser.maybeCompleteAuthSession();

export default function UserSetPassword({ navigation }: any) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const [message, setMessage] = useState<any>(null);
  const [forgetPasswordText1, setForgetPasswordText1] = useState<any>();
  const [forgetPasswordText2, setForgetPasswordText2] = useState<any>();
  const [forgetPasswordOpen, setForgetPasswordOpen] = useState<any>(false);
  const [confirmPasswordOpen, setConfirmPasswordOpen] = useState<any>(false);
  const dispatch = useDispatch();

  const handleForgetPassword = (values: any) => {
    setProcessing(true);
    setError(null);
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let mobileNumber = params.get("mobileNumber");
    let token = params.get("token");

    console.log("token", token);
    console.log("phone_number", mobileNumber);
    axios
      .post(`${API_BASE_URL}/api/institute/forget-password/reset`, {
        reset_token: token,
        phone_number: mobileNumber,
        password: values.password1,
        password_confirmation: values.password2,
      })
      // {console.log(reset_token)}
      .then((response) => {
        if (response.status) {
          setProcessing(false);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Institute_Admin_Login" }],
            })
          );
        }
      })
      .catch(function (error: any) {
        setError(error.response.data.message);
        setProcessing(false);
        Sentry.captureEvent(error);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setProcessing(false);
        setForgetPasswordOpen(false);
        setConfirmPasswordOpen(false);
      };
    }, [])
  );
  return (
    <View style={[styles.container, {}]}>
      <View
        style={{
          width: wp(100) <= 768 ? "100%" : "60%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("../assets/scholar.png")}
          style={{
            width: wp(100) <= 768 ? wp(50) : wp(20),
            height: wp(100) <= 768 ? wp(40) : wp(20),
            marginTop: wp(100) <= 768 ? hp(10) : -10,
          }}
          resizeMode={"contain"}
        />
      </View>

      <View style={{ width: wp(100) <= 768 ? "100%" : "40%" }}>
        <View
          style={{
            backgroundColor: "white",
            elevation: 5,
            width: wp(100) <= 768 ? wp(90) : "80%",
            height: hp(50),
            alignSelf: "center",
            marginTop: hp(15),
            borderRadius: wp(2),
          }}
        >
          <Text
            style={{
              color: colors.lightBlack,
              marginTop: hp(2.5),
              marginLeft: wp(2.5),
              fontSize: 35,
              fontWeight: "bold",
            }}
          >
            Change Password
          </Text>
          <View>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={{
                  width: "90%",
                  marginLeft: "5%",
                  borderRadius: 10,
                  borderWidth: 0.2,
                  padding: 15,
                  marginTop: hp(4),
                  borderColor: "#c9c9c9",
                }}
                placeholder={"Enter Password"}
                value={forgetPasswordText1}
                secureTextEntry={forgetPasswordOpen ? false : true}
                onChangeText={(text: any) => {
                  setForgetPasswordText1(text);
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  if (forgetPasswordText1.length > 0)
                    setForgetPasswordOpen(!forgetPasswordOpen);
                }}
              >
                {forgetPasswordOpen ? (
                  <Entypo
                    name="eye"
                    size={24}
                    color={colors.primary}
                    style={{
                      marginTop: wp(100) <= 768 ? wp(8) : wp(2.7),
                      marginLeft: wp(100) <= 768 ? wp(-10) : wp(-3),
                    }}
                  />
                ) : (
                  <Entypo
                    name="eye-with-line"
                    size={24}
                    color={colors.primary}
                    style={{
                      marginTop: wp(100) <= 768 ? wp(8) : wp(2.7),
                      marginLeft: wp(100) <= 768 ? wp(-10) : wp(-3),
                    }}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={{
                  width: "90%",
                  marginLeft: "5%",
                  borderRadius: 10,
                  borderWidth: 0.2,
                  padding: 15,
                  marginTop: hp(4),
                  borderColor: "#c9c9c9",
                }}
                placeholder={"Enter Confirm Password"}
                value={forgetPasswordText2}
                secureTextEntry={confirmPasswordOpen ? false : true}
                onChangeText={(text: any) => {
                  setForgetPasswordText2(text);
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  if (forgetPasswordText2.length > 0)
                    setConfirmPasswordOpen(!confirmPasswordOpen);
                }}
              >
                {confirmPasswordOpen ? (
                  <Entypo
                    name="eye"
                    size={24}
                    color={colors.primary}
                    style={{
                      marginTop: wp(100) <= 768 ? wp(8) : wp(2.7),
                      marginLeft: wp(100) <= 768 ? wp(-10) : wp(-3),
                    }}
                  />
                ) : (
                  <Entypo
                    name="eye-with-line"
                    size={24}
                    color={colors.primary}
                    style={{
                      marginTop: wp(100) <= 768 ? wp(8) : wp(2.7),
                      marginLeft: wp(100) <= 768 ? wp(-10) : wp(-3),
                    }}
                  />
                )}
              </TouchableOpacity>
            </View>
            {error !== null && (
              <Text style={{ alignSelf: "center", color: "red" }}>{error}</Text>
            )}
            <View style={{}}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  marginTop: hp(4),
                  borderRadius: wp(0.7),
                  alignSelf: "center",
                  padding: 10,
                }}
                onPress={() => {
                  forgetPasswordText1 === forgetPasswordText2
                    ? handleForgetPassword({
                        password1: forgetPasswordText1,
                        password2: forgetPasswordText1,
                      })
                    : setError("Both Password Should Match");
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 14,
                    color: "white",
                    fontWeight: "bold",
                    marginHorizontal: 20,
                  }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{ marginTop: 20, marginLeft: wp(9) }}>
              Contact
              <Text style={{ color: "blue" }}> administrator</Text> in case you
              forgot
            </Text>
            <Text style={{ marginLeft: wp(11) }}>
              {" "}
              your registered mobile number
            </Text>
          </View>
        </View>
      </View>
      {/* <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                marginTop: hp(4),
                borderRadius: wp(0.7),
                padding:10
              }}
              onPress={() => {
                forgetPasswordText1 === forgetPasswordText2 ?
                  handleForgetPassword({
                    password1: forgetPasswordText1, password2: forgetPasswordText1,
                  })
                  :
                  setError("Both Password Should Match")
              }}
            >
              <Text
                style={{
                  alignSelf: 'center',
                  marginVertical: hp(2),
                  fontSize: 14,
                  color: 'white',
                }}
              >
                Save
              </Text>
            </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // overflowX: "hidden",
    flexDirection: wp(100) <= 768 ? "column" : "row",
    padding: 50,
  },
  orHolder: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  orText: {
    color: colors.secondary,
    backgroundColor: "#fff",
    fontSize: scale(14),
  },
  SocialMediaButtonHolder: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(3),
    alignSelf: "center",
  },
  socislMediaButton: {
    height: wp(100) <= 768 ? wp(6) : wp(1.5),
    width: wp(100) <= 768 ? wp(6) : wp(1.5),
    marginHorizontal: wp(100) <= 768 ? wp(10) : wp(2),
  },
  storeMediaButton: {
    height: wp(100) <= 768 ? wp(30) : wp(3.5),
    width: wp(100) <= 768 ? wp(30) : wp(8.5),
    marginHorizontal: wp(100) <= 768 ? wp(10) : scale(7),
  },
});
