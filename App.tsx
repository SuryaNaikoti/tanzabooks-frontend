import * as Sentry from "sentry-expo";
import ReactGA from "react-ga";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { Provider } from "react-redux";
import { store, persistor } from "./src/reduxStore/store";
import { PersistGate } from "redux-persist/lib/integration/react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Landing_Web from "./src/screensWeb/LandingWeb";

import Dashboard_web from "./src/screensWeb/DashboardWeb";
import Listing from "./src/screensWeb/Listing";

import Profile from "./src/screensWeb/Profile";

import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import Otp from "./src/screensWeb/Otp";

import InstituteSetPassword from "./src/screensWeb/InstitutesetPassword";
import InstituteForgetPassword from "./src/screensWeb/InstituteForgetPassword";
import SignUp from "./src/screensWeb/SignUp";
import User_Otp from "./src/screensWeb/UserOtp";
import UserSetPassword from "./src/screensWeb/UserSetPassword";
import Viewer from "./src/screensWeb/Viewer";
import AllLessons from "./src/screensWeb/GroupView";
import DashboardWeb from "./src/screensWeb/DashboardWeb";
import Groups from "./src/screensWeb/Groups";
import GroupView from "./src/screensWeb/GroupView";
import Briefcase from "./src/screensWeb/Briefcase";
import Subscription from "./src/screensWeb/Subscription";
import TanzabooksView from "./src/screensWeb/TanzabooksView";
import Success from "./src/screensWeb/Success";
import Home from "./src/screensWeb/Home";
import Homenav from "./src/components/Homenav";
import Footer from "./src/components/Footer";
import Sample from "./src/screensWeb/Sample";
import NewHome from "./src/screensWeb/NewHome";
import ComingSoon from "./src/screensWeb/TanzaPedia";
import TanzaPedia from "./src/screensWeb/TanzaPedia";
import { SampleBriefFolder } from "./src/screensWeb/SampleBriefFolder";
import NewFooter from "./src/components/NewFooter";
import { Orders } from "./src/screensWeb/Orders";
// import { Viewer1 } from "./src/screensWeb/Viewer1";
// import Sub from "./src/screensWeb/Sub";

const Stack = createStackNavigator();

const navigationRef: any = React.createRef();

const App = () => {
  Sentry.init({
    dsn: "https://f92e6a01d1484fe09ac9a9dbe74c5e7e@o4504478471421952.ingest.sentry.io/4504478778130432",
    enableInExpoDevelopment: true,
    debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  });

  // try {
  //   console.log("App Working Fine")
  // } catch (error) {
  //   Sentry.Native.captureException(error);
  // }

  ReactGA.initialize("UA-222701023-1");
  ReactGA.pageview(window.location.pathname + window.location.search);

  // const analytics = new Analytics("UA-XXXXXX-Y");
  // analytics
  //   .hit(new PageHit("Home"))
  //   .then(() => console.log("success"))
  //   .catch((e) => console.log(e.message));

  const [fontsLoaded] = useFonts({
    OpenSans_Bold: require("./assets/OpenSans/OpenSans-Bold.ttf"),
    OpenSans_Medium: require("./assets/OpenSans/OpenSans-Medium.ttf"),
    OpenSans_Regular: require("./assets/OpenSans/OpenSans-Regular.ttf"),
    OpenSans_Light: require("./assets/OpenSans/OpenSans-Light.ttf"),
    OpenSans_Ittalic: require("./assets/OpenSans/OpenSans-LightItalic.ttf"),
  });

  if (!fontsLoaded) {
    return;
  }

  return (
    <View style={styles.container}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <NavigationContainer
              ref={navigationRef}
              linking={{
                prefixes: ["https://tanzabooks.com", "tanzabooks.com://"],
                config: {
                  screens: {
                    Home: "Home",
                    Homenav: "Homenav",
                    Sample: "Sample",
                    Landing_Web: "landing",
                    Footer: "Footer",
                    DashboardWeb: "dashboard",
                    Listing: "listing",
                    GroupView: "group-view",
                    Groups: "groups",
                    Profile: "profile",
                    Teacher_listing: "teacher_listing",
                    InstituteForgetPassword: "forget-password",
                    Otp: "forget-password/otp",
                    InstituteSetPassword: "forget-password/reset",
                    UserSetPassword: "user-pass",
                    SignUp: "signup",
                    User_Otp: "user_verify",
                    Viewer: "viewer",
                    Lib: "lib",
                    FolderView: "folder-view",
                    Briefcase: "brief-folder",
                    Subscription: "subscription",
                    TanzabooksView: "booklist",
                    NotFound: "*",
                    Success: "success",
                    TanzaPedia: "tanzapedia",
                    samplebrieffolder: "samplebrieffolder",
                    Orders: "Orders",
                    // Viewer1: "Viewer1"
                  },
                },
              }}
            >
              {/* {Platform.OS == "web" ? <BaseStack_web /> : <BaseStack />} */}
              <BaseStack_web />
            </NavigationContainer>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </View>
  );
};

const BaseStack_web = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="NotFound" component={DashboardWeb} />
      <Stack.Screen name="DashboardWeb" component={DashboardWeb} />
      <Stack.Screen name="Landing_Web" component={Landing_Web} />
      <Stack.Screen name="SignUp" component={SignUp} />

      <Stack.Screen name="Listing" component={Listing} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Sample" component={Sample} />

      <Stack.Screen
        name="InstituteForgetPassword"
        component={InstituteForgetPassword}
      />
      <Stack.Screen name="User_Otp" component={User_Otp} />
      <Stack.Screen name="GroupView" component={GroupView} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen
        name="InstituteSetPassword"
        component={InstituteSetPassword}
      />
      <Stack.Screen name="UserSetPassword" component={UserSetPassword} />
      <Stack.Screen name="Viewer" component={Viewer} />
      {/* <Stack.Screen name="Viewer1" component={Viewer1} /> */}
      <Stack.Screen name="Groups" component={Groups} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Briefcase" component={Briefcase} />
      <Stack.Screen name="Subscription" component={Subscription} />
      <Stack.Screen name="TanzabooksView" component={TanzabooksView} />
      {/* <Stack.Screen name="Sub" component={Sub} /> */}
      <Stack.Screen name="Success" component={Success} />
      <Stack.Screen name="Homenav" component={Homenav} />
      <Stack.Screen name="Footer" component={Footer} />
      <Stack.Screen name="TanzaPedia" component={TanzaPedia} />
      <Stack.Screen name="samplebrieffolder" component={SampleBriefFolder} />
      <Stack.Screen name="Orders" component={Orders} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "lavender",
    height: "100%",
    // webkitScrollbar: { display: "none"}
  },
});

export default App;
