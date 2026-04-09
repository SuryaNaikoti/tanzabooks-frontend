import * as Sentry from "@sentry/browser";
import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import {
  StyleSheet,
  Button,
  Image,
  View,
  SafeAreaView,
  Text,
  Alert,
  TouchableOpacityBase,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { hp, wp } from "../utils";
import { colors } from "react-native-elements";
import * as Font from "expo-font";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxStore/store";
import { API_BASE_URL, NETWORK_URL } from "../utils/config";
import { storeToken, userDetails } from "../reduxStore/actions";
import { useCallback } from "react";
import Zoom from "react-reveal/Zoom";
import Pulse from "react-reveal/Pulse";
import useRazorpay from "react-razorpay";

import { CommonActions } from "@react-navigation/native";
import { navigate } from "../utils/RootNavigation";
import api from "../utils/api";
import { STORE_USER_DETAILS } from "../reduxStore/actions";
import { userReducer } from "../reduxStore/reducers";
import { useFocusEffect } from "@react-navigation/native";
import { RouteIcon } from "evergreen-ui";
import { Spinner } from "../Annotator/Spinner";

// import logo from "../../src/assets";
// WebBrowser.maybeCompleteAuthSession();
// import { AppLoading } from 'expo';

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export default function Subscription({ navigation }: any) {
  const [data, setData] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<any>([]);
  const [tanza_data, setTanza_data] = useState<any>({});
  const user = useSelector((state: RootState) => state.userReducer);

  const plan_taken = user.userDetails.subscription_plan;
  console.log("tanza_data", tanza_data);

  console.log("plan", plan_taken);
  useEffect(() => {
    tanzabook_detail();
  }, []);
  const folders = tanza_data?.folders?.data?.length;
  const share = tanza_data?.shared_with_me?.data?.length;
  console.log("share", share);

  const tanzabook_detail = () => {
    api
      .get(`${NETWORK_URL}/dashboard`, {
        headers: {
          "content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log('res',res.data.data)
        setTanza_data(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        Sentry.captureException(err);
      });
  };

  const verifyPayment = (response: any) => {
    api({
      method: "post",
      url: `${NETWORK_URL}/payment/verify-payment`,

      data: {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      },

      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("statuscode", response.data.success);
        console.log("Verify Payment ", response.data);
        // console.log("payment", )
        // localStorage.setItem("payment", JSON.stringify(response.data))

        if (response.data.success === true) {
          navigation.navigate("Success", { paymentData: response.data.data });
        }
      })
      .catch(function (error: any) {
        console.log(error.response);
        Sentry.captureException(error);
      });
  };

  const basic = () => {
    api({
      method: "post",
      url: `${NETWORK_URL}/payment/create-order`,
      data: {
        plan_id: 1,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        // console.log("basic plan selected");
        console.log(response);
        setLoading(true);
        navigation.navigate("DashboardWeb");
      })
      .catch(function (error: any) {
        console.log("error ==>", error);
        Sentry.captureException(error);
      });
  };

  async function displayRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const data = await fetch(`${NETWORK_URL}/payment/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan_id: 2,
      }),
    }).then((t) => t.json());

    const options = {
      key: "rzp_test_ohJeARkPM3Xb2n",
      currency: data.data.currency,
      amount: data.data.order_amount,
      order_id: data.data.order_id,
      name: "Tanzabooks payments",
      description: "Buy me a coffee ☕️",
      image:
        "https://api.tanzabooks.com/logo.svg",
      handler: function (response: any) {
        console.log(JSON.stringify(response));
        verifyPayment(response);
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);
      },
      prefill: {
        email: user.userDetails.email,
        // user.userDetails.email
        name: user.userDetails.name,
        contact: user.userDetails.mobile,
      },
      theme: {
        color: "#3399cc",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }
  // console.log('username', user)

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity
        style={{
          position: "absolute",
          left: 25,
          top: 15,
          display: wp(100) < 426 ? "none" : "flex",
        }}
        // onPress={() => (window.location.href = "/tanzabooks/dashboard")}
      >
        <Image
          source={require("../../assets/tanzabook-logo.png")}
          style={{ width: 50, height: 50, resizeMode: "contain" }}
        />
      </TouchableOpacity> */}
      <View
        style={{
          marginTop: wp(100) <= 768 ? 10 : wp(-46),
          marginLeft: wp(100) <= 768 ? wp(-100) : "",
        }}
      >
        <Navbar />
      </View>

      {wp(100) <= 500 && (
        <>
          <Zoom>
            <Card
              style={{
                marginTop: hp(16),
                width: wp(44),
                padding: hp(3),
                marginLeft: wp(-47),
              }}
            >
              {/* {Banner} */}
              <ImageBackground
                source={require("../../src/assets/Path 9211.svg")}
                style={{
                  width: wp(44),
                  height: wp(30),
                  marginLeft: wp(-6.5),
                  marginTop: hp(-7),
                  alignItems: "center",
                  justifyContent: "center",
                }}
                resizeMode={"contain"}
              >
                {/* {Banner} */}
                <Text
                  style={{
                    // textAlign: "center",
                    color: "white",
                    fontSize: 25,
                    fontWeight: "500",
                  }}
                >
                  Freedom
                </Text>
              </ImageBackground>

              <Text
                style={{
                  textAlign: "center",
                  marginTop: hp(-2),
                  fontSize: 40,
                  fontWeight: "600",
                  color: "#DB6D00",
                }}
              >
                {data && data[0] && data[0].name}
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: hp(1),
                  fontWeight: "600",
                }}
              >
                {data && data[0] && data[0].tagline}
              </Text>

              <View>
                <View
                  style={{
                    backgroundColor: "#F2F2F2",
                    marginTop: hp(4),
                    padding: 12,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={require("../../src/assets/arrow svg.svg")}
                      style={{
                        width: wp(2),
                        height: hp(2),
                        marginLeft: wp(1),
                        // marginTop: hp(4),
                      }}
                      resizeMode={"contain"}
                    />
                    <Text>
                      {"Total tanzabooks -" + tanza_data?.total_tanzabooks}
                    </Text>
                  </View>
                </View>
              </View>

              <View>
                <View style={{ backgroundColor: "#FFF", padding: 8 }}>
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={require("../../src/assets/arrow svg.svg")}
                      style={{
                        width: wp(2),
                        height: hp(2),
                        marginLeft: wp(1),
                      }}
                      resizeMode={"contain"}
                    />
                    <Text>{"Total Groups - " + tanza_data.total_groups}</Text>
                  </View>
                </View>
              </View>

              <View>
                <View style={{ backgroundColor: "#F2F2F2", padding: 8 }}>
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={require("../../src/assets/arrow svg.svg")}
                      style={{
                        width: wp(2),
                        height: hp(2),
                        marginLeft: wp(1),
                        // marginTop: hp(4),
                      }}
                      resizeMode={"contain"}
                    />
                    <Text>{"Total Folders -" + folders}</Text>
                  </View>
                </View>
              </View>
              <View>
                <View style={{ backgroundColor: "#FFF", padding: 8 }}>
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={require("../../src/assets/arrow svg.svg")}
                      style={{
                        width: wp(2),
                        height: hp(2),
                        marginLeft: wp(1),
                        // marginTop: hp(4),
                      }}
                      resizeMode={"contain"}
                    />
                    <Text>{"Total shares - " + share}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={{
                  padding: 14,
                  backgroundColor: "#DB6D00",
                  borderRadius: 5,
                  marginTop: hp(1.8),
                  alignSelf: "center",

                  width: wp(30),
                }}
                onPress={() => {
                  basic();
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: 22,
                    fontWeight: "500",
                  }}
                >
                  {plan_taken == "Basic" ? "Current plan" : "Select"}
                </Text>
              </TouchableOpacity>
            </Card>
          </Zoom>

          {/* <Zoom>
            <Card
              style={{
                marginBottom: 80,
                marginTop: hp(-70),
                width: wp(48),
                padding: hp(3),
                marginLeft: wp(46),
              }}
            >
              <ImageBackground
                source={require("../../src/assets/Path 9318.svg")}
                style={{
                  width: wp(48),
                  height: wp(30),
                  marginLeft: wp(-6.5),
                  marginTop: hp(-7),
                  alignItems: "center",
                  justifyContent: "center",
                }}
                resizeMode={"contain"}
              >
                <Text
                  style={{
                    // textAlign: "center",

                    fontSize: 25,
                    fontWeight: "500",
                    color: "white",
                  }}
                >
                  Premium
                </Text>
              </ImageBackground>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: hp(-2),
                  fontSize: 40,
                  fontWeight: "500",
                  color: "##2E74E8",
                }}
              >
                {" "}
                ${data && data[0] && data[1].price}
              </Text>
              <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                per year
              </Text>

              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: 25,
                  color: "#2E74E8",
                  marginTop: hp(2),
                }}
              >
                UNLIMITED
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: hp(1),
                  fontWeight: "600",
                }}
              >
                {data && data[1] && data[1].tagline}

              </Text>
              <View>
                <View
                  style={{
                    backgroundColor: "#F2F2F2",
                    marginTop: hp(4),
                    padding: 8,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={require("../../src/assets/arrow svg blue.svg")}
                      style={{
                        width: wp(2),
                        height: hp(2),
                        marginLeft: wp(1),
                        // marginTop: hp(4),
                      }}
                      resizeMode={"contain"}
                    />
                    <Text>
                      Total tanzabooks -{" "}
                      {data && data[1] && data[1].max_tanzabooks}
                    </Text>
                  </View>
                </View>
              </View>

              <View>
                <View style={{ backgroundColor: "#FFF", padding: 8 }}>
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={require("../../src/assets/arrow svg blue.svg")}
                      style={{
                        width: wp(2),
                        height: hp(2),
                        marginLeft: wp(1),
                        // marginTop: hp(4),
                      }}
                      resizeMode={"contain"}
                    />
                    <Text>
                      {" "}
                      Total Groups - {data && data[1] && data[1].max_groups}
                    </Text>
                  </View>
                </View>
              </View>

              <View>
                <View style={{ backgroundColor: "#F2F2F2", padding: 8 }}>
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={require("../../src/assets/arrow svg blue.svg")}
                      style={{
                        width: wp(2),
                        height: hp(2),
                        marginLeft: wp(1),
                      }}
                      resizeMode={"contain"}
                    />
                    <Text>
                      {" "}
                      Total Folders - {data &&
                        data[1] &&
                        data[1].max_folders}{" "}
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                <View style={{ backgroundColor: "#FFF", padding: 8 }}>
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={require("../../src/assets/arrow svg blue.svg")}
                      style={{
                        width: wp(2),
                        height: hp(2),
                        marginLeft: wp(1),
                      }}
                      resizeMode={"contain"}
                    />
                    <Text>
                      {" "}
                      Total shares - {data && data[1] && data[1].max_tanzabooks}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={{
                  padding: 14,
                  backgroundColor: "#2E74E8",
                  borderRadius: 5,

                  alignSelf: "center",
                  marginTop: hp(2),
                  width: wp(30),
                }}
                onPress={() => displayRazorpay()}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: 22,
                    fontWeight: "500",
                  }}
                >
                  Select
                </Text>
              </TouchableOpacity>
            </Card>
          </Zoom> */}
        </>
      )}
      {wp(100) > 425 && (
        <>
          <View
            style={{
              width: "60%",
              flexDirection: "column",
              marginTop: hp(-30),
              marginLeft: wp(100) <= 768 ? 10 : wp(10),
            }}
          >
            <Image
              source={require("../../src/assets/Group 36.svg")}
              style={{
                width: wp(20),
                height: wp(20),
                // marginTop:  0,
                marginLeft: wp(10),
              }}
              resizeMode={"contain"}
            />
            <Pulse>
              <Image
                source={require("../assets/Grow up 1@2x.png")}
                style={{
                  width: wp(20),
                  height: wp(20),
                  // marginTop: wp(100) <= 768 ? hp(4) : 0,
                  marginLeft: wp(10),
                }}
                resizeMode={"contain"}
              />
            </Pulse>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: hp(5),
              marginLeft: wp(-21),
            }}
          >
            <View>
              <View beforeLoad={<Spinner />}>
                <Zoom>
                  <Card
                    style={{
                      // height: hp(100) <= 425 ? hp(45) : hp(64),
                      marginTop: hp(100) <= 425 ? hp(154) : hp(3),
                      width: wp(100) <= 425 ? wp(45) : wp(20),
                      padding: hp(3),
                      marginLeft: wp(100) <= 425 ? wp(40) : wp(0),
                    }}
                  >
                    {/* {Banner} */}
                    <ImageBackground
                      source={require("../../src/assets/Path 9211.svg")}
                      style={{
                        width: wp(140) <= 425 ? wp(50) : wp(20),
                        height: wp(100) <= 425 ? wp(40) : wp(18),
                        marginLeft: wp(-1.5),
                        marginTop: hp(-16),
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      resizeMode={"contain"}
                    >
                      {/* {Banner} */}
                      <Text
                        style={{
                          fontSize: 40,
                          fontWeight: "500",
                          color: "white",
                        }}
                      >
                        Freedom
                      </Text>
                    </ImageBackground>
                    <Text
                      style={{
                        textAlign: "center",
                        marginTop: hp(-9),
                        fontSize: 40,
                        fontWeight: "600",
                        color: "#DB6D00",
                      }}
                    >
                      {data && data[0] && data[0].name}
                    </Text>
                    <Text
                      style={{
                        textAlign: "center",
                        marginTop: hp(1),
                        fontWeight: "600",
                      }}
                    >
                      {data && data[0] && data[0].tagline}
                    </Text>

                    <View>
                      <View
                        style={{
                          backgroundColor: "#F2F2F2",
                          marginTop: hp(4),
                          padding: 12,
                        }}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <Image
                            source={require("../../src/assets/arrow svg.svg")}
                            style={{
                              width: wp(2),
                              height: hp(2),
                              marginLeft: wp(1),
                              // marginTop: hp(4),
                            }}
                            resizeMode={"contain"}
                          />
                          <Text>
                            {"Total tanzabooks -" +
                              tanza_data?.total_tanzabooks}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View>
                      <View style={{ backgroundColor: "#FFF", padding: 8 }}>
                        <View style={{ flexDirection: "row" }}>
                          <Image
                            source={require("../../src/assets/arrow svg.svg")}
                            style={{
                              width: wp(2),
                              height: hp(2),
                              marginLeft: wp(1),
                            }}
                            resizeMode={"contain"}
                          />
                          <Text>
                            {"Total Groups - " + tanza_data.total_groups}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View>
                      <View style={{ backgroundColor: "#F2F2F2", padding: 8 }}>
                        <View style={{ flexDirection: "row" }}>
                          <Image
                            source={require("../../src/assets/arrow svg.svg")}
                            style={{
                              width: wp(2),
                              height: hp(2),
                              marginLeft: wp(1),
                              // marginTop: hp(4),
                            }}
                            resizeMode={"contain"}
                          />
                          <Text>{"Total Folders - " + folders}</Text>
                        </View>
                      </View>
                    </View>
                    <View>
                      <View style={{ backgroundColor: "#FFF", padding: 8 }}>
                        <View style={{ flexDirection: "row" }}>
                          <Image
                            source={require("../../src/assets/arrow svg.svg")}
                            style={{
                              width: wp(2),
                              height: hp(2),
                              marginLeft: wp(1),
                              // marginTop: hp(4),
                            }}
                            resizeMode={"contain"}
                          />
                          <Text>{"Total shares - " + share}</Text>
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={{
                        padding: 14,
                        backgroundColor: "#DB6D00",
                        borderRadius: 5,
                        marginTop: hp(1.8),
                        alignSelf: "center",
                        width: wp(100) <= 425 ? wp(24) : wp(14),
                      }}
                      disabled={plan_taken == "Basic" ? true : false}
                      onPress={() => {
                        basic();
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          textAlign: "center",
                          fontSize: 22,
                          fontWeight: "500",
                        }}
                      >
                        {plan_taken == "Basic" ? "Current plan" : "Select"}
                      </Text>
                    </TouchableOpacity>
                  </Card>
                </Zoom>
              </View>
            </View>

            {/* <View style={{ marginTop: hp(100) <= 425 ? hp(10) : hp(0) }}>
              <Zoom>
                <Card
                  style={{
                    marginTop: hp(5),
                    width: wp(20),
                    padding: hp(3),
                    marginLeft: wp(2),
                  }}
                >
                  <ImageBackground
                    source={require("../../src/assets/Path 9318.svg")}
                    style={{
                      width: wp(20),
                      height: wp(16),
                      marginLeft: wp(-1.5),
                      marginTop: hp(-20),
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    resizeMode={"contain"}
                  >
                    <Text
                      style={{
                        fontSize: 40,
                        fontWeight: "500",
                        color: "white",
                      }}
                    >
                      Premium
                    </Text>
                  </ImageBackground>
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: hp(-10),
                      fontSize: 60,
                      fontWeight: "500",
                      color: "##2E74E8",
                    }}
                  >
                    {" "}
                    ${data && data[0] && data[1].price}
                  </Text>
                  <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                    per year
                  </Text>

                  <Text
                    style={{
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: 30,
                      color: "#2E74E8",
                      marginTop: hp(2),
                    }}
                  >
                    UNLIMITED
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: hp(1),
                      fontWeight: "600",
                    }}
                  >
                    {data && data[1] && data[1].tagline}
                  </Text>
                  <View>
                    <View
                      style={{
                        backgroundColor: "#F2F2F2",
                        marginTop: hp(4),
                        padding: 8,
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <Image
                          source={require("../../src/assets/arrow svg blue.svg")}
                          style={{
                            width: wp(2),
                            height: hp(2),
                            marginLeft: wp(1),
                          }}
                          resizeMode={"contain"}
                        />
                        <Text>
                          {" "}
                          Total tanzabooks -{" "}
                          {data && data[1] && data[1].max_tanzabooks}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View>
                    <View style={{ backgroundColor: "#FFF", padding: 8 }}>
                      <View style={{ flexDirection: "row" }}>
                        <Image
                          source={require("../../src/assets/arrow svg blue.svg")}
                          style={{
                            width: wp(2),
                            height: hp(2),
                            marginLeft: wp(1),
                            // marginTop: hp(4),
                          }}
                          resizeMode={"contain"}
                        />
                        <Text>
                          {" "}
                          Total Groups - {data && data[1] && data[1].max_groups}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View>
                    <View style={{ backgroundColor: "#F2F2F2", padding: 8 }}>
                      <View style={{ flexDirection: "row" }}>
                        <Image
                          source={require("../../src/assets/arrow svg blue.svg")}
                          style={{
                            width: wp(2),
                            height: hp(2),
                            marginLeft: wp(1),
                          }}
                          resizeMode={"contain"}
                        />
                        <Text>
                          {" "}
                          Total Folders -{" "}
                          {data && data[1] && data[1].max_folders}{" "}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <View style={{ backgroundColor: "#FFF", padding: 8 }}>
                      <View style={{ flexDirection: "row" }}>
                        <Image
                          source={require("../../src/assets/arrow svg blue.svg")}
                          style={{
                            width: wp(2),
                            height: hp(2),
                            marginLeft: wp(1),
                            // marginTop: hp(4),
                          }}
                          resizeMode={"contain"}
                        />
                        <Text>
                          {" "}
                          Total shares -{" "}
                          {data && data[1] && data[1].max_tanzabooks}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={{
                      padding: 14,
                      backgroundColor: "#2E74E8",
                      borderRadius: 5,

                      alignSelf: "center",
                      marginTop: hp(2),
                      width: wp(14),
                    }}
                    onPress={() => displayRazorpay()}
                  >
                    <Text
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontSize: 22,
                        fontWeight: "500",
                      }}
                    >
                      Select
                    </Text>
                  </TouchableOpacity>
                </Card>
              </Zoom>
            </View> */}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    overflowX: "hidden",
    flexDirection: wp(100) <= 425 ? "column" : "row",
    alignItems: "center",
  },
  box: {
    width: wp(40),
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    // alignSelf:'center',
    // margin:'auto'
  },

  title: {
    textAlign: "center",
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
