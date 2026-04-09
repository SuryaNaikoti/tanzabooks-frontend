import * as Sentry from "@sentry/browser";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
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
import api from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxStore/store";
import { API_BASE_URL, NETWORK_URL } from "../utils/config";
import { storeToken, userDetails } from "../reduxStore/actions";
import { CommonActions } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

// import Institute_Admin_Login from './Institute_Admin_Login';
// import Teacher_Login from './../teacher/Teacher_Login';

WebBrowser.maybeCompleteAuthSession();

export default function SignUp({ navigation }: any) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const [message, setMessage] = useState<any>(null);
  const user = useSelector((state: RootState) => state.userReducer);
  const dispatch = useDispatch();
  const [login_text, setlogin_text] = useState<any>("");
  const [password_text, setpassword_text] = useState<any>("");
  const [name, setFullName] = useState("");
  const [number, setNumber] = useState("");
  const [type, setType] = useState("Student");

  const handleLogin = (values: any) => {
    setProcessing(true);
    setError(null);

    const pickerRef = useRef();

    api
      .post(`${NETWORK_URL}/institute/login`, {
        email: values.login,
        password: values.password,
      })
      .then((response) => {
        if (response.status) {
          setProcessing(false);

          dispatch(storeToken(response.data.access_token));
          // for a particular user code for navbar
          var temp = JSON.parse(JSON.stringify(response.data.user));
          temp["type"] = "institute";
          // for a particular user code for navbar
          dispatch(userDetails(temp));
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Dashboard_web" }],
            })
          );
        }
      })
      .catch(function (error: any) {
        console.log(error.response);
        Sentry.captureEvent(error);
        setError(error.response.data.message);
        if (error.response.status == 423) {
          navigation.navigate("OTP_web", {
            telephone: error.response.data.error.telephone,
            from: "register",
          });
        }

        setProcessing(false);
      });
  };

  return (
    <View style={styles.container}>
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
            marginTop: wp(100) <= 768 ? hp(10) : 0,
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
            marginTop: hp(10),
            borderRadius: wp(2),
          }}
        >
          <Text
            style={{
              color: colors.primary,
              marginLeft: wp(9),
              fontSize: 35,
              fontWeight: "bold",
            }}
          >
            Verify Phone
          </Text>

          <Text
            style={{
              color: "#000",
              marginLeft: wp(7),
              fontSize: 16,
              marginTop: hp(3),
              //   fontWeight: "bold",
            }}
          >
            OTP sent to mobile no 9392651729
          </Text>

          <View>
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
              placeholder={"Enter the OTP "}
              value={setFullName}
              onChangeText={(name) => {
                setFullName(name);
              }}
            />

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
                onPress={() => navigation.navigate("UserSetPassword")}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    // marginVertical: hp(2),
                    fontSize: 14,
                    color: "white",
                    fontWeight: "bold",
                    marginHorizontal: 20,
                  }}
                >
                  Verify
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    overflowX: "hidden",
    flexDirection: wp(100) <= 768 ? "column" : "row",
    alignItems: "center",
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
