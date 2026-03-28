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

import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
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

// import Sub from "./src/screensWeb/Sub";

const Stack = createStackNavigator();

const navigationRef: any = React.createRef();

const App = () => {

 
  
  return (

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer
            ref={navigationRef}
            linking={{
              prefixes: ["https://tanzabooks.com", "tanzabooks.com://"],
              config: {
                screens: {
                  Home: '/',
                  Homenav: '/Homenav',
                  Sample: '/Sample',
                  Landing_Web: "/landing",
                  Footer:'/Footer',
                  DashboardWeb: "/tanzabooks/dashboard",
                  Listing: "/listing",
                  GroupView: "/tanzabooks/group-view",
                  Groups: "/tanzabooks/groups",
                  Profile: "/tanzabooks/profile",
                  Teacher_listing: "/teacher_listing",
                  InstituteForgetPassword: "/institute/forget-password",
                  Otp: "/tanzabooks/forget-password/otp",
                  InstituteSetPassword: "/institute/forget-password/reset",
                  UserSetPassword: "/tanzabooks/user-pass",
                  SignUp: "/tanzabooks/signup",
                  User_Otp: "/tanzabooks/user_verify",
                  Viewer: "/tanzabooks/viewer",
                  Lib: "/tanzabooks/lib",
                  FolderView: "/tanzabooks/folder-view",
                  Briefcase: "/tanzabooks/brief-folder",
                  Subscription: "/tanzabooks/subscription",
                  TanzabooksView: "/tanzabooks/booklist",
                  NotFound: "*",
                  Success: "/tanzabooks/success",


                },
              },
            }}
          >
            {Platform.OS == "web" ? <BaseStack_web /> : <BaseStack />}
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

// const BaseStack = () => {
//   return (
//     <Stack.Navigator
//       initialRouteName={"Home"}
//       screenOptions={{ headerShown: false }}
//     >
//       <Stack.Screen name="Landing_Web" component={Landing_Web} />
//     </Stack.Navigator>
//   );
// };

const BaseStack_web = () => {
  return (
    <Stack.Navigator
      initialRouteName={"Home"}
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
      <Stack.Screen name="Groups" component={Groups} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Briefcase" component={Briefcase} />
      <Stack.Screen name="Subscription" component={Subscription} />
      <Stack.Screen name="TanzabooksView" component={TanzabooksView} />
      {/* <Stack.Screen name="Sub" component={Sub} /> */}
      <Stack.Screen name="Success" component={Success} />
      <Stack.Screen name="Homenav" component={Homenav} />
      <Stack.Screen name="Footer" component={Footer} />
      
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
