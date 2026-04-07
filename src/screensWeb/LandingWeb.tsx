import * as Sentry from "@sentry/browser";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import HeadShake from "react-reveal/HeadShake";
import Bounce from "react-reveal/Bounce";
import Zoom from "react-reveal/Zoom";
import Slide from "react-reveal/Slide";

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
import { API_BASE_URL, NETWORK_URL } from "../utils/config";
import {
  loginDetails,
  storeToken,
  userDetails,
  username,
} from "../reduxStore/actions";
import { CommonActions } from "@react-navigation/native";
import { navigate } from "../utils/RootNavigation";
import { Entypo } from "@expo/vector-icons";
// import { Entypo } from '@expo/vector-icons';
import { useFormik } from "formik";
import * as yup from "yup";
WebBrowser.maybeCompleteAuthSession();

const initialValues = {
  mobile: "",
  password: "",
};
const validationSchema = yup.object().shape({
  mobile: yup
    .string()
    .required()
    .matches(/[1-9][0-9]{9}/, "Please enter valid mobile number")
    .length(10),
  password: yup.string().required().min(8),
});

export default function Institute_Admin_Login({ navigation }: any) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const [message, setMessage] = useState<any>(null);
  const user = useSelector((state: RootState) => state.userReducer);
  const dispatch = useDispatch();
  const [login_text, setlogin_text] = useState<any>("");
  const [password_text, setpassword_text] = useState<any>("");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem("tbzToken") !== null) {
      window.location.href = "/dashboard";
    }
  }, []);

  const {
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        mobile: values.mobile,
        password: values.password,
      };
      setLoading(true);
      axios
        .post(`${NETWORK_URL}/user-login`, payload)
        .then((response) => {
          console.log("response:", response?.data?.user);
          window.localStorage.setItem("tbzToken", response.data.access_token);
          dispatch(storeToken(response.data.access_token));

          dispatch(username(response.data.access_token));

          var temp = JSON.parse(JSON.stringify(response.data.user));

          dispatch(loginDetails(temp));
          if (
            response.data.user.subscription_plan == null ||
            response.data.user.subscription_plan == ""
          ) {
            window.location.href = "subscription";
          } else {
            navigation.replace("DashboardWeb");
          }
          resetForm();
          setLoading(false);
        })
        .catch(function (error: any) {
          console.log(error.response);
          Sentry.captureException(error);
          // resetForm();
          setError(error.response.data.message);
          // navigation.navigate("forget-password", {
          //   telephone: error.response.data.error.telephone,
          //   from: "register",
          // });
          // setTimeout(() => {
          //   navigation.navigate("InstituteForgetPassword");
          // }, 5000);
          setProcessing(false);
        });
    },
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          width: wp(100) <= 768 ? "100%" : "60%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Zoom>
          <Image
            source={require("../assets/Grow up 1@2x.png")}
            style={{
              width: wp(100) <= 768 ? wp(58) : wp(20),
              height: wp(100) <= 768 ? wp(48) : wp(20),
              marginTop: wp(100) <= 768 ? hp(10) : 0,
            }}
            resizeMode={"contain"}
          />
        </Zoom>
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
              color: colors.lightBlack,
              marginTop: hp(2.0),
              marginLeft: wp(2.5),
              fontSize: 22,
              fontWeight: "bold",
            }}
          >
            Hello
          </Text>

          <Zoom>
            <Text
              style={{
                color: colors.primary,
                marginLeft: wp(2.5),
                fontSize: 35,
                fontWeight: "bold",
              }}
            >
              Tanzabooks
            </Text>
          </Zoom>
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
              placeholder={"Enter 10 digit mobile number"}
              value={values.mobile}
              onBlur={handleBlur("mobile")}
              onKeyPress={(e: any) => e.key === "Enter" && handleSubmit()}
              onChangeText={(text) => {
                const regex =
                  /^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/;
                if (regex.test(text.toString()) || text == "") {
                  setFieldValue("mobile", text);
                }
              }}
              maxLength={10}
              keyboardType="number-pad"
            />
            <View style={{ marginLeft: 25 }}>
              {touched.mobile && errors.mobile ? (
                <Text style={{ color: "red" }}>{errors.mobile}</Text>
              ) : null}
            </View>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={{
                  width: "90%",
                  marginLeft: "5%",
                  borderRadius: 10,
                  borderWidth: 0.2,
                  padding: 15,
                  marginTop: hp(3),
                  borderColor: "#c9c9c9",
                }}
                placeholder={"Password"}
                secureTextEntry={passwordOpen ? false : true}
                value={values.password}
                onKeyPress={(e: any) => e.key === "Enter" && handleSubmit()}
                onBlur={handleBlur("password")}
                onChangeText={handleChange("password")}
              />
              <TouchableOpacity
                onPress={() => {
                  // if (values.password.length > 0)
                  setPasswordOpen(!passwordOpen);
                }}
              >
                {passwordOpen ? (
                  <Entypo
                    name="eye"
                    size={24}
                    color={colors.primary}
                    style={{
                      marginTop: wp(100) <= 768 ? wp(8) : wp(2.2),
                      marginLeft: wp(100) <= 768 ? wp(-10) : wp(-3),
                    }}
                  />
                ) : (
                  <Entypo
                    name="eye-with-line"
                    size={24}
                    color={colors.primary}
                    style={{
                      marginTop: wp(100) <= 768 ? wp(8) : wp(2.2),
                      marginLeft: wp(100) <= 768 ? wp(-10) : wp(-3),
                    }}
                  />
                )}
              </TouchableOpacity>
            </View>

            <View style={{ marginLeft: 25 }}>
              {touched.password && errors.password ? (
                <Text style={{ color: "red" }}>{errors.password}</Text>
              ) : null}
            </View>
            {error !== null && (
              <HeadShake>
                <Text
                  style={{
                    marginLeft: wp(8),
                    alignSelf: "center",
                    color: "red",
                  }}
                >
                  {error}
                </Text>
              </HeadShake>
            )}

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  width: "40%",
                  marginLeft: "30%",
                  marginTop: hp(4),
                  borderRadius: 10,
                }}
                onPress={() => handleSubmit()}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    marginVertical: hp(2),
                    fontSize: 14,
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {loading ? "Loading..." : "Login"}
                  {/* Login */}
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={{ marginLeft: "30%", marginTop: hp(2.5), fontSize: 15 }}
            >
              New to tanzabooks
              <TouchableOpacity
                style={{ marginLeft: wp(0.5) }}
                onPress={() => navigation.navigate("SignUp")}
              >
                <Text
                  style={{
                    color: colors.primary,
                    textDecorationLine: "underline",
                  }}
                >
                  {}
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Text>

            <TouchableOpacity
              style={{ marginTop: hp(2.5), alignSelf: "center" }}
              onPress={() => navigation.navigate("InstituteForgetPassword")}
            >
              <Text
                style={{
                  color: colors.primary,
                  textDecorationLine: "underline",
                }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
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
