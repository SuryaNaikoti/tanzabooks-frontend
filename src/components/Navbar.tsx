import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { scale, colors, device, wp, hp } from "../utils";
import * as WebBrowser from "expo-web-browser";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxStore/store";
import { NETWORK_URL } from "../utils/config";
import { storeToken, userDetails } from "../reduxStore/actions";
import { CommonActions } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/core";
import { Octicons } from "@expo/vector-icons";
WebBrowser.maybeCompleteAuthSession();
const PUBLIC_ROUTES = ["Home", "viewer"];

export default function Navbar({ navigation }: any) {
  const [selectOptions, setSelectOptions] = React.useState(true);
  const user = useSelector((state: RootState) => state.userReducer);
  const [data, setData] = React.useState([]);
  const route = useRoute();
  const { navigate } = useNavigation<any>();
  const token = user.auth_token;

  // useEffect(() => {
  //   if (
  //     window.localStorage.getItem("tbzToken") === undefined &&
  //     window.localStorage.getItem("tbzToken") === null
  //   ) {
  //     console.log('tbzToken')
  //     window.location.href = '/landing'
  //   }

  // }, []);
  // private routing

  useEffect(() => {
    // alert(window.location.href.toString());

    if (
      window.localStorage.getItem("tbzToken") === null &&
      !window.location.href.toString().includes("viewer")
    ) {
      logOut();
    }
  }, []);

  const isRedirected = useRef(false);

  if (token && PUBLIC_ROUTES.includes(route.name) && !isRedirected.current) {
    isRedirected.current = true;
    navigate("DashboardWeb");
  }

  if (!token) {
    if (PUBLIC_ROUTES.includes(route.name)) {
      return null;
    } else if (!isRedirected.current) {
      isRedirected.current = true;
      navigate("viewer");
    }
  }

  if (PUBLIC_ROUTES.includes(route.name)) {
    return null;
  }

  const logOut = () => {
    axios
      .get(`${NETWORK_URL}/user-logout`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.auth_token}`,
        },
      })
      .then((response) => {
        setData(response.data.data);
        alert("You are Logged Out");
        window.location.href = "Home";
        window.localStorage.clear();

        // dispatch(userReducer.
        console.log(" Dashboard folders", response.data.data);
      })

      .catch(function (error: any) {
        window.location.href = "Home";
        window.localStorage.clear();
      });
  };

  return (
    <>
      {wp(100) >= 768 && (
        <View>
          {/* <View style={{ position: "fixed" }}>
            <Image
              source={require("../../assets/tanzabook-logo.png")}
              style={{
                // width: 50,
                // height: 50,
                padding: 30,
                resizeMode: "contain",
                marginTop: wp(100) <= 768 ? "" : wp(1),
                marginLeft: wp(100) <= 768 ? "" : wp(2),
                position: "fixed",
              }}
            />
          </View> */}
          <View style={styles.container}>
            <TouchableOpacity onPress={() => navigate("Home")}>
              <Image
                source={require("../../assets/tanzabook-logo.png")}
                style={{
                  padding: 30,
                  resizeMode: "contain",
                  marginTop: wp(-12),
                }}
              />
            </TouchableOpacity>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
              }}
            >
              {/* Image */}

              {/* <TouchableOpacity onPress={() => navigate("Orders")}>
                {route.name === "Orders" || route.name === "Orders" ? (
                  <Octicons
                    name="list-unordered"
                    size={22}
                    color="black"
                    style={{ padding: 10 }}
                  />
                ) : (
                  <Octicons
                    name="list-unordered"
                    size={22}
                    color="gray"
                    style={{ padding: 10 }}
                  />
                )}

                <Text
                  style={{
                    // marginTop: wp(-1),
                    color:
                      route.name === "Orders" || route.name === "Orders"
                        ? "black"
                        : "gray",
                  }}
                >
                  Orders
                </Text>
              </TouchableOpacity> */}

              <TouchableOpacity onPress={() => navigate("DashboardWeb")}>
                {/* <TouchableOpacity
                onPress={() => (window.location.href = "/dashboard")}
              > */}
                <Image
                  source={
                    route.name == "dashboard" || route.name == "DashboardWeb"
                      ? require("../../assets/Dashboardon.png")
                      : require("../../assets/Dashboardoff.png")
                  }
                  style={{ padding: 10, resizeMode: "contain" }}
                ></Image>
                {/* </TouchableOpacity> */}

                <Text
                  style={{
                    // marginTop: wp(-1),
                    color:
                      route.name == "dashboard" || route.name == "DashboardWeb"
                        ? "black"
                        : "gray",
                  }}
                >
                  Dashboard
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigate("Groups")}>
                {/* <TouchableOpacity
                onPress={() => (window.location.href = "/groups")}
              > */}
                <Image
                  source={
                    route.name == "Groups"
                      ? require("../../assets/group-on.png")
                      : require("../../assets/group-off.png")
                  }
                  style={{ padding: 10, resizeMode: "contain" }}
                ></Image>
                {/* </TouchableOpacity> */}
                <Text
                  style={{
                    // marginTop: wp(-1),
                    color: route.name == "Groups" ? "black" : "gray",
                  }}
                >
                  Groups
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigate("Profile")}>
                <Image
                  source={
                    route.name == "Profile"
                      ? require("../../assets/Settingson.png")
                      : require("../../assets/Settingsoff.png")
                  }
                  style={{ padding: 10, resizeMode: "contain" }}
                ></Image>
                <Text
                  style={{
                    // marginTop: wp(-1),
                    color: route.name == "Profile" ? "black" : "gray",
                  }}
                >
                  Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  logOut();
                }}
              >
                <Image
                  source={require("../assets/logout.png")}
                  style={{ width: 60, height: 50, resizeMode: "contain" }}
                ></Image>
              </TouchableOpacity>
            </View>

            <View></View>
          </View>
        </View>
      )}
      {wp(100) <= 426 && (
        <View style={styles.container_rest}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              onPress={() => navigate("DashboardWeb")}
              style={{ marginTop: 10 }}
            >
              <Image
                source={
                  route.name == "DashboardWeb"
                    ? require("../../assets/Dashboardon.png")
                    : require("../../assets/Dashboardoff.png")
                }
                style={{ padding: 10, resizeMode: "contain" }}
              ></Image>
              <Text
                style={{
                  // marginTop: wp(-1),
                  color:
                    route.name === "/dashboard" ||
                    route.name === "/DashboardWeb"
                      ? "black"
                      : "gray",
                }}
              >
                Dashboard
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigate("Groups")}
              style={{ marginTop: 10 }}
            >
              <Image
                source={
                  route.name == "Groups"
                    ? require("../../assets/group-on.png")
                    : require("../../assets/group-off.png")
                }
                style={{ padding: 10, resizeMode: "contain" }}
              ></Image>
              <Text
                style={{
                  // marginTop: wp(-1),
                  color: route.name == "Groups" ? "black" : "gray",
                }}
              >
                Groups
              </Text>
            </TouchableOpacity>

            <View>
              <TouchableOpacity
                onPress={() => navigate("Profile")}
                style={{ marginTop: 10 }}
              >
                <Image
                  source={
                    route.name == "Profile"
                      ? require("../../assets/Settingson.png")
                      : require("../../assets/Settingsoff.png")
                  }
                  style={{ padding: 10, resizeMode: "contain" }}
                ></Image>
                <Text
                  style={{
                    // marginTop: wp(-1),
                    color: route.name == "Profile" ? "black" : "gray",
                  }}
                >
                  Profile
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity
                onPress={() => {
                  // window.location.href = "Home";
                  // window.localStorage.clear();
                  logOut();
                }}
              >
                <Image
                  source={require("../assets/logout.png")}
                  style={{ width: 55, height: 55, marginTop: hp(1) }}
                ></Image>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: wp(80) <= 768 ? wp(10) : wp(8),
    height: hp(100),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    position: "fixed",
  },
  container_rest: {
    position: "fixed",
    bottom: 2,
    width: "100%",
    borderWidth: 0.5,
    borderColor: colors.grayBlur,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    zIndex: 20000,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
});
