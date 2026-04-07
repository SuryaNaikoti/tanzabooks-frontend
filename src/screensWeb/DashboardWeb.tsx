// import * as Sentry from "sentry-expo";
import * as Sentry from "@sentry/browser";
import { StatusBar } from "expo-status-bar";
import { Pane, FileUploader, FileCard } from "evergreen-ui";
import moment from "moment";
import { FontAwesome5 } from "@expo/vector-icons";
import Fade from "react-reveal/Fade";
import Slide from "react-reveal/Slide";
import Pulse from "react-reveal/Pulse";
import { Entypo } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput as Input,
  TouchableWithoutFeedback,
  Dimensions,
  Pressable,
} from "react-native";
import { Divider, shadow } from "react-native-paper";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { Popover } from "react-native-popable";
import Popup from "../components/Popup";
import Pullup from "../components/Pullup";
import RenamePop from "../components/RenamePop";
import { scale, colors, device, wp, hp } from "../utils";
import * as WebBrowser from "expo-web-browser";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxStore/store";
import { API_BASE_URL, NETWORK_URL } from "../utils/config";
import { storeToken, userDetails } from "../reduxStore/actions";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { TextInput } from "react-native-paper";
import { Chip, Searchbar } from "react-native-paper";
import { STORE_USER_DETAILS } from "../reduxStore/actions";
import { userReducer } from "../reduxStore/reducers";
import { useForm, Controller } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import Spinner from "react-bootstrap/Spinner";
import { OptionsModal } from "../components/OptionsModal";
import { MaterialCommunityIcons } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();

