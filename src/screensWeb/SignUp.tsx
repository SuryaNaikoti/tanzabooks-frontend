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
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxStore/store";
import { NETWORK_URL } from "../utils/config";
import { storeToken, userDetails } from "../reduxStore/actions";
import { CommonActions } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { RadioButton } from "react-native-paper";
import { useFormik } from "formik";
import * as yup from "yup";
WebBrowser.maybeCompleteAuthSession();

const initialValues = {
  name: "",
  email: "",
  mobile: "",
  institute: "",
};
const validationSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().required().email(),
  mobile: yup
    .string()
    .required()
    .matches(/[1-9][0-9]{9}/, "Please enter valid mobile number")
    .length(10),
  // institute: string(),
});

export default function SignUp({ navigation }: any) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const [message, setMessage] = useState<any>(null);
  const user = useSelector((state: RootState) => state.userReducer);
  const dispatch = useDispatch();
  const [login_text, setLogin_text] = useState<any>("");
  const [password_text, setpassword_text] = useState<any>("");
  const [name, setFullName] = useState("");
  const [number, setNumber] = useState("");
  const [fav, setFav] = useState("Student");
  const [users, setUsers] = useState("Teacher");
  const [inst_Name, setInst_Name] = useState("");
  const [back_error, setBack_err] = useState("");

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const postBody = {
        username: values.name,
        email: values.email,
        mobile: values.mobile,
        user_type: "Teacher",
        institute_name: values.institute,
      };
      console.log("Signup Details", postBody);
      localStorage.setItem("mobile", postBody.mobile);
      axios({
        method: "post",
        // url: `${NETWORK_URL}/user-signup`,
        url: `https://tb-api.aagastya.design/api/user-signup`,
        headers: { "Content-Type": "application/json" },
        data: postBody,
      })
        .then((response) => {
          console.log(response);
          navigation.navigate("Otp", { mobile: number });
          resetForm();
        })
        .catch(function (error: any) {
          console.log("signup_err", error);
          setBack_err(error.response.data.message);
          Sentry.captureException(error);
          // resetForm();
          // alert(error.response.data.message);
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
          source={require("../assets/activebook.png")}
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
            marginLeft: wp(100) <= 768 ? wp(5) : "",
            borderRadius: wp(2),
          }}
        >
          <Text
            style={{
              color: colors.primary,
              marginLeft: wp(2.5),
              fontSize: 35,
              fontWeight: "bold",
            }}
          >
            Onboard with Tanzabooks
          </Text>

          <View>
            {back_error ? (
              <Text style={{ color: "red" }}>{back_error}</Text>
            ) : null}
            <View
              style={{
                backgroundColor: "#f6f6f6",
                flexDirection: "row",
                marginTop: hp(2),
                marginLeft: wp(10),
                width: "40%",
                alignItems: "center",
                borderRadius: 25,
              }}
            ></View>
            {/* <select
              style={{
                textIndent: 5,
                padding: 16,
                borderRadius: 12,
                width: wp(100) < 768 ? wp(84) : wp(28),
                marginLeft: wp(2),
              }}
              onChange={(e) => {
                setUsers(users);
              }}
            >
              <option value="Teacher">Teacher </option>
              <option value="Student">Student</option>
            </select> */}
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
              placeholder={"Enter Full name"}
              value={values.name}
              onKeyPress={(e: any) => e.key === "Enter" && handleSubmit()}
              onBlur={handleBlur("name")}
              onChangeText={handleChange("name")}
            />
            <View style={{ marginLeft: 25 }}>
              {touched.name && errors.name ? (
                <Text style={{ color: "red" }}>{errors.name}</Text>
              ) : null}
            </View>
            <View style={{ flexDirection: "row", gap: 15, marginLeft: 15 }}>
              <View>
                <TextInput
                  style={{
                    width: wp(100) < 425 ? wp(38) : wp(14),
                    marginLeft: wp(100) < 425 ? "2%" : "5%",
                    borderRadius: 10,
                    borderWidth: 0.2,
                    padding: 15,
                    marginTop: hp(4),
                    borderColor: "#c9c9c9",
                  }}
                  placeholder={" Email "}
                  value={values.email}
                  onKeyPress={(e: any) => e.key === "Enter" && handleSubmit()}
                  onBlur={handleBlur("email")}
                  onChangeText={handleChange("email")}
                />
                <View style={{ marginLeft: 10 }}>
                  {touched.email && errors.email ? (
                    <Text style={{ color: "red" }}>{errors.email}</Text>
                  ) : null}
                </View>
              </View>
              <View>
                <TextInput
                  style={{
                    width: wp(100) < 425 ? wp(40) : wp(14),
                    borderRadius: 10,
                    borderWidth: 0.2,
                    padding: 15,
                    marginTop: hp(4),
                    borderColor: "#c9c9c9",
                  }}
                  placeholder={"Mobile"}
                  value={values.mobile}
                  onKeyPress={(e: any) => e.key === "Enter" && handleSubmit()}
                  onBlur={handleBlur("mobile")}
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
                <View style={{ marginLeft: 10 }}>
                  {touched.mobile && errors.mobile ? (
                    <Text style={{ color: "red" }}>{errors.mobile}</Text>
                  ) : null}
                </View>
              </View>
            </View>
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
                placeholder={"Institute name"}
                value={values.institute}
                onKeyPress={(e: any) => e.key === "Enter" && handleSubmit()}
                onBlur={handleBlur("institute")}
                onChangeText={handleChange("institute")}
              />
              <View style={{ marginLeft: 25 }}>
                {touched.institute && errors.institute ? (
                  <Text style={{ color: "red" }}>{errors.institute}</Text>
                ) : null}
              </View>
            </View>
            {error !== null && (
              <Text style={{ alignSelf: "center", color: "red" }}>{error}</Text>
            )}
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: hp(4),
                  borderRadius: 10,
                  marginLeft: 20,
                }}
                onPress={() => handleSubmit()}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                    fontSize: 14,
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Join
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  // backgroundColor: colors.primary,
                  paddingHorizontal: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "1%",
                  marginTop: hp(4),
                  borderRadius: wp(2),
                }}
                onPress={() => navigation.navigate("Landing_Web")}
              >
                <Text
                  style={{
                    alignSelf: "center",

                    fontSize: wp(100) <= 768 ? 16 : 14,
                    color: colors.primary,
                  }}
                >
                  Already a user Sign In
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
    marginTop: wp(100) <= 768 ? wp(-8) : "",
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
