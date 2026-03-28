import { StatusBar } from "expo-status-bar";
import * as Sentry from "@sentry/browser";
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
import HeadShake from "react-reveal/HeadShake";
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../reduxStore/store';
import { NETWORK_URL } from "../utils/config";

import { storeToken, userDetails } from "../reduxStore/actions";
import { CommonActions } from "@react-navigation/native";
import { useFormik } from "formik";
import * as yup from "yup";
const initialValues = {
  otp: "",
};
const validationSchema = yup.object().shape({
  otp: yup.string().required().length(6),
});

WebBrowser.maybeCompleteAuthSession();

export default function Otp({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const [message, setMessage] = useState<any>(null);
  const [otp, setOtp] = useState(0);
  const [timer, setTimer] = useState(59);
  const [forgetPasswordText, setForgetPasswordText] = useState(null);
  const [login_text, setLogin_text] = useState<any>("");
  const [password_text, setpassword_text] = useState<any>("");
  const [name, setFullName] = useState("");
  const [number, setNumber] = useState("");
  const [fav, setFav] = useState("Student");
  const [users, setUsers] = useState("Teacher");
  const [inst_Name, setInst_Name] = useState("");
  const mobile_number = localStorage.getItem("mobile");
  // console.log(mobile_number);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      setProcessing(true);
      setError(null);
      const postBody = {
        mobile: mobile_number,
        otp: values.otp,
      };

      axios({
        method: "post",
        url: `${NETWORK_URL}/verify-mobile-otp`,
        headers: { "Content-Type": "application/json" },
        data: postBody,
      })
        .then((response) => {
          console.log(response);
          console.log(response.data.data);
          navigation.navigate("InstituteSetPassword", {
            mobile: route?.params?.mobile,
            token: response?.data?.data,
          });
        })
        .catch(function (error: any) {
          console.log(error.response);
          setError(error.response.data.message);
          Sentry.captureException(error);
        });
    },
  });

  // useEffect(() => {
  //   console.log("mobile", route.params.mobile);
  // }, []);

  const handleForgetPassword = (values: any) => {};
  useEffect(() => {
    setTimeout(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
    }, 1000);
    // return () => clearInterval(id)
  }, [timer]);
  const ResendOTP = (values: any) => {
    console.log("testing.....");
    setProcessing(true);
    setError(null);

    const postBody = {
      mobile: mobile_number,
      // otp:values.otp
    };
    axios({
      method: "post",
      url: `${NETWORK_URL}/forget-password`,
      headers: { "Content-Type": "application/json" },
      data: postBody,
    })
      .then((response) => {
        // alert(response)
        console.log(response);
        setTimer(59);
        // navigation.navigate('Otp', { mobile: number })
      })
      .catch(function (error: any) {
        console.log(error);
        Sentry.captureException(error);
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
          source={require("../../assets/Presentation.png")}
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
            OTP
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
              placeholder={"Enter here"}
              value={values.otp}
              onKeyPress={(e: any) => e.key === "Enter" && handleSubmit()}
              onBlur={handleBlur("otp")}
              // onChangeText={handleChange("otp")}
              onChangeText={(text) => {
                if (/^[0-9]{0,10}$/.test(text) || text === "") {
                  setFieldValue("otp", text);
                }
              }}
              maxLength={6}
            />
            <View style={{ marginLeft: 25 }}>
              {touched.otp && errors.otp ? (
                <Text style={{ color: "red" }}>{errors.otp}</Text>
              ) : null}
            </View>
            <View
              style={{
                justifyContent: "flex-end",
                alignSelf: "flex-end",
                // borderWidth: 1,
                marginRight: 20,
              }}
            >
              <Text style={{ fontSize: 12 }}>00.{timer}</Text>
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
            <View
              style={{
                flexDirection: "row",
                // width: wp(230),
                justifyContent: "space-around",
                alignSelf: "center",
                gap: wp(2),
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  marginTop: hp(4),
                  borderRadius: wp(0.7),
                  alignSelf: "center",
                  padding: 10,
                }}
                onPress={() => handleSubmit()}
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
                  Submit OTP
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={timer > 0 ? true : false}
                style={{
                  backgroundColor: colors.primary,
                  marginTop: hp(4),
                  borderRadius: wp(0.7),
                  alignSelf: "center",
                  padding: 10,
                }}
                onPress={() => {
                  ResendOTP();
                }}
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
                  Resend OTP
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