export default function DashboardTeacher({ navigation }: any) {
  const [selectedValue, setSelectedValue] = useState<any>([]);
  const [files, setFiles] = React.useState([]);
  const [fileRejections, setFileRejections] = React.useState([]);
  const handleChange = React.useCallback((files) => setFiles([files[0]]), []);
  const [r_name, setR_name] = React.useState("");
  const [frn, frn1] = React.useState();
  const [hover, setHover] = React.useState("");
  const handleRemove = React.useCallback(() => {
    setFiles([]);
    setFileRejections([]);
  }, []);

  const [optionsSelectedValue, setOptionsSelectedValue] = useState<any>([]);

  const [noOfSubject, setnoOfSubject] = useState([""]);

  const [selected_tab, setselected_tab] = React.useState("Folders");

  const [setFolder_id, setAllFolder_id] = useState("");

  const [visiblePop, setVisiblePop] = React.useState(false);

  const [visiblePull, setVisiblePull] = React.useState(false);

  const [renamePop, setRenamePop] = React.useState(false);

  const [file_name, setFile_name] = React.useState(" ");
  const [folder, setFolder] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [optionId, setOptionId] = useState("");
  const [pop, setPop] = React.useState("");
  const user = useSelector((state: RootState) => state.userReducer);
  const userData = useSelector(
    (state: RootState) => state.userReducer?.loginDetails
  );
  console.log("UserData", userData);
  const [data, setData] = useState<any>([]);
  const [list, setList] = useState<any>([]);
  const [name, setName] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [renameFolderId, setRenameFolderId] = useState(0);
  const [postRes, setPostRes] = useState<any>("");
  const [errorMessage, setErrormessage] = useState("");
  const [model, setModel] = useState(false);
  const [createLoad, setCreateLoad] = useState(false);

  const [searchQuery, setSearchQuery] = React.useState("");

  const postBody = {
    name: name,
  };

  useEffect(() => {
    if (window.localStorage.getItem("tbzToken") === null) {
    }
    basic();
  }, []);

  const onChangeSearch = (query: React.SetStateAction<string>) =>
    setSearchQuery(query);

  const basic = () => {
    axios({
      method: "post",
      url: `${NETWORK_URL}/payment/create-order`,
      data: {
        plan_id: 1,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.auth_token}`,
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

  const createTanza = () => {
    if (setFolder_id !== "" && file_name !== "" && files.length > 0) {
      setCreateLoad(true);
      let formData = new FormData();
      formData.append("name", file_name);
      formData.append("file", files[0]);
      formData.append("folder_id", setFolder_id);
      formData.append("type", "folder");

      axios
        .post(
          `${NETWORK_URL}/tanzabook`,
          // {
          formData,
          // },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${user.auth_token}`,
            },
          }
        )
        .then((response) => {
          console.log("tanzabook", response);
          localStorage.setItem("tanzabook_id", response.data.data.folder_id);
          // alert("book-created");
          setFolder(!folder);
          setVisiblePop(!visiblePop);
          handleRemove();
          setFile_name("");
          alert("Tanzabook Created Succesfully");
          window.location.reload();
        })

        .catch(function (error: any) {
          setCreateLoad(false);
          console.log("error:", error);
          Sentry.captureException(error);
        });
    } else {
      alert("Please Fill All Fields");
    }
  };

  useEffect(() => {
    getFolders();
  }, [postRes]);

  const getFolders = () => {
    axios
      .get(`${NETWORK_URL}/dashboard`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.auth_token}`,
        },
      })
      .then((response) => {
        console.log("RES", response);
        setData(response.data.data);
        setLoading(true);
        setFolder(true);
        console.log(" Dashboard folders", response.data.data);
      })

      .catch(function (error: any) {
        setErrormessage(errorMessage);
        console.log("Folders", error);
        Sentry.captureException(error);
      });
  };

  function createfolder() {
    if (pop == "") {
      alert("please Enter the name of folder");
    }
    axios({
      method: "post",
      url: `${NETWORK_URL}/folder`,
      data: {
        name: pop,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.auth_token}`,
      },
    })
      .then((response) => {
        window.location.reload();
        setPostRes(response);
        setVisiblePull(false);
        setLoading(true);
        setPop("");
      })
      .catch(function (errorMessage: any) {
        console.log(errorMessage);
        Sentry.captureException(errorMessage);
      });
  }

  function deleteFolder(id: any) {
    console.log("deleting folder..." + id + "<<");
    axios({
      method: "delete",
      url: `${NETWORK_URL}/folder/` + id,

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.auth_token}`,
      },
    })
      .then((response) => {
        console.log("folder Deleted Successfully");
        window.location.reload();
        getFolders();
      })
      .catch(function (errorMessage: any) {
        console.log(errorMessage);
        Sentry.captureException(errorMessage);
      });
  }
  function renameFolder() {
    if (r_name !== "") {
      axios({
        method: "patch",
        url: `${NETWORK_URL}/folder/${renameFolderId}`,
        data: {
          name: r_name,
        },

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.auth_token}`,
        },
      })
        .then((response) => {
          setR_name("");
          setLoading(true);
          getFolders();
          setRenamePop(!renamePop);
        })
        .catch(function (errorMessage: any) {
          console.log(errorMessage);
          setRenamePop(!renamePop);
          Sentry.captureException(errorMessage);
        });
    } else {
      alert("Please Fill Fields");
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      axios
        .get(`${NETWORK_URL}/user/folders`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.auth_token}`,
          },
        })
        .then((response) => {
          setList(response.data.data.data);
        })

        .catch(function (errorMessage: any) {
          console.log("error", errorMessage);
          Sentry.captureException(errorMessage);
        });
    }, [])
  );

  const handleId = (elem: any) => {
    localStorage.setItem("folderId", elem.id);
    localStorage.setItem("folderName", elem.folder_name);

    navigation.navigate("Briefcase");
  };

  const dispatch = useDispatch<any>();

  React.useEffect(() => {
    getUsersData();
  }, []);

  const getUsersData = () => {
    axios
      .get(`${NETWORK_URL}/user/view`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.auth_token}`,
        },
      })
      .then((response) => {
        console.log("Get Resonse Of user Details", response?.data?.data);
        // setUserData(response?.data?.data);
        dispatch(userDetails(response?.data?.data));
      })

      .catch(function (error: any) {
        console.log("UserError", error);
        Sentry.captureException(errorMessage);
      });
  };

  return (
    <View style={styles.container} onClick={() => setShowOptions(false)}>
      <Navbar />
      <ScrollView
        style={{
          marginLeft: wp(100) <= 768 ? 10 : wp(10),
          width: wp(75),
        }}
        nestedScrollEnabled
      >
        <View
          style={{
            flexDirection: wp(100) < 425 ? "row" : "row-reverse",
            width: "95%",
          }}
        >
          <TouchableOpacity
            style={{ display: wp(100) < 426 ? "flex" : "none", marginTop: 10 }}
            onPress={() => navigation.navigate("Home")}
          >
            <Image
              source={require("../../assets/tanzabook-logo.png")}
              style={{ width: 55, height: 50, resizeMode: "contain" }}
            />
          </TouchableOpacity>

          <View
            style={{
              width: wp(100) < 425 ? "85%" : "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 15,
            }}
          >
            <View style={{}}>
              <Text
                style={{
                  display: wp(100) < 425 ? "none" : "flex",
                  fontSize: 30,
                  fontWeight: "800",
                }}
              >
                Dashboard
              </Text>
              <Text
                style={{
                  display: wp(100) < 425 ? "none" : "flex",
                  alignSelf: "flex-start",
                }}
              ></Text>
            </View>
            <View style={{ display: wp(100) < 425 ? "flex" : "none" }}>
              <TouchableOpacity
                onPress={() => {
                  setModel(!model);
                  console.log("Model Opened");
                }}
              >
                <Entypo
                  name="menu"
                  size={30}
                  color="black"
                  style={styles.menuSidebar}
                />
              </TouchableOpacity>
            </View>
            <Modal transparent={true} visible={model}>
              <TouchableWithoutFeedback onPress={() => setModel(false)}>
                <TouchableOpacity
                  style={styles.modalDiv}
                  onPress={() => setModel(false)}
                >
                  <View style={{ backgroundColor: "red" }}>
                    <OptionsModal
                      setModel={setModel}
                      setVisiblePop={setVisiblePop}
                    />
                  </View>
                </TouchableOpacity>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        </View>
        <View style={styles.statsMain}>
          <View
            style={[
              styles.statsBox,
              {
                padding: 15,
                borderWidth: 1,
                width: wp(100) <= 426 ? wp(95) : wp(28),
                display: wp(100) <= 426 ? "flex" : "none",
              },
            ]}
          >
            <View style={styles.statsHead}>
              <Text style={styles.statsHeadText}>Hello,</Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  marginTop: 10,
                  color: "#57555e",
                }}
              >
                {user?.userDetails?.name} !
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: wp(100) <= 426 ? wp(1) : 20,
                flexWrap: wp(100) <= 426 ? "wrap" : "",
                // display: wp(100) < 425 ? "none" : "flex",
                marginTop: wp(100) <= 426 ? wp(10) : wp(2),
                // justifyContent: wp(100) <= 426 ? "space-around" : "",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: wp(100) < 425 ? 5 : 5,
                  height: 42,
                }}
                onPress={() => (window.location.href = "tanzapedia")}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    paddingHorizontal: 10,
                    fontSize: 14,
                    color: "white",
                    fontWeight: "500",
                  }}
                >
                  Tanzapedia
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.secondary,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: wp(100) < 425 ? 5 : 5,
                  height: 42,
                }}
                onPress={() => {
                  setVisiblePop(true);
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    paddingHorizontal: 10,
                    fontSize: 14,
                    color: "white",
                    fontWeight: "500",
                  }}
                >
                  Create Tanzabook
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#d79232",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 5,
                  height: 42,
                }}
                onPress={() => {
                  navigation.navigate("Subscription");
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    paddingHorizontal: 10,
                    fontSize: 14,
                    color: "white",
                    fontWeight: "500",
                  }}
                >
                  Plan -{user?.userDetails?.subscription_plan}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.statsBox}>
            <View style={styles.statsHead}>
              <Text style={[styles.statsHeadText, { marginLeft: 11 }]}>
                Quick Stats
              </Text>
            </View>
            <View style={styles.statsContent}>
              <View style={styles.statsContentBox}>
                <View style={styles.iconBackground}>
                  <Image
                    source={require("../../assets/connection.png")}
                    style={{
                      resizeMode: "contain",
                      padding: 20,
                      tintColor: "#a199f5",
                    }}
                  />
                </View>
                <View style={{}}>
                  <Text style={[styles.statsCount]}>
                    {" "}
                    {data?.total_connects}
                  </Text>
                  <Text style={[styles.statsDescription, { marginLeft: 5 }]}>
                    Connects
                  </Text>
                </View>
              </View>
              <View style={styles.statsContentBox}>
                <View
                  style={[
                    styles.iconBackground,
                    { backgroundColor: "#e1f9fc" },
                  ]}
                >
                  <Image
                    source={require("../../assets/group-on.png")}
                    style={{
                      resizeMode: "contain",
                      padding: 20,
                      tintColor: "#5de0f0",
                    }}
                  />
                </View>
                <View style={{}}>
                  <Text style={[styles.statsCount]}>
                    {" "}
                    {user?.userDetails?.total_groups
                      ? user?.userDetails?.total_groups
                      : 0}{" "}
                  </Text>
                  <Text style={[styles.statsDescription, { marginLeft: 7 }]}>
                    Groups
                  </Text>
                </View>
              </View>
              <View style={styles.statsContentBox}>
                <View
                  style={[
                    styles.iconBackground,
                    { backgroundColor: "#fdebeb" },
                  ]}
                >
                  <Image
                    source={require("../../assets/books1.png")}
                    style={{
                      resizeMode: "contain",
                      padding: 20,
                      tintColor: "#eb5c5d",
                    }}
                  />
                </View>
                <View style={{ marginLeft: 5 }}>
                  <Text style={[styles.statsCount]}>
                    {data.total_tanzabooks ? data.total_tanzabooks : 0}
                  </Text>
                  <Text style={styles.statsDescription}>Tanzabooks</Text>
                </View>
              </View>
              {/* <View style={styles.statsContentBox}>
                <View
                  style={[
                    styles.iconBackground,
                    { backgroundColor: "#e7f8ff" },
                  ]}
                >
                  <Image
                    source={require("../../assets/publisher.png")}
                    style={{
                      resizeMode: "contain",
                      padding: 20,
                      tintColor: "#418fce",
                    }}
                  />
                </View>
                <View style={{ marginLeft: 5 }}>
                  <Text style={[styles.statsCount]}>
                    0
                  </Text>
                  <Text style={styles.statsDescription}>Published</Text>
                </View>
              </View> */}
            </View>
          </View>
          <View
            style={[
              styles.statsBox,
              {
                padding: 15,
                borderWidth: 1,
                width: wp(100) <= 426 ? wp(95) : wp(30),
                marginRight: wp(100) <= 426 ? "" : wp(2),
                display: wp(100) <= 426 ? "none" : "flex",
              },
            ]}
          >
            <View style={styles.statsHead}>
              <Text style={styles.statsHeadText}>Hello,</Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  marginTop: 10,
                  color: "#57555e",
                }}
              >
                {user?.userDetails?.name} !
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: wp(100) <= 426 ? wp(1) : 15,
                flexWrap: wp(100) <= 426 ? "wrap" : "wrap",
                // display: wp(100) < 425 ? "none" : "flex",
                marginTop: wp(100) <= 426 ? wp(10) : wp(2),
                // justifyContent: wp(100) <= 426 ? "space-around" : "",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: wp(100) < 425 ? 5 : 5,
                  height: 42,
                }}
                onPress={() => (window.location.href = "tanzapedia")}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    paddingHorizontal: 10,
                    fontSize: 14,
                    color: "white",
                    fontWeight: "500",
                  }}
                >
                  Tanzapedia
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.secondary,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: wp(100) < 425 ? 5 : 5,
                  height: 42,
                }}
                onPress={() => {
                  setVisiblePop(true);
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    paddingHorizontal: 10,
                    fontSize: 14,
                    color: "white",
                    fontWeight: "500",
                  }}
                >
                  Create Tanzabook
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#d79232",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 5,
                  height: 42,
                }}
                onPress={() => {
                  navigation.navigate("Subscription");
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    paddingHorizontal: 10,
                    fontSize: 14,
                    color: "white",
                    fontWeight: "500",
                  }}
                >
                  Plan -{user?.userDetails?.subscription_plan}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View>
          <View
            style={{
              marginTop: wp(100) <= 426 ? wp(3) : hp(1),
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: wp(100) <= 426 ? "97.5%" : "95%",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setselected_tab("Folders");
                  }}
                >
                  <Text
                    style={
                      selected_tab == "Folders"
                        ? {
                            fontWeight: "600",
                            textDecorationColor: colors.primary,
                            color: "white",
                            backgroundColor: colors.primary,
                            fontSize: 16,
                            justifyContent: "center",
                            paddingHorizontal: 15,
                            paddingVertical: 5,
                            borderRadius: 5,
                            textAlign: "center",
                          }
                        : {
                            fontSize: 16,
                            textAlign: "center",
                            fontWeight: "600",
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                          }
                    }
                  >
                    Folders
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: wp(100) <= 426 ? wp(4) : wp(1),
                  }}
                  onPress={() => {
                    setselected_tab("Shared with me");
                    setShowOptions(false);
                  }}
                >
                  <Text
                    style={
                      selected_tab == "Shared with me"
                        ? {
                            fontWeight: "600",
                            textDecorationColor: colors.primary,
                            color: "white",
                            backgroundColor: colors.primary,
                            fontSize: 16,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 5,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            alignSelf: "center",
                            textAlign: "center",
                          }
                        : {
                            fontSize: 16,
                            alignItems: "center",
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            fontWeight: "500",
                            color: "black",
                            justifyContent: "center",
                            borderRadius: 5,
                            textAlign: "center",
                          }
                    }
                  >
                    Shared with me
                  </Text>
                </TouchableOpacity>
                {/* 
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: wp(100) <= 426 ? wp(4) : wp(1),
                    display: wp(100) <= 426 ? "none" : "block",
                  }}
                  onPress={() => {
                    setselected_tab("Published Tanzabooks");
                    setShowOptions(false);
                  }}
                >
                  <Text
                    style={
                      selected_tab == "Published Tanzabooks"
                        ? {
                            fontWeight: "600",
                            textDecorationColor: colors.primary,
                            color: "white",
                            backgroundColor: colors.primary,
                            fontSize: 16,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            alignSelf: "center",
                            textAlign: "center",
                          }
                        : {
                            fontSize: 16,
                            alignItems: "center",
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            fontWeight: "500",
                            color: "black",
                            justifyContent: "center",
                            borderRadius: 10,
                            textAlign: "center",
                          }
                    }
                  >
                    Published Tanzabooks{" "}
                  </Text>
                </TouchableOpacity> */}
              </View>

              <TouchableOpacity
                onPress={() => {
                  setVisiblePull(true);
                }}
                style={{
                  width: wp(100) <= 426 ? "30%" : "12%",
                  height: wp(100) <= 426 ? hp(5) : hp(6),
                  borderRadius: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.secondary,
                  marginLeft: wp(100) <= 426 ? wp(1) : wp(24),
                  marginRight: wp(100) <= 426 ? "" : wp(-2.5),
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: "650",
                  }}
                >
                  Add Folder
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {selected_tab == "Folders" && (
            <Slide left>
              <View
                style={{
                  flexDirection: wp(100) <= 768 ? "column" : "row",
                  flexWrap: "wrap",
                  gap: wp(100) < 425 ? 20 : wp(2),
                  justifyContent: wp(100) < 425 ? "" : "flex-start",
                  alignItems: "center",
                  width: "100%",
                  marginTop: wp(100) <= 426 ? hp(0.7) : "5%",
                  marginBottom: wp(100) <= 426 ? hp(10) : hp(5),
                  // overflowX: "hidden",
                  // overflowY: "hidden",
                }}
              >
                {data?.folders?.data.length > 0 ? (
                  data?.folders?.data?.map((elem1: any, key: any) => {
                    const folder = elem1.folder_name;
                    return (
                      // <Card
                      //   style={[styles.folderLists, styles.shadowProp]}
                      //   key={elem1.id}
                      // >
                      //   <View
                      //     style={{
                      //       alignItems: "center",
                      //       width: "100%",
                      //       paddingHorizontal: 5,
                      //       justifyContent: "space-between",
                      //       flexDirection: "row",
                      //     }}
                      //   >
                      //     <Text
                      //       style={{
                      //         fontSize: 12,
                      //         fontWeight: "bold",
                      //       }}
                      //     >
                      //       {elem1.folder_name}
                      //     </Text>

                      //     <TouchableOpacity
                      //       onPress={() => {
                      //         setRenameFolderId(elem1.id);
                      //         setRenamePop(true);
                      //       }}
                      //     >
                      //       <FontAwesome5 name="edit" size={18} color="black" />
                      //     </TouchableOpacity>
                      //   </View>
                      //   <View
                      //     style={{
                      //       width: "100%",
                      //       flexDirection: "row",
                      //       marginTop: 10,
                      //       alignItems: "center",
                      //       justifyContent: "space-between",
                      //       padding: 5,
                      //     }}
                      //   >
                      //     <Image
                      //       source={require("../../assets/folder.png")}
                      //       style={{
                      //         width: 40,
                      //         height: 40,
                      //         resizeMode: "contain",
                      //       }}
                      //     />
                      //     <View>
                      //       <Text
                      //         style={{
                      //           fontSize: 12,
                      //           marginTop: 5,
                      //           color: "#a5a5a5",
                      //         }}
                      //       >
                      //         Total Tanzabooks
                      //       </Text>
                      //       <Text
                      //         style={{
                      //           fontSize: 12,
                      //           fontFamily: "lato",
                      //           marginTop: 5,
                      //         }}
                      //       >
                      //         {elem1.total_tanzabooks}
                      //       </Text>
                      //     </View>

                      //   <View>
                      // <Text
                      //   style={{
                      //     fontSize: 12,
                      //     marginTop: 5,
                      //     color: "#a5a5a5",
                      //   }}
                      // >
                      //   Created at
                      // </Text>
                      // <Text
                      //   style={{
                      //     fontSize: 12,
                      //     fontFamily: "lato",
                      //     marginTop: 5,
                      //   }}
                      // >
                      //   {elem1.createdAt}
                      // </Text>
                      //   </View>
                      // </View>
                      //   <View
                      //     style={{ flexDirection: "row", marginTop: 10 }}
                      //   ></View>

                      //   <View
                      //     style={{
                      //       flexDirection: "row",
                      //       justifyContent: "space-between",
                      //       marginTop: wp(100) <= 500 ? "16%" : "15%",
                      //       borderRadius: 16,
                      //       gap: 10,
                      //     }}
                      //   >
                      //     <TouchableOpacity
                      //       style={{
                      //         backgroundColor: colors.primary,
                      //         width: wp(100) < 426 ? "40%" : "45%",
                      //         height: "35px",
                      //         borderRadius: 5,
                      //         marginTop: hp(-3.5),
                      //         alignItems: "center",
                      //         justifyContent: "center",
                      //       }}
                      //       onPress={() => handleId(elem1)}
                      //     >
                      //       <Text
                      //         style={{
                      //           textAlign: "center",
                      //           fontSize: 14,
                      //           color: "white",
                      //         }}
                      //       >
                      //         View
                      //       </Text>
                      //     </TouchableOpacity>
                      //     <TouchableOpacity
                      //       style={{
                      //         backgroundColor: colors.lightBlack,
                      //         width: wp(100) < 426 ? "40%" : "45%",
                      //         height: "35px",
                      //         borderRadius: 5,
                      //         marginTop: hp(-3.5),
                      //         alignItems: "center",
                      //         justifyContent: "center",
                      //       }}
                      //       onPress={() => {
                      //         deleteFolder(elem1.id);
                      //       }}
                      //     >
                      //       <Text
                      //         style={{
                      //           alignSelf: "center",
                      //           fontSize: 14,
                      //           color: "white",
                      //         }}
                      //       >
                      //         Delete
                      //       </Text>
                      //     </TouchableOpacity>
                      //   </View>

                      //   <RenamePop modalVisible={renamePop}>
                      //     <View style={{ flexDirection: "row" }}>
                      //       <Input
                      //         placeholder="Rename to"
                      //         value={r_name}
                      //         onChangeText={(r_name) => setR_name(r_name)}
                      //         style={{
                      //           marginTop: hp(4),
                      //           marginLeft: wp(3),
                      //           padding: 8,
                      //           width: wp(100) <= 426 ? wp(35) : wp(20),
                      //           borderWidth: 2,
                      //           borderColor: colors.primary,
                      //           borderRadius: 10,
                      //           outlineStyle: "none",
                      //         }}
                      //         theme={{ roundness: 10 }}
                      //       />

                      //       <TouchableOpacity
                      //         style={{
                      //           justifyContent: "center",
                      //           marginLeft: wp(1),
                      //           marginTop: hp(4),
                      //           backgroundColor: colors.primary,
                      //           borderRadius: 10,
                      //           padding: 10,
                      //         }}
                      //         onPress={() => {
                      //           renameFolder();
                      //         }}
                      //       >
                      //         <Text
                      //           style={{
                      //             color: "#fff",
                      //             paddingHorizontal: wp(100) <= 768 ? 10 : 15,
                      //           }}
                      //         >
                      //           Save
                      //         </Text>
                      //       </TouchableOpacity>
                      //       <TouchableOpacity
                      //         style={{
                      //           justifyContent: "center",
                      //           marginLeft: wp(1),
                      //           marginTop: hp(4),
                      //           backgroundColor: "black",
                      //           borderRadius: 10,
                      //           padding: 10,
                      //         }}
                      //         onPress={() => {
                      //           setRenamePop(!renamePop);
                      //         }}
                      //       >
                      //         <Text
                      //           style={{
                      //             color: "#fff",
                      //             paddingHorizontal: wp(100) <= 768 ? 10 : 15,
                      //           }}
                      //         >
                      //           Close
                      //         </Text>
                      //       </TouchableOpacity>
                      //     </View>
                      //   </RenamePop>
                      // </Card>
                      <TouchableOpacity
                        style={[
                          styles.cardBox,
                          {
                            zIndex: optionId == elem1.id ? 999 : 0,
                            backgroundColor:
                              optionId == elem1.id && showOptions
                                ? ""
                                : "#ffff",
                          },
                        ]}
                        key={elem1.id}
                        onPress={() => {
                          handleId(elem1);
                          setShowOptions(false);
                        }}
                      >
                        <View>
                          <Image
                            source={require("../../assets/folder.png")}
                            style={{
                              padding: 18,
                              resizeMode: "contain",
                              alignSelf: "flex-start",
                            }}
                          />
                        </View>
                        <View>
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 12,
                              fontWeight: "bold",
                              overflow: "hidden",
                              width: wp(100) <= 426 ? wp(25) : wp(9),
                            }}
                          >
                            {elem1.folder_name}
                          </Text>{" "}
                          <View style={{ flexDirection: "row", gap: wp(1.3) }}>
                            <View>
                              <Text
                                style={{
                                  fontSize: 12,
                                  marginTop: 5,
                                  color: "#a5a5a5",
                                }}
                              >
                                Tanzabooks
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontFamily: "lato",
                                  marginTop: 5,
                                }}
                              >
                                {elem1.total_tanzabooks}
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={{
                                  fontSize: 12,
                                  marginTop: 5,
                                  color: "#a5a5a5",
                                }}
                              >
                                Date :
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontFamily: "lato",
                                  marginTop: 5,
                                }}
                              >
                                {elem1.createdAt}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={{}}>
                          <TouchableOpacity
                            style={{}}
                            onPress={() => {
                              setShowOptions(!showOptions);
                              setOptionId(elem1.id);
                            }}
                          >
                            <SimpleLineIcons
                              name="options-vertical"
                              size={15}
                              color="black"
                              style={{ alignSelf: "flex-end", marginLeft: 8 }}
                            />
                          </TouchableOpacity>
                          {optionId == elem1.id && showOptions ? (
                            <View
                              style={[styles.displayOptions, styles.shadow]}
                            >
                              <View>
                                <Pressable
                                  onHoverIn={() => {
                                    setHover("edit");
                                  }}
                                  onHoverOut={() => {
                                    setHover("");
                                  }}
                                >
                                  <TouchableOpacity
                                    style={
                                      hover == "edit"
                                        ? {
                                            backgroundColor: "lightgray",
                                            flexDirection: "row",
                                            justifyContent: "space-around",
                                            marginTop: wp(100) <= 426 ? 7 : -2,
                                          }
                                        : {
                                            flexDirection: "row",
                                            justifyContent: "space-around",
                                            marginTop: wp(100) <= 426 ? 7 : -2,
                                          }
                                    }
                                    onPress={() => {
                                      // handleId(elem1);
                                      setShowOptions(false);
                                      setRenameFolderId(elem1.id);
                                      setRenamePop(true);
                                      setHover("");
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontWeight: "400",
                                        fontSize: 16,
                                        width: wp(100) <= 426 ? wp(20) : wp(5),
                                      }}
                                    >
                                      Edit
                                    </Text>
                                  </TouchableOpacity>
                                </Pressable>
                                <Pressable
                                  onHoverIn={() => {
                                    setHover("view");
                                  }}
                                  onHoverOut={() => {
                                    setHover("");
                                  }}
                                >
                                  <TouchableOpacity
                                    style={
                                      hover == "view"
                                        ? {
                                            backgroundColor: "lightgray",
                                            flexDirection: "row",
                                            justifyContent: "space-around",
                                            marginTop: wp(100) <= 426 ? 7 : 3,
                                          }
                                        : {
                                            flexDirection: "row",
                                            justifyContent: "space-around",
                                            marginTop: wp(100) <= 426 ? 7 : 3,
                                          }
                                    }
                                    onPress={() => {
                                      handleId(elem1);
                                      setShowOptions(false);
                                      setHover("");
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontWeight: "400",
                                        fontSize: 16,
                                        width: wp(100) <= 426 ? wp(20) : wp(5),
                                      }}
                                    >
                                      View
                                    </Text>
                                  </TouchableOpacity>
                                </Pressable>
                                <Pressable
                                  onHoverIn={() => {
                                    setHover("delete");
                                  }}
                                  onHoverOut={() => {
                                    setHover("");
                                  }}
                                >
                                  <TouchableOpacity
                                    style={
                                      hover == "delete"
                                        ? {
                                            backgroundColor: "lightgray",
                                            flexDirection: "row",
                                            justifyContent: "space-around",
                                            marginTop: wp(100) <= 426 ? 7 : 3,
                                          }
                                        : {
                                            flexDirection: "row",
                                            justifyContent: "space-around",
                                            marginTop: wp(100) <= 426 ? 7 : 3,
                                          }
                                    }
                                    onPress={() => {
                                      deleteFolder(elem1.id);
                                      setShowOptions(false);
                                      setHover("");
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontWeight: "400",
                                        fontSize: 16,
                                        width: wp(100) <= 426 ? wp(20) : wp(5),
                                      }}
                                    >
                                      Delete
                                    </Text>
                                  </TouchableOpacity>
                                </Pressable>
                              </View>
                            </View>
                          ) : null}
                        </View>
                      </TouchableOpacity>
                    );
                  })
                ) : data?.folders?.data.length === 0 ? (
                  <View>
                    <Text>No Data Found</Text>
                  </View>
                ) : errorMessage.length == 0 ? (
                  <ActivityIndicator
                    color="green"
                    size="large"
                    style={{ marginVertical: hp(2) }}
                  />
                ) : (
                  <Text style={{ fontWeight: "700", fontSize: 20 }}>
                    {user?.userDetails?.subscription_plan == undefined ||
                    user?.userDetails?.subscription_plan == null ||
                    user?.userDetails?.subscription_plan == "" ||
                    user?.userDetails?.subscription_plan == "no-active-plan"
                      ? " Select the Plan!"
                      : "Please Login Again"}
                  </Text>
                )}
              </View>
            </Slide>
          )}
          {selected_tab == "Shared with me" && (
            <Slide left>
              <View
                style={{
                  flexDirection: wp(100) <= 768 ? "column" : "row",
                  flexWrap: "wrap",
                  maxWidth: "100%",
                  gap: wp(100) < 425 ? 20 : wp(2),
                  marginTop: wp(100) <= 426 ? hp(0.7) : "7%",
                  marginBottom: wp(100) <= 426 ? hp(10) : hp(0),
                  marginLeft: wp(100) <= 426 ? hp(2) : "",
                }}
              >
                {/* card view */}
                {data?.shared_with_me?.data?.length > 0 ? (
                  data?.shared_with_me?.data?.map((elem1: any, key: any) => {
                    return (
                      // <Card
                      //   style={[styles.sharedLists, styles.shadowProp]}
                      //   key={key}
                      // >
                      //   <View
                      //     style={{
                      //       flexDirection: "row",
                      //       marginTop: 10,
                      //       justifyContent: "space-between",
                      //       width: "90%",
                      //     }}
                      //   >
                      //     <View>
                      //       <Text
                      //         style={{
                      //           fontSize: 12,
                      //           marginTop: 5,
                      //           color: "#a5a5a5",
                      //         }}
                      //       >
                      //         Tanzabook name
                      //       </Text>
                      //       <Text
                      //         style={{
                      //           fontSize: 12,
                      //           fontFamily: "lato",
                      //           marginTop: 5,
                      //         }}
                      //       >
                      //         {elem1.name}
                      //       </Text>
                      //     </View>
                      //     <View>
                      //       <Text
                      //         style={{
                      //           fontSize: 12,
                      //           marginTop: 5,
                      //           color: "#a5a5a5",
                      //         }}
                      //       >
                      //         Created at
                      //       </Text>
                      //       <Text
                      //         style={{
                      //           fontSize: 12,
                      //           fontFamily: "lato",
                      //           marginTop: 5,
                      //         }}
                      //       >
                      //         {elem1.createdAt}
                      //       </Text>
                      //     </View>
                      //   </View>

                      //   <View
                      //     style={{
                      //       flexDirection: "row",
                      //       justifyContent: "center",
                      //       alignItems: "center",
                      //       marginTop: hp(5),
                      //     }}
                      //   >
                      //     <TouchableOpacity
                      //       style={{
                      //         backgroundColor: colors.primary,
                      //         width: wp(100) <= 500 ? wp(50) : wp(10),
                      //         padding: 10,
                      //         alignSelf: "center",
                      //         borderRadius: 5,
                      //       }}
                      //       onPress={() =>
                      // navigation.navigate("Viewer", {
                      //   tanzabook_id: elem1.id,
                      // })
                      //       }
                      //     >
                      //       <Text
                      //         style={{
                      //           textAlign: "center",
                      //           fontSize: 14,
                      //           color: "white",
                      //         }}
                      //       >
                      //         View
                      //       </Text>
                      //     </TouchableOpacity>
                      //   </View>
                      // </Card>
                      <TouchableOpacity
                        style={[
                          styles.cardBox,
                          {
                            zIndex: optionId == elem1.id ? 999 : 0,
                            marginLeft: wp(100) <= 426 ? hp(2) : "",
                            marginTop: wp(100) <= 426 ? "" : -50,
                            backgroundColor:
                              optionId == elem1.id && showOptions
                                ? ""
                                : "#ffff",
                          },
                        ]}
                        key={elem1.id}
                        onPress={() => {
                          navigation.navigate("Viewer", {
                            tanzabook_id: elem1.id,
                          });
                          setShowOptions(false);
                        }}
                      >
                        <View>
                          <Image
                            source={require("../../assets/tanzabook-logo.png")}
                            style={{
                              padding: 23,
                              resizeMode: "contain",
                              alignSelf: "flex-start",
                            }}
                          />
                        </View>
                        <View>
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 12,
                              fontWeight: "bold",
                              overflow: "hidden",
                              width: wp(100) <= 426 ? wp(25) : wp(9),
                            }}
                          >
                            {elem1.name}
                          </Text>{" "}
                          <View style={{ flexDirection: "row" }}>
                            {/* <View>
                              <Text
                                style={{
                                  fontSize: 12,
                                  marginTop: 5,
                                  color: "#a5a5a5",
                                }}
                              >
                                Tanzabooks
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontFamily: "lato",
                                  marginTop: 5,
                                }}
                              >
                                {elem1.total_tanzabooks}
                              </Text>
                            </View> */}
                            <View style={{ flexDirection: "row", gap: wp(1) }}>
                              <Text
                                style={{
                                  fontSize: 12,
                                  marginTop: 5,
                                  color: "#a5a5a5",
                                }}
                              >
                                Date :
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontFamily: "lato",
                                  marginTop: 5,
                                }}
                              >
                                {elem1.createdAt}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={{}}>
                          <TouchableOpacity
                            style={{}}
                            onPress={() => {
                              setShowOptions(!showOptions);
                              setOptionId(elem1.id);
                            }}
                          >
                            <SimpleLineIcons
                              name="options-vertical"
                              size={15}
                              color="black"
                              style={{ alignSelf: "flex-end", marginLeft: 10 }}
                            />
                          </TouchableOpacity>
                          {optionId == elem1.id && showOptions ? (
                            <View style={styles.displayOptions}>
                              <View>
                                <Pressable
                                  onHoverIn={() => {
                                    setHover("view");
                                  }}
                                  onHoverOut={() => {
                                    setHover("");
                                  }}
                                >
                                  <TouchableOpacity
                                    style={
                                      hover == "view"
                                        ? {
                                            backgroundColor: "lightgray",
                                            flexDirection: "row",
                                            justifyContent: "space-around",
                                            marginTop: wp(100) <= 426 ? 7 : 10,
                                          }
                                        : {
                                            flexDirection: "row",
                                            justifyContent: "space-around",
                                            marginTop: wp(100) <= 426 ? 7 : 10,
                                          }
                                    }
                                    onPress={() => {
                                      navigation.navigate("Viewer", {
                                        tanzabook_id: elem1.id,
                                      });
                                      setShowOptions(false);
                                      setHover("");
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontWeight: "400",
                                        fontSize: 16,
                                        width: wp(100) <= 426 ? wp(20) : wp(5),
                                      }}
                                    >
                                      View
                                    </Text>
                                  </TouchableOpacity>
                                </Pressable>
                              </View>
                            </View>
                          ) : (
                            ""
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })
                ) : data?.shared_with_me?.data?.length === 0 ? (
                  <View>
                    <Text>No Data Found</Text>
                  </View>
                ) : errorMessage.length == 0 ? (
                  <ActivityIndicator
                    color="green"
                    size="large"
                    style={{ marginVertical: hp(2) }}
                  />
                ) : (
                  <Text style={{ fontWeight: "700", fontSize: 20 }}>
                    Select the Plan! Or Please Login Again!
                  </Text>
                )}
              </View>
            </Slide>
          )}
        </View>
      </ScrollView>

      <Pullup modalVisible={visiblePull} style={{ borderWidth: 2 }}>
        {/* <View style={{ gap: 20, padding: 20 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 20, fontWeight: "600" }}>
              Create a new Folder !
            </Text>
            <TouchableOpacity onPress={() => setVisiblePull(!visiblePull)}>
              <Entypo name="cross" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <TextInput
            label="Folder Name"
            mode="outlined"
            value={pop}
            onChangeText={(pop) => setPop(pop)}
            outlineColor={colors.primary}
            activeOutlineColor={colors.primary}
            style={{
              height: wp(100) <= 426 ? hp(7) : hp(7),
              width: wp(100) <= 426 ? wp(74) : wp(25),
              backgroundColor: "#fff",
            }}
            theme={{ roundness: 8 }}
            autoComplete={false}
          />

          <View style={{ flexDirection: "row-reverse", gap: 20 }}>
            <TouchableOpacity
              style={{
                justifyContent: "center",

                backgroundColor: colors.primary,
                borderRadius: 10,
              }}
              onPress={() => {
                createfolder();
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 8,
                }}
              >
                Save
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 8,

                backgroundColor: "black",
                borderRadius: 10,
              }}
              onPress={() => {
                handleRemove();
                setFile_name("");
                setVisiblePull(!visiblePull);
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View> */}
        <View style={{ flexDirection: "row" }}>
          <Input
            placeholder="Folder Name"
            value={pop}
            onChangeText={(pop) => setPop(pop)}
            style={{
              marginTop: hp(4),
              marginLeft: wp(1),
              padding: 8,
              width: wp(100) <= 426 ? wp(35) : wp(20),
              borderWidth: 2,
              borderColor: colors.primary,
              borderRadius: 10,
              outlineStyle: "none",
            }}
            theme={{ roundness: 10 }}
            onKeyPress={(e: any) => {
              if (e.nativeEvent.key == "Enter" && pop.length > 0) {
                createfolder();
              }
            }}
          />
          {/* <TextInput
            label="Folder Name"
            mode="outlined"
            value={pop}
            onChangeText={(pop) => setPop(pop)}
            outlineColor={colors.primary}
            activeOutlineColor={colors.primary}
            style={{
              height: wp(100) <= 426 ? hp(7) : hp(4),
              width: wp(100) <= 426 ? wp(74) : wp(20),
              backgroundColor: "#fff",
              marginTop: hp(2),
              padding:10,
            }}
            theme={{ roundness: 8 }}
            autoComplete={false}
          /> */}

          <TouchableOpacity
            style={{
              justifyContent: "center",
              marginLeft: wp(1),
              marginTop: hp(4),
              backgroundColor: colors.primary,
              borderRadius: 10,
              padding: 8,
            }}
            onPress={() => {
              createfolder();
            }}
          >
            <Text
              style={{
                color: "#fff",
                paddingHorizontal: wp(100) <= 768 ? 10 : 15,
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              marginLeft: wp(1),
              marginTop: hp(4),
              backgroundColor: "black",
              borderRadius: 10,
              padding: 8,
            }}
            onPress={() => {
              handleRemove();
              setFile_name("");
              setVisiblePull(!visiblePull);
            }}
          >
            <Text
              style={{
                color: "#fff",
                paddingHorizontal: wp(100) <= 768 ? 10 : 15,
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Pullup>

      <Popup modalVisible={visiblePop}>
        <View style={{ padding: 10 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontFamily: "Lato",
                fontWeight: "800",
                fontSize: 16,
              }}
            >
              Create
            </Text>
            <TouchableOpacity
              onPress={() => {
                setVisiblePop(!visiblePop);
              }}
            >
              <Entypo name="cross" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <select
            style={{
              padding: 12,
              marginTop: hp(4),
              width: wp(100) <= 500 ? "85%" : "60%",
              borderRadius: 10,
            }}
            onChange={(e) => {
              setAllFolder_id(e.target.value);
              console.log(e.target.value);
            }}
          >
            <option value="">Select One</option>
            {list?.map((x: any) => {
              return (
                <option value={x.id} key={x.id}>
                  {x.folder_name}
                </option>
              );
            })}
          </select>

          <View
            style={{
              flexDirection: wp(100) <= 768 ? "column" : "row",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: wp(100) <= 426 ? wp(-14) : wp(0),
            }}
          >
            {/* <Input
              placeholder="Name of Tanzabook"
              placeholderTextColor={"gray"}
              value={file_name}
              onChangeText={(file_name) => setFile_name(file_name)}
              style={{
                marginTop: hp(3),
                width: wp(100) <= 500 ? "70%" : "60%",
                marginLeft: wp(100) <= 500 ? wp(5) : wp(-18),
                padding: 10,
                borderWidth: 2,
                borderColor: colors.primary,
                borderRadius:10,
              }}
            /> */}
            {/* <Input placeholder="Mahindra "/> */}
          </View>
          <Input
            placeholder="Enter Name of Tanzabook"
            // value={file_name}
            onChangeText={(file_name) => setFile_name(file_name)}
            style={{
              width: wp(100) <= 500 ? "85%" : "60%",
              padding: 10,
              borderWidth: 2,
              borderColor: colors.primary,
              borderRadius: 10,
              marginTop: wp(100) <= 426 ? 7 : 10,
            }}
          />
          <View
            style={{
              justifyContent: "flex-start",
              padding: 4,
              marginTop: hp(2),
              marginLeft: wp(1),
            }}
          >
            {/* <input type="file" id="avatar" name="avatar" accept="pdf" /> */}
            <Pane maxWidth={300}>
              <FileUploader
                acceptedMimeTypes={["application/pdf", "image/jpeg"]}
                label="Upload File"
                description="Takes only jpg and pdf files."
                maxSizeInBytes={50 * 1024 ** 2}
                maxFiles={1}
                onChange={handleChange}
                renderFile={(file) => {
                  const fileRejection = fileRejections.find(
                    (fileRejection) => fileRejection.file === file
                  );
                  const { message } = fileRejection || {};
                  const { name, size, type } = file;
                  return (
                    <FileCard
                      key={name}
                      name={name}
                      onRemove={handleRemove}
                      sizeInBytes={size}
                      type={type}
                      validationMessage={message}
                    />
                  );
                }}
                values={files}
              />
            </Pane>
          </View>
          <View style={{ flexDirection: "row-reverse" }}>
            <View style={{ flexDirection: "row", gap: 20 }}>
              <TouchableOpacity
                style={{
                  marginTop: 10,
                  backgroundColor: colors.primary,
                  borderRadius: 7,
                  alignSelf: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
                onPress={createTanza}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    fontFamily: "sans-serif",
                    color: "white",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                  }}
                >
                  {createLoad ? "Loading..." : "Create"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  marginTop: 10,
                  backgroundColor: colors.black,
                  borderRadius: 7,
                  alignSelf: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 8,
                }}
                onPress={() => {
                  setVisiblePop(!visiblePop);
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    fontFamily: "sans-serif",
                    color: "white",
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Popup>

      <RenamePop modalVisible={renamePop}>
        <View style={{ flexDirection: "row" }}>
          <Input
            placeholder="Rename to"
            value={r_name}
            onChangeText={(r_name) => setR_name(r_name)}
            style={{
              marginTop: hp(4),
              marginLeft: wp(3),
              padding: 8,
              width: wp(100) <= 426 ? wp(35) : wp(20),
              borderWidth: 2,
              borderColor: colors.primary,
              borderRadius: 10,
              outlineStyle: "none",
            }}
            theme={{ roundness: 10 }}
            onKeyPress={(e: any) => {
              if (e.nativeEvent.key == "Enter" && r_name.length > 0) {
                renameFolder();
              }
            }}
          />

          <TouchableOpacity
            style={{
              justifyContent: "center",
              marginLeft: wp(1),
              marginTop: hp(4),
              backgroundColor: colors.primary,
              borderRadius: 10,
              padding: 10,
            }}
            onPress={() => {
              renameFolder();
            }}
          >
            <Text
              style={{
                color: "#fff",
                paddingHorizontal: wp(100) <= 768 ? 10 : 15,
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              marginLeft: wp(1),
              marginTop: hp(4),
              backgroundColor: "black",
              borderRadius: 10,
              padding: 10,
            }}
            onPress={() => {
              setRenamePop(!renamePop);
            }}
          >
            <Text
              style={{
                color: "#fff",
                paddingHorizontal: wp(100) <= 768 ? 10 : 15,
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </RenamePop>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    overflowX: "hidden",
    flexDirection: "row",
  },
  lists: {
    height: hp(19),
    width: wp(100) <= 768 ? "100%" : wp(25),
    padding: hp(3),
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderRadius: 10,
  },

  subhead: {
    marginTop: 30,
    fontSize: 18,
    flexDirection: "row",
    textAlign: "left",
    marginRight: 200,
    fontWeight: "500",
  },
  lowhead: {
    fontSize: 12,
    color: "#b5b2ac",
    alignSelf: "flex-start",
    marginRight: 240,
    paddingTop: 20,
    paddingLeft: 10,
  },

  msgbox: {
    width: 35,
    height: 35,
    borderWidth: 1,
    borderRadius: 7,
    backgroundColor: "#FCD0D5",
    borderColor: "#FCD0D5",
    flexDirection: "row",
    alignSelf: "flex-start",
    marginTop: 20,
    marginLeft: 10,
  },

  folderLists: {
    marginTop: hp(2),
    width: wp(100) <= 426 ? "100%" : "29%",
    padding: 10,
  },

  msgtitle: {
    flexDirection: "column",
    justifyContent: "flex-start",
    marginLeft: 40,
  },
  sharedLists: {
    marginTop: hp(2),
    width: wp(100) <= 426 ? "98%" : "30%",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  msg: {
    flexDirection: "column",
    fontSize: 8,
    marginLeft: 40,
  },
  boxset: {
    marginRight: 0,
  },
  pick: {
    width: wp(100) <= 426 ? wp(80) : wp(45),
  },
  modalDiv: {
    width: Dimensions.get("window").width + 10,
    height: Dimensions.get("window").height,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 2,
  },
  cardBox: {
    flexDirection: "row",
    // borderWidth: 1,
    padding: 15,
    width: wp(100) <= 426 ? wp(82) : wp(20.5),
    marginTop: wp(100) <= 426 ? 10 : -40,
    shadowColor: "#ddd",
    shadowOpacity: 0.8,
    elevation: 1,
    marginBottom: scale(10),
    borderStyle: "solid",
    borderWidth: scale(0.3),
    borderColor: "#eee",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    gap: wp(1),
    justifyContent: "space-between",
    borderRadius: 10,
    position: "relative",
    zIndex: 2,
  },
  icon: {
    width: wp(2),
    paddingHorizontal: 2,
  },
  displayOptions: {
    padding: 10,
    width: wp(100) <= 426 ? wp(25) : wp(8),
    position: "absolute",
    top: 25,
    backgroundColor: "white",
    borderRadius: 10,
    marginLeft: wp(100) <= 426 ? wp(-10) : wp(-3.5),
    zIndex: 10,
    shadowColor: "#ddd",
    shadowOpacity: 0.8,
    elevation: 1,
    marginBottom: scale(10),
    borderStyle: "solid",
    borderWidth: scale(0.3),
    borderColor: "#eee",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  shadow: {
    shadowColor: "#ddd",
    shadowOpacity: 0.8,
    elevation: 1,
    marginBottom: scale(10),
    borderStyle: "solid",
    borderWidth: scale(0.3),
    borderColor: "#eee",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  statsMain: {
    flexDirection: wp(100) <= 426 ? "column" : "row",
    // gap: wp(100) <= 426 ? "" : wp(3),
    justifyContent: "space-between",
  },
  statsBox: {
    padding: wp(100) <= 426 ? 10 : 20,
    width: wp(100) <= 426 ? wp(95) : wp(55),
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: "#fff",
    shadowColor: "#ddd",
    shadowOpacity: 0.8,
    elevation: 1,
    marginBottom: scale(10),
    borderStyle: "solid",
    borderWidth: scale(0.3),
    borderColor: "#eee",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  statsHead: {},
  statsHeadText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#57555e",
  },
  statsContent: {
    flexDirection: "row",
    // gap: wp(100) <= 426 ? wp(7) : wp(5),
    flexWrap: wp(100) <= 426 ? "wrap" : "nowrap",
    marginVertical: wp(1.5),
    justifyContent: "space-between",
  },
  statsCount: {
    fontSize: 25,
    fontWeight: "600",
    // alignSelf: "center",
    color: "#6b6972",
  },
  statsDescription: {
    fontWeight: "400",
    color: "#9f9da3",
  },
  statsContentBox: {
    flexDirection: "row",
    gap: wp(0.5),
    padding: 10,
    marginTop: 10,
  },
  iconBackground: {
    backgroundColor: "#efedfd",
    borderRadius: 50,
    padding: 10,
  },
});
