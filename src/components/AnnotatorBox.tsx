import * as Sentry from "@sentry/browser";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { colors, hp, scale, wp } from "../utils";
import { Divider } from "react-native-paper";
import { useSelector } from "react-redux";
import { RootState } from "../reduxStore/store";
import { Ionicons } from "@expo/vector-icons";
import SoundPlayer from "react-native-sound-player";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { API_BASE_URL, NETWORK_URL } from "../utils/config";

export const AnnotatorBox = ({ onClose, userName, audio, id }: any) => {
  console.log("Annotation Id ==>", id);
  const [comments, setComments] = useState([]);
  // console.log(comments, "Comments ==>");
  const [postRes, setPostRes] = useState<any>("");
  const userId = useSelector((state: any) => state.userReducer.userDetails.id);
  const user = useSelector((state: RootState) => state.userReducer);
  console.log("user", user);
  const [text, setText] = useState<any>("");
  const [delRes, setDelRes] = useState<any>("");
  console.log("text", text);
  // console.log("Audio in Popup", audio);
  // const tanzabook_id = localStorage.getItem("tanzabook_id");
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    UpdateComment();
  }, [postRes, delRes]);

  // {
  //   wp(100) >= 768 &&
  //     React.useEffect(() => {
  //       // console.log("object");
  //       scrollRef.current.scrollToEnd({ animated: true });
  //     });
  // }

  function discussComment() {
    axios({
      method: "post",
      url: `${NETWORK_URL}/annotation/comment`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.auth_token}`,
      },
      data: {
        anotation_id: id,
        comment: text,
      },
    })
      .then((response) => {
        console.log("response:", response);
        setPostRes(response);
        setText("");
      })
      .catch(function (error: any) {
        console.log(error);
        Sentry.captureEvent(error)
      });
  }

  const UpdateComment = () => {
    axios
      .get(`${NETWORK_URL}/annotation/comment/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.auth_token}`,
        },
      })
      .then((response) => {
        console.log("Get Response ==>", response?.data?.data);
        setComments(response?.data?.data);
        setText("");
      })

      .catch(function (error: any) {
        console.log(error);
        Sentry.captureEvent(error)
      });
  };

  const handleDelete = (id: number) => {
    console.log("id:", id);
    var config = {
      method: "delete",
      url: `${NETWORK_URL}/discussion/${id}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tbzToken")}`,
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
        Sentry.captureEvent(error)
      });
  };

  return (
    <View
      style={{
        // borderWidth: 1,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
      }}
    >
      <TouchableWithoutFeedback onPress={(e: any) => e.stopPropagation()}>
        <View style={styles.container}>
          <View style={styles.headerDiv}>
            {/* <Text style={styles.heading}>Annotator Box</Text> */}
            <Text style={styles.userName}>{userName}</Text>
            <TouchableOpacity onPress={onClose}>
              <Entypo name="squared-cross" size={24} color="#2f75e8" />{" "}
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: 10 }}>
            <audio
              controls
              style={{ width: wp(100) <= 768 ? "100%" : wp(15), height: hp(6) }}
            >
              <source src={audio} type="audio/mpeg" />
            </audio>
          </View>
          <Divider />
          <View style={styles.chatBox}>
            {comments?.map((item: any) => {
              return (
                <View key={item.id}>
                  <Text style={styles.userNameIn}>{item?.username}</Text>
                  <View style={styles.contentBox}>
                    <Text style={styles.messages}>{item?.comment}</Text>
                    {item?.username == user?.userDetails?.name ? (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(item.id)}
                      >
                        <MaterialIcons name="delete" size={13} color="white" />
                      </TouchableOpacity>
                    ) : null}
                    {/* <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                  >
                    <MaterialIcons name="delete" size={13} color="white" />
                  </TouchableOpacity> */}
                  </View>
                </View>
              );
            })}
          </View>
          <View>
            {/* <View style={styles.inputBox}>
            <TextInput
              placeholder="Type Something..."
              placeHolderTextColor="gray"
              style={styles.input}
            />
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
              }}
              onChangeText={(text: any) => {
                console.log(text);
              }}
            >
              <Ionicons name="send" size={18} color="#2f75e8" />
            </TouchableOpacity>
          </View> */}
            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => {
                // scrollRef.current.scrollToEnd({ animated: true });
                console.log("Clicked");
              }}
            >
              <TextInput
                value={text}
                onChangeText={(text) => setText(text)}
                placeholder="Type Something..."
                placeHolderTextColor="gray"
                style={styles.input}
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
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 5,
                }}
              >
                <Ionicons name="send" size={18} color="#2f75e8" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffff",
    width: wp(100) <= 768 ? wp(70) : wp(20),
    padding: 20,
    alignSelf: "center",
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
    marginTop: wp(100) <= 768 ? hp(15) : wp(12),
  },
  headerDiv: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heading: {
    fontWeight: "bold",
  },
  crossIcon: {
    fontWeight: "700",
    fontSize: 16,
  },
  userName: {
    paddingBottom: 5,
    color: "#2f75e8",
    fontWeight: "500",
  },
  userNameIn: {
    paddingVertical: 5,
    color: "#2f75e8",
    fontWeight: "500",
    fontSize: 12,
  },
  messages: {
    paddingVertical: 5,
    fontWeight: "500",
    fontSize: 12,
  },
  input: {
    padding: 8,
    width: "100%",
    outlineStyle: "none",
  },
  inputBox: {
    flexDirection: "row",
    position: "relative",
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#2f75e8",
    borderRadius: 10,
    padding: 5,
    // gap:wp(1),
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
  chatBox: {
    // overflow: "scroll",
    overflowX: "hidden",
    height: 150,
  },
});
