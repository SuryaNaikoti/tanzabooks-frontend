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
import { CommonActions } from "@react-navigation/native";
import { useFormik } from "formik";
import * as yup from "yup";

WebBrowser.maybeCompleteAuthSession();

const initialValues = {
  mobile: "",
};

const validationSchema = yup.object().shape({
  mobile: yup
    .string()
    .required()
    .matches(/[1-9][0-9]{9}/, "Please enter valid mobile number")
    .length(10),
});

export default function InstituteForgetPassword({ navigation }: any) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const [message, setMessage] = useState<any>(null);
  const [number, setNumber] = useState();
  const dispatch = useDispatch();

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
        mobile: values.mobile,
      };
      localStorage.setItem("mobile", values.mobile);
      axios({
        method: "post",
        url: `${API_BASE_URL}/api/forget-password`,
        headers: { "Content-Type": "application/json" },
        data: postBody,
      })
        .then((response) => {
          // alert(response)
          console.log(response);
          navigation.navigate("Otp", { mobile: number });
          setProcessing(false);
        })
        .catch(function (error: any) {
          console.log(error?.response?.data?.message);
          setError(error?.response?.data?.message);
          Sentry.captureException(error);
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
            Forget Password ?
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
              placeholder={"Entered Registered Mobile Number"}
              value={values.mobile}
              onKeyPress={(e: any) => e.key === "Enter" && handleSubmit()}
              onBlur={handleBlur("mobile")}
              // onChangeText={handleChange("mobile")}
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

            {error !== null && values.mobile.length == 10 ? (
              <Text style={{ color: "red", marginLeft: 20 }}>
                Mobile Number {error}
              </Text>
            ) : null}

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
                  fontSize: 14,
                  color: "white",
                  fontWeight: "bold",
                  marginHorizontal: 20,
                }}
              >
                {processing ? "Loading..." : "Send"}
              </Text>
            </TouchableOpacity>
            {/* <Text style={{ marginTop: 20, marginLeft: wp(9) }}>
              Contact
              <Text style={{ color: "blue" }}> administrator</Text> in case you
              forgot
            </Text>
            <Text style={{ marginLeft: wp(11) }}>
              your registered mobile number
            </Text> */}
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
