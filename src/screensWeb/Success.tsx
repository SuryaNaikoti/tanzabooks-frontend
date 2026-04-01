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
import { storeToken, userDetails, username } from "../reduxStore/actions";
import { CommonActions } from "@react-navigation/native";
import { navigate } from "../utils/RootNavigation";
import Card from "../components/Card";

WebBrowser.maybeCompleteAuthSession();

interface details {
  method: "string";
  id: "string";
  amount: "number";
}

export default function Success({ navigation, route }: any, details: any) {
  console.log("Route ===>", route);
  const { paymentData } = route.params;
  console.log(paymentData);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const [message, setMessage] = useState<any>(null);
  const user = useSelector((state: RootState) => state.userReducer);
  const dispatch = useDispatch();
  const [login_text, setlogin_text] = useState<any>("");
  const [password_text, setpassword_text] = useState<any>("");

  return (
    <View style={styles.container}>
      <Card
        style={{
          marginTop: hp(12),
          // height: hp(22),
          // height: wp(100) <= 768 ? wp(120) : wp(23),
          width: wp(100) <= 425 ? "80%" : "40%",
          alignSelf: "center",
          padding: hp(3),
          margin: "auto",
        }}
      >
        <Image
          source={require("../assets/successful.png")}
          style={{
            width: wp(100) <= 768 ? wp(30) : wp(5),
            height: wp(100) <= 768 ? wp(15) : wp(5),
            marginTop: wp(100) <= 768 ? hp(5) : 0,
            marginLeft: wp(100) <= 768 ? wp(15) : wp(16),
          }}
          resizeMode={"contain"}
        />
        <Text
          style={{
            color: colors.success,
            fontSize: 35,
            fontWeight: "100",
            marginLeft: wp(100) <= 768 ? wp(10) : wp(10),
          }}
        >
          {" "}
          Payment Successful
        </Text>

        <View style={{ marginLeft: wp(100) <= 768 ? wp(-12) : wp(-2) }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: wp(100) <= 786 ? "space-around" : "",
              marginTop: hp(5),
              marginLeft: wp(100) <= 768 ? "" : wp(6),
            }}
          >
            <Text style={styles.paymentHead}>Payment Type</Text>
            <Text> {paymentData?.method} </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: wp(100) <= 786 ? "space-around" : "",
              marginTop: hp(1),
              marginLeft: wp(100) <= 768 ? "" : wp(6),
            }}
          >
            <Text style={styles.paymentHead}>Plan</Text>
            <Text> - </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: wp(100) <= 786 ? "space-around" : "",
              marginTop: hp(1),
              marginLeft: wp(100) <= 768 ? "" : wp(6),
            }}
          >
            <Text style={styles.paymentHead}>Amount paid</Text>
            <Text> {paymentData?.order_amount} </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: wp(100) <= 786 ? "space-around" : "",
              marginTop: hp(1),
              marginLeft: wp(100) <= 768 ? "" : wp(6),
            }}
          >
            <Text style={styles.paymentHead}>Subscription start</Text>
            <Text> {paymentData?.subscription_start} </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: wp(100) <= 786 ? "space-around" : "",
              marginTop: hp(1),
              marginLeft: wp(100) <= 768 ? "" : wp(6),
            }}
          >
            <Text style={styles.paymentHead}>subscription Till</Text>
            <Text> {paymentData?.subscription_end} </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: wp(100) <= 786 ? "space-around" : "",
              marginTop: hp(1),
              marginLeft: wp(100) <= 768 ? "" : wp(6),
            }}
          >
            <Text style={styles.paymentHead}>Transaction Id</Text>
            <Text> {paymentData?.id} </Text>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              marginLeft: hp(2),
              height: hp(4),
              borderRadius: 5,
              alignItems: "center",
              marginTop: hp(4),
              alignSelf: "flex-end",
              justifyContent: "center",
            }}
            onPress={() => {
              navigation.navigate("DashboardWeb");
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                margin: 10,
                fontSize: 12,
                fontWeight: "750",
                color: "white",
                padding: 4,
                paddingHorizantal: 15,
              }}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
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
  paymentHead: {
    fontSize: 100 <= 768 ? 16 : 20,
    // borderWidth: 1,
    width: wp(100) <= 768 ? wp(30) : wp(10),
  },
});
