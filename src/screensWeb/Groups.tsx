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
  TouchableOpacity,
  TextInput as Input,
  Pressable,
} from "react-native";
import { Divider } from "react-native-paper";
import { FilePicker, Menu, Button } from "evergreen-ui";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { Popover } from "react-native-popable";
import Popup from "../components/Popup";
import Pullup from "../components/Popup";
import { scale, colors, device, wp, hp } from "../utils";
import * as WebBrowser from "expo-web-browser";
import api from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxStore/store";
import { API_BASE_URL, NETWORK_URL } from "../utils/config";
import { groupId, storeToken, userDetails } from "../reduxStore/actions";
import RenamePop from "../components/RenamePop";
import GroupCrPop from "../components/GroupCrPop";
import { FontAwesome5 } from "@expo/vector-icons";
import Fade from "react-reveal/Fade";
import { ActivityIndicator } from "react-native";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { TextInput } from "react-native-paper";
import SelectPicker from "react-native-form-select-picker";
import { Chip, Searchbar } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();

export default function Groups({ navigation }: any) {
  const [selectedValue, setSelectedValue] = useState<any>([]);
  const [deleteRes, setDeleteRes] = useState<any>();
  const [optionsSelectedValue, setOptionsSelectedValue] = useState<any>([]);
  const [noOfSubject, setnoOfSubject] = useState([""]);
  const [visiblePop, setVisiblePop] = React.useState(false);
  const [visiblePull, setVisiblePull] = React.useState(false);
  const [title, settitle] = React.useState();
  const [tanza_name, setTanza_name] = React.useState(" ");
  const [pop, setPop] = React.useState("");
  const [addsubjectmodal, setaddsubjectmodal] = React.useState(false);
  const [loading, setloading] = React.useState(false);
  const [addclassmodal, setaddclassmodal] = React.useState(false);
  const [addteachermodal, setaddteachermodal] = React.useState(false);
  const [addstudentmodal, setaddstudentmodal] = React.useState(false);
  const [editId, setEditId] = React.useState<any>("");
  const user = useSelector((state: RootState) => state.userReducer);
  const [renamePop, setRenamePop] = React.useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [optionId, setOptionId] = useState("");
  const [data, setData] = useState<any>([]);
  const [r_name, setR_name] = React.useState("");
  const [create, setCreate] = useState<string>("");
  const [hover, setHover] = useState("");

  const dispatch = useDispatch<any>();

  useFocusEffect(
    React.useCallback(() => {
      groupList();
    }, [deleteRes])
  );

  const groupList = () => {
    api
      .get(`${NETWORK_URL}/user/groups`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setData(response.data.data);
        console.log("pageREsponse", response.data.data);

        console.log("Groups ", response.data.data);
      })

      .catch(function (error: any) {
        console.log(error);
        Sentry.captureException(error);
      });
  };

  const makeGroup = () => {
    api({
      method: "post",
      url: `${NETWORK_URL}/group`,
      data: {
        name: create,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setCreate(response.data);
        // alert("Group created");
        console.log("Group created");
        setVisiblePop(!visiblePop);
        groupList();
      })
      .catch(function (error: any) {
        console.log(error);
        Sentry.captureException(error);
      });
  };

  function renameGroup() {
    console.log("Edit Id", editId);

    api({
      method: "patch",
      url: `${NETWORK_URL}/group/${editId}`,
      data: {
        name: r_name,
      },

      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("Respose", response);
        groupList();
        setR_name("");
      })
      .catch(function (error: any) {
        console.log(error);
        Sentry.captureException(error);
      });
  }

  function createGroup() {
    api({
      method: "post",
      url: `${NETWORK_URL}/group`,
      data: {
        name: create,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        alert(response.data);
        setVisiblePull(!visiblePull);
        groupList();
        setCreate("");
      })
      .catch(function (error: any) {
        alert(error);
        console.log(error);
        Sentry.captureException(error);
      });
  }

  function deleteGroup(id: any) {
    console.log("Group deleted..." + id + "<<");
    api({
      method: "delete",
      url: `${NETWORK_URL}/group/${id}`,

      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setDeleteRes(response);
      })
      .catch(function (error: any) {
        console.log(error);
        Sentry.captureException(error);
      });
  }

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
        {wp(100) <= 768 && (
          <View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
            <View
              style={{
                alignSelf: "center",
                alignItems: "center",
                width: "50%",
              }}
            >
              <Image
                source={require("../../assets/Presentation.png")}
                style={{
                  resizeMode: "contain",
                  padding: 30,
                  marginTop: 20,
                }}
                resizeMode={"cover"}
              />
              <Text style={{ marginTop: 5, fontWeight: "500" }}>Hello, </Text>
              <Text
                style={{ marginTop: 5, fontWeight: "500", fontFamily: "Lato" }}
              >
                {user.userDetails.name}
              </Text>
            </View>
            {/* MobileView */}
            <View style={{ justifyContent: "center", width: "35%" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.secondary,
                  marginLeft: wp(1),
                  borderRadius: wp(1),
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 5,
                }}
                onPress={() => {
                  setVisiblePop(!visiblePop);
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    // margin: 10,
                    paddingVertical: 5,
                    fontSize: 20,
                    fontWeight: "600",
                    color: "#fff",
                  }}
                >
                  Create
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  marginLeft: wp(1),
                  borderRadius: wp(1),
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 5,
                  backgroundColor: colors.primary,
                  display: wp(100) <= 425 ? "flex" : "none",
                  marginTop: 15,
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    // margin: 10,
                    paddingVertical: 5,
                    fontSize: 20,
                    fontWeight: "600",
                    color: "#fff",
                  }}
                >
                  Groups
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View>
          <View
            style={{
              marginTop: 15,
              flexDirection: "row",
              justifyContent: "space-between",
              width: wp(86),
            }}
          >
            <Text
              style={{
                display: wp(100) <= 768 ? "none" : "flex",
                fontSize: 30,
                fontWeight: "800",
              }}
            >
              Groups
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: colors.secondary,
                marginTop: hp(2),
                borderRadius: 5,
                padding: 6,
                display: wp(100) <= 768 ? "none" : "flex",
              }}
              onPress={() => {
                setVisiblePop(true);
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  fontSize: 15,
                  color: "white",
                  fontWeight: "400",
                }}
              >
                Create group
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: wp(100) <= 768 ? "" : wp(3),
              display: wp(100) <= 768 ? "flex" : "none",
            }}
          >
            <Divider />
          </View>

          <Fade left>
            <View
              style={{
                flexDirection: wp(100) <= 768 ? "column" : "row",
                marginHorizontal: wp(100) <= 768 ? 25 : "",
                flexWrap: wp(100) <= 426 ? "nowrap" : "wrap",
                gap: wp(100) <= 426 ? "" : wp(2),
                width: wp(100) <= 768 ? wp(70) : wp(90),
                marginTop: wp(100) <= 426 ? hp(2) : "3%",
                marginBottom: wp(100) <= 768 ? wp(20) : "",
                // borderWidth:1
              }}
            >
              {/* card view */}
              {data?.data?.length > 0 ? (
                data?.data?.map((elem1: any, key: any) => {
                  return (
                    <TouchableOpacity
                      style={[
                        styles.cardBox,
                        {
                          zIndex: optionId == elem1.id ? 999 : 0,
                          backgroundColor:
                            optionId == elem1.id && showOptions ? "" : "#ffff",
                        },
                      ]}
                      onPress={() => {
                        setShowOptions(false);
                        dispatch(groupId(elem1.id));
                        navigation.navigate(`GroupView`, {
                          group_id: elem1.id,
                        });
                      }}
                    >
                      <View>
                        <FontAwesome
                          name="group"
                          size={35}
                          color="#2f75e8"
                          style={{ marginTop: 8 }}
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
                          {elem1.group_name}
                        </Text>{" "}
                        <View style={{ flexDirection: "row", gap: wp(1) }}>
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
                              Total Members
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                fontFamily: "lato",
                                marginTop: 5,
                              }}
                            >
                              {elem1.total_members}
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
                                          marginTop: wp(100) <= 426 ? -10 : "",
                                        }
                                      : {
                                          flexDirection: "row",
                                          justifyContent: "space-around",
                                          marginTop: wp(100) <= 426 ? -10 : "",
                                        }
                                  }
                                  onPress={() => {
                                    // handleId(elem1);
                                    setShowOptions(false);
                                    setEditId(elem1.id);
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
                                          marginTop: wp(100) <= 426 ? 7 : 4,
                                        }
                                      : {
                                          flexDirection: "row",
                                          justifyContent: "space-around",
                                          marginTop: wp(100) <= 426 ? 7 : 4,
                                        }
                                  }
                                  onPress={() => {
                                    setShowOptions(false);
                                    dispatch(groupId(elem1.id));
                                    navigation.navigate(`GroupView`, {
                                      group_id: elem1.id,
                                    });
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
                                  setHover("remove");
                                }}
                                onHoverOut={() => {
                                  setHover("");
                                }}
                              >
                                <TouchableOpacity
                                  style={
                                    hover == "remove"
                                      ? {
                                          backgroundColor: "lightgray",
                                          flexDirection: "row",
                                          justifyContent: "space-around",
                                          marginTop: wp(100) <= 426 ? 7 : 4,
                                        }
                                      : {
                                          flexDirection: "row",
                                          justifyContent: "space-around",
                                          marginTop: wp(100) <= 426 ? 7 : 4,
                                        }
                                  }
                                  onPress={() => {
                                    setShowOptions(false);
                                    deleteGroup(elem1.id);
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
                                    Remove
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
              ) : data?.data?.length === 0 ? (
                <>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "auto",
                      // marginLeft: wp(45)
                    }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: "500" }}>
                      No groups created yet
                    </Text>
                  </View>
                </>
              ) : (
                <ActivityIndicator
                  color="green"
                  size="large"
                  style={{ marginVertical: hp(2), justifyContent: "center" }}
                />
              )}
            </View>
          </Fade>
        </View>
      </ScrollView>

      <Pullup style={{ height: wp(2) }} modalVisible={visiblePull}>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            label="Folder Name"
            mode="outlined"
            value={create}
            onChangeText={(text) => setCreate(text)}
            outlineColor={colors.primary}
            activeOutlineColor={colors.primary}
            style={{
              marginTop: hp(3),

              height: 40,

              width: wp(20),
            }}
            theme={{ roundness: 10 }}
            autoComplete={false}
          />

          <TouchableOpacity
            style={{
              justifyContent: "center",
              width: "20%",
              marginLeft: wp(1),
              marginTop: hp(10),
              backgroundColor: "black",
              borderRadius: 20,
              padding: 10,
            }}
            onPress={() => {
              createGroup();
            }}
          >
            <Text style={{ color: "#fff", marginLeft: wp(3) }}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              width: "20%",
              marginLeft: wp(1),
              marginTop: hp(10),
              backgroundColor: "#000",
              borderRadius: 20,
              padding: 10,
            }}
            onPress={() => {
              setVisiblePull(!visiblePull);
            }}
          >
            <Text style={{ color: "#fff", marginLeft: wp(2) }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Pullup>

      <GroupCrPop
        // style={{ height: wp(100) <= 500 ? hp(3) : hp(0) }}
        modalVisible={visiblePop}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{ fontSize: wp(100) < 425 ? 17 : 20, fontWeight: "700" }}
          >
            You want to make a group ?
          </Text>
          <TouchableOpacity
            onPress={() => {
              setVisiblePop(!visiblePop);
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700" }}>
              <Entypo name="cross" size={24} color="black" />
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            gap: wp(100) <= 768 ? wp(5) : wp(2),
          }}
        >
          <View
            style={{
              flexDirection: wp(100) <= 768 ? "column" : "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: wp(100) < 425 ? 20 : 0,
            }}
          >
            {/* <TextInput
              label="Name of Group"
              mode="outlined"
              value={create}
              onChangeText={(text) => setCreate(text)}
              outlineColor={colors.primary}
              activeOutlineColor={colors.primary}
              style={{
                marginTop: wp(100) <= 500 ? hp(0) : hp(4),
                height: 40,
                width: wp(100) <= 425 ? wp(55) : wp(22),
              }}
              theme={{ roundness: 10 }}
              autoComplete={false}
            /> */}
            <Input
              placeholder="Name of Group"
              // value={create}
              onChangeText={(text) => setCreate(text)}
              style={{
                marginTop: hp(4),
                // marginLeft: wp(3),
                // height: 40,
                padding: 8,
                width: wp(100) <= 426 ? wp(75) : wp(20),
                borderWidth: 2,
                borderColor: colors.primary,
                borderRadius: 10,
                outlineStyle: "none",
              }}
              theme={{ roundness: 10 }}
              onKeyPress={(e: any) => {
                if (e.nativeEvent.key == "Enter" && create.length > 0) {
                  makeGroup();
                }
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                borderRadius: 5,
                alignSelf: "center",
              }}
              onPress={() => {
                // api({
                //   method: "post",
                //   url: `${NETWORK_URL}/group`,
                //   data: {
                //     name: create,
                //   },
                //   headers: {
                //     "Content-Type": "application/json",
                //   },
                // })
                //   .then((response) => {
                //     setCreate(response.data);
                //     // alert("Group created");
                //     console.log("Group created");
                //     setVisiblePop(!visiblePop);
                //     groupList();
                //   })
                //   .catch(function (error: any) {
                //     console.log(error);
                //   });
                makeGroup();
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 12,
                  color: "white",
                  paddingHorizontal: 25,
                  paddingVertical: 7,
                }}
              >
                Save
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "black",
                borderRadius: 5,
                alignSelf: "center",
              }}
              onPress={() => {
                // alert("Modal has been closed.");
                setVisiblePop(!visiblePop);
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 12,
                  color: "#FFF",
                  paddingHorizontal: 25,
                  paddingVertical: 7,
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View
          style={{
            flexDirection: "row-reverse",
            gap: 10,
            alignItems: "center",
            marginTop: 30,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              borderRadius: 5,
              alignSelf: "center",
            }}
            onPress={() => {
              api({
                method: "post",
                url: `${NETWORK_URL}/group`,
                data: {
                  name: create,
                },
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((response) => {
                  setCreate(response.data);
                  // alert("Group created");
                  console.log("Group created");
                  setVisiblePop(!visiblePop);
                  groupList();
                })
                .catch(function (error: any) {
                  console.log(error);
                });
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                fontSize: 12,
                color: "white",
                paddingHorizontal: 25,
                paddingVertical: 7,
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "black",
              borderRadius: 5,
              alignSelf: "center",
            }}
            onPress={() => {
              // alert("Modal has been closed.");
              setVisiblePop(!visiblePop);
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                fontSize: 12,
                color: "#FFF",
                paddingHorizontal: 25,
                paddingVertical: 7,
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View> */}
      </GroupCrPop>

      <RenamePop modalVisible={renamePop}>
        <View style={{ flexDirection: "row" }}>
          <Input
            placeholder="Rename to"
            value={r_name}
            onChangeText={(r_name) => setR_name(r_name)}
            style={{
              marginTop: hp(4),
              marginLeft: wp(3),
              // height: 40,
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
                renameGroup();
                setRenamePop(!renamePop);
              }
            }}
          />

          <TouchableOpacity
            style={{
              justifyContent: "center",
              // width: "20%",
              marginLeft: wp(1),
              marginTop: hp(4),
              backgroundColor: colors.primary,
              borderRadius: 10,
              padding: 10,
            }}
            // disabled ={true}

            onPress={() => {
              // setF_ID(elem1.id)
              renameGroup();
              setRenamePop(!renamePop);
            }}
          >
            <Text style={{ color: "#fff", paddingHorizontal: 10 }}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              // width: "20%",
              marginLeft: wp(1),
              marginTop: hp(4),
              backgroundColor: "black",
              borderRadius: 10,
              padding: 10,
            }}
            onPress={() => {
              setRenamePop(!renamePop);
              renameGroup();
            }}
          >
            <Text style={{ color: "#fff", paddingHorizontal: 10 }}>Close</Text>
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

  groups: {
    marginTop: hp(2),
    // height: wp(100) <= 768 ? wp(42) : wp(10),
    width: wp(100) <= 768 ? "100%" : wp(20),
    padding: hp(3),
    margin: 20,
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

  msgtitle: {
    flexDirection: "column",
    justifyContent: "flex-start",
    marginLeft: 40,
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
    width: wp(100) <= wp(768) ? wp(80) : wp(45),
  },
  cardBox: {
    flexDirection: "row",
    // borderWidth: 1,
    padding: 15,
    width: wp(100) <= 426 ? wp(82) : wp(20),
    marginTop: wp(100) <= 426 ? wp(5) : -25,
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
    gap: wp(0.5),
    justifyContent: "space-between",
    borderRadius: 10,
    zIndex: 2,
  },
  icon: {
    width: wp(2),
  },
  displayOptions: {
    padding: 10,
    width: wp(100) <= 426 ? wp(25) : wp(8),
    position: "absolute",
    top: 25,
    backgroundColor: "white",
    borderRadius: 10,
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
    marginLeft: wp(100) <= 426 ? wp(-10) : wp(-3.5),
    zIndex: 1,
  },
});
