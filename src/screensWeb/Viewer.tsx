import * as Sentry from "@sentry/browser";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Dimensions,
} from "react-native";
import React from "react";
import Annotator from "../Annotator/App";
import Navbar from "../components/Navbar";
import Homenav from "../components/Homenav";
import { colors, hp, wp } from "../utils";
import { useSelector } from "react-redux";
import { RootState } from "../reduxStore/store";
import axios from "axios";
import { API_BASE_URL, NETWORK_URL } from "../utils/config";
import Modal from "react-native-modal";
import { useScrollPosition } from "../hooks/useScrollPosition";
import { useRoute } from "@react-navigation/core";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { usePreventScreenCapture } from "expo-screen-capture";
import { useNavigation } from "@react-navigation/core";
import { ActivityIndicator } from "react-native-paper";
import ActivityIndication from "../components/ActivityIndication";

const Viewer = () => {
  const [loader, setLoader] = React.useState(false);
  console.log("SetLoading", loader);
  const [text, setText] = React.useState("");
  const [visiblePop, setVisiblePop] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [data, setData] = React.useState<any>([]);
  const [pop, setPop] = React.useState("");
  const [tanza, showTanza] = React.useState([]);
  const user = useSelector((state: RootState) => state.userReducer);
  const [modalVisible, setmodalVisible] = React.useState<any>(false);
  const [modalVisible1, setmodalVisible1] = React.useState<any>(false);
  const [pdfUrl, setPdfURL] = React.useState(null);
  const [discussion, setDiscussion] = React.useState(null);
  const [comment, setComment] = React.useState([]);
  const [postRes, setPostRes] = React.useState<any>("");
  const [delRes, setDelRes] = React.useState<any>("");
  const [activityIndication, setActivityIndication] =
    React.useState<any>(false);
  const navigation = useNavigation<any>();
  const scrollRef = React.useRef(null);
  const scrollPosition = useScrollPosition();
  console.log("comment", comment);
  const Route = useRoute();
  console.log("navigation", Route.path);
  const userId = useSelector((state: any) => state.userReducer.userDetails.id);
  console.log("userId", userId);

  const tanzabook_id = localStorage.getItem("tanzabook_id");

  React.useEffect(() => {
    UpdateComment();
  }, [postRes, delRes]);

  React.useEffect(() => {
    ViewTanzabook();
  }, []);
  {
    wp(100) >= 768 &&
      React.useEffect(() => {
        // console.log("object");
        scrollRef.current.scrollToEnd({ animated: true });
      });
  }

  const ViewTanzabook = () => {
    axios
      .get(`${NETWORK_URL}/tanzabook/${tanzabook_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.auth_token}`,
        },
      })
      .then((response) => {
        setDiscussion(response.data.data.discussion);
        setData(response.data.data);
        setPdfURL(response.data.data.file);

        localStorage.setItem("pdfurl", response.data.data.file);
      })

      .catch(function (error: any) {
        Sentry.captureEvent(error);
      });
  };

  function discussComment(id: any) {
    axios({
      method: "post",
      url: `${NETWORK_URL}/discussion`,
      data: {
        tanzabook: tanzabook_id,
        comment: text,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.auth_token}`,
      },
    })
      .then((response) => {
        console.log("response:", response);
        setPostRes(response);
        setText("");
        ViewTanzabook();
      })
      .catch(function (error: any) {
        console.log(error);
        Sentry.captureEvent(error);
        setText("");
        alert("Please Log in");
        navigation.navigate("Landing_Web");
      });
  }

  const UpdateComment = () => {
    axios
      .get(`${NETWORK_URL}/tanzabook/discussion/${tanzabook_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.auth_token}`,
        },
      })
      .then((response) => {
        console.log("Get Res", response);
        setComment(response.data.data);
        // setPdfURL(response.data.data.file);
        // localStorage.setItem("pdfurl", response.data.data.file);
      })

      .catch(function (error: any) {
        console.log(error);
        Sentry.captureEvent(error);
      });
  };

  const handleDelete = (id: number) => {
    console.log("id:", id);
    var config = {
      method: "delete",
      url: `${NETWORK_URL}/discussion/${id}`,
      headers: {
        Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("tbzToken") : null}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        console.log("Delete Res ==>", response);
        setDelRes(response);
      })
      .catch(function (error) {
        console.log(error);
        Sentry.captureEvent(error);
      });
  };
  return (
    <View
      style={{
        height: Dimensions.get("window").height - 1,
        overflow: "scroll",
        overflowX: "hidden",
        overflowY: "hidden",
      }}
    >
      {discussion ? <Navbar /> : <Homenav />}
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 5,
            paddingVertical: 4,
            justifyContent: "space-between",
            borderBottomColor: "#C6C6C6",
            zIndex: 9999,
          }}
        >
          {wp(100) <= 426 && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setmodalVisible(!modalVisible);
                  }}
                >
                  <Image
                    source={require("../../assets/chat.png")}
                    style={{
                      // width: hp(3.5),
                      // height: hp(3),
                      marginTop: hp(-38),
                      resizeMode: "contain",
                      padding: 13,
                    }}
                    resizeMode={"cover"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              zIndex: -9999,
            }}
          >
            <Modal
              style={{ margin: 0, padding: 0 }}
              animationIn="slideInLeft"
              animationOut="slideOutLeft"
              isVisible={modalVisible}
            >
              <View>
                <View style={styles.modalView}>
                  <View style={styles.msgbox1}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        justifyContent: "flex-start",
                        color: colors.primary,
                        fontSize: 18,
                        paddingLeft: 10,
                      }}
                    >
                      Share Your Thoughts
                    </Text>
                    <ScrollView style={styles.msgcontent1} ref={scrollRef}>
                      {comment?.map((elem1: any, key: any) => {
                        return (
                          <>
                            <View key={key}>
                              <View style={styles.icon1}></View>
                              <Text
                                style={{
                                  fontSize: 13,
                                  fontWeight: "700",
                                }}
                              >
                                {elem1.username}
                              </Text>
                              <Text style={{ fontSize: 12 }}>
                                {elem1.comment}
                              </Text>
                            </View>
                          </>
                        );
                      })}
                    </ScrollView>
                    <TouchableOpacity
                      style={{
                        height: hp(5),
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 5,
                        padding: 10,
                      }}
                      onPress={() => {
                        scrollRef.current.scrollToEnd({ animated: true });
                      }}
                    >
                      <TextInput
                        value={text}
                        onChangeText={(text) => setText(text)}
                        style={styles.searchset1}
                        autoComplete={false}
                        onKeyPress={(e: any) => {
                          if (e.nativeEvent.key == "Enter" && text.length > 0) {
                            discussComment();
                          }
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          discussComment();
                        }}
                        style={{
                          alignSelf: "center",
                          width: 35,
                          height: hp(4.4),
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 5,
                          backgroundColor: colors.primary,
                        }}
                      >
                        <Ionicons name="send" size={22} color="white" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={{ position: "absolute", top: 10, left: 10 }}
                  onPress={() => {
                    setmodalVisible(false);
                  }}
                >
                  <Image
                    source={{
                      uri: "https://www.pngitem.com/pimgs/m/215-2152164_left-arrow-black-arrow-key-png-transparent-png.png",
                    }}
                    style={{ width: hp(3), height: hp(3) }}
                    resizeMode={"contain"}
                  />
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        </View>
        {wp(100) >= 768 && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginTop: discussion ? 0 : 50,
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 10,
              }}
            >
              {!discussion ? (
                <>
                  <View style={styles.msgbox}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        justifyContent: "flex-start",
                        fontSize: 18,
                        marginLeft: wp(1),
                        color: colors.primary,
                      }}
                    >
                      Share Your Thoughts
                    </Text>

                    <ScrollView style={styles.msgcontent} ref={scrollRef}>
                      {comment?.map((elem1: any, key: any) => {
                        return (
                          <>
                            <View key={key} style={{ marginTop: 20 }}>
                              {/* <View style={styles.icon}></View> */}
                              <Text
                                style={{
                                  fontSize: 13,
                                  fontWeight: "700",
                                  // color: colors.primary,
                                }}
                              >
                                {elem1.username}
                              </Text>
                              <View style={styles.contentBox}>
                                <Text style={{ fontSize: 12 }}>
                                  {elem1.comment}
                                </Text>
                                {elem1?.username == user?.userDetails?.name ? (
                                  <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDelete(elem1.id)}
                                  >
                                    <MaterialIcons
                                      name="delete"
                                      size={13}
                                      color="white"
                                    />
                                  </TouchableOpacity>
                                ) : null}
                                {/* <TouchableOpacity
                                  style={styles.deleteButton}
                                  onPress={() =>
                                    handleDelete(elem1.id)
                                  }
                                >
                                  <MaterialIcons
                                    name="delete"
                                    size={13}
                                    color="white"
                                  />
                                </TouchableOpacity> */}
                              </View>
                            </View>
                          </>
                        );
                      })}
                    </ScrollView>

                    <TouchableOpacity
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                        gap: 5,
                      }}
                      onPress={() => {
                        scrollRef.current.scrollToEnd({ animated: true });
                      }}
                    >
                      <TextInput
                        value={text}
                        onChangeText={(text) => setText(text)}
                        style={styles.searchset}
                        autoComplete={false}
                        onKeyPress={(e: any) => {
                          if (e.nativeEvent.key == "Enter" && text.length > 0) {
                            discussComment();
                          }
                        }}
                      />
                      <TouchableOpacity
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          width: hp(4.5),
                          height: hp(4.5),
                          borderRadius: 5,
                          backgroundColor: colors.primary,
                        }}
                        onPress={() => {
                          discussComment();
                        }}
                      >
                        <Ionicons name="send" size={18} color="white" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>
                </>
              ) : null}
            </View>
            <View style={{ minWidth: wp(10) }}>
              {/* {loader ? (
                <View
                  style={{
                    position: "absolute",
                    zIndex: 10,
                    marginLeft: wp(30),
                    marginTop: wp(10),
                  }}
                >
                  <ActivityIndicator
                    large
                    color={colors.primary}
                    style={{ padding: 20, width: 50, height: 50 }}
                  />
                </View>
              ) : null} */}
              <Annotator
                modalVisible={modalVisible1}
                setModalVisible={() => setmodalVisible1(!modalVisible1)}
                setLoading={(data: any) => setLoader(data)}
                url={pdfUrl}
              />
            </View>
          </View>
        )}

        {/*  annotation model  */}
        {wp(100) <= 426 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              // marginLeft: -40,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "center",
                // justifyContent: "space-between",
                marginLeft: -5,
              }}
            >
              <Annotator
                modalVisible={modalVisible1}
                setModalVisible={() => setmodalVisible1(!modalVisible1)}
                url={pdfUrl}
                setLoading={(data) => setLoader(data)}
              />

              <TouchableOpacity
                onPress={() => {
                  setmodalVisible1(!modalVisible1);
                }}
              >
                <Image
                  source={require("../../assets/annotate.png")}
                  style={{
                    padding: 13,
                    resizeMode: "contain",
                    marginTop: hp(-38),
                  }}
                  resizeMode={"cover"}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/*  annotation model  */}
        <ActivityIndication modalVisible={loader}>
          <View style={{ flexDirection: "row" }}>
            <ActivityIndicator
              size={"large"}
              color={colors.primary}
              style={{ padding: 20, width: 50, height: 50 }}
            />
          </View>
        </ActivityIndication>
      </View>
    </View>
  );
};

export default Viewer;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: "100%",
    backgroundColor: "#DCDCDC",
    overflowX: "hidden",
    flexDirection: "row",
    // height: Dimensions.get("window").height,
  },

  icon: {
    width: wp(1.8),
    height: hp(4),
    borderRadius: 15,
    marginTop: 24,
    marginLeft: wp(-2.5),
    backgroundColor: "#808080",
  },
  icon1: {
    width: wp(100) <= 426 ? wp(10) : wp(1.8),
    height: wp(100) <= 426 ? hp(4.8) : hp(4),
    borderRadius: 15,
    marginTop: 30,
    marginLeft: wp(-2.5),
    backgroundColor: "#808080",
  },
  msgcontent: {
    width: "100%",
    height: "80%",
    marginVertical: 15,
    fontSize: 10,
    overflow: "scroll",
    overflowX: "hidden",
  },
  msgcontent1: {
    width: "100%",
    height: "80%",
    marginVertical: 10,
    padding: 20,
    overflow: "scroll",
    overflowX: "hidden",
  },
  searchset: {
    borderRadius: 5,
    marginLeft: 1,
    width: wp(14),
    height: hp(4.5),
    borderWidth: 1,
    backgroundColor: "#fff",
    outlineStyle: "none",
  },
  searchset1: {
    borderRadius: 5,
    // borderTopEndRadius: 20,
    // borderTopLeftRadius: 20,
    width: wp(58),
    height: hp(4.4),
    alignSelf: "center",
    borderWidth: 1,
    backgroundColor: "fff",
    outlineStyle: "none",
  },
  iconset: {
    marginLeft: wp(11),
    marginTop: -38,
    width: 16,
    height: 16,
  },
  iconset1: {
    width: 16,
    height: 16,
  },
  msgbox: {
    // width: wp(14),
    height: hp(64),
    padding: 20,
    justifyContent: "center",
    marginTop: wp(-50),
    borderRadius: 10,
    // marginLeft: wp(0.01),
    marginRight: wp(0.8),
    backgroundColor: "#fff",
  },
  msgbox1: {
    height: hp(70),
    justifyContent: "center",
    borderRadius: 10,
    // marginLeft: wp(100) < 425 ?  wp(32)  : wp(40),
    // marginRight: wp(0.5),
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "white",
    alignItems: "flex-start",
    // overflow:'hidden'
  },

  annotationbox: {
    width: "80%",
    height: hp(45),
    backgroundColor: "white",
    borderRadius: 20,
    marginLeft: wp(9.5),
    marginTop: 20,
  },

  folderbox: {
    width: "100%",
    height: hp(45),
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "center",

    alignItems: "center",
    marginTop: 20,
    marginLeft: wp(9.5),
  },
  centeredRightView: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalView: {
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderRightColor: "white",
    padding: 20,
    paddingTop: 55,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: wp(85),
    minHeight: hp(80),
    // marginLeft:-10
  },
  modalView_1: {
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderRightColor: "white",
    padding: 20,
    paddingTop: 55,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: wp(80),
    minHeight: hp(100),
  },
  modalRightView: {
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderLeftColor: "white",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: wp(70),
    minHeight: hp(100),
  },

  crossset: {
    marginRight: wp(20),
    marginTop: hp(2),
  },
  loremset: {
    marginLeft: wp(6),
    marginTop: hp(5),
  },
  deleteButton: {
    padding: 3,
    backgroundColor: "#2f75e8",
    border: "1 px solid #2f75e8",
    color: "#ffff",
    borderRadius: 5,
    alignSelf: "flex-end",
    // marginLeft: wp(20),
  },
  contentBox: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
