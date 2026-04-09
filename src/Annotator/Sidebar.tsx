import * as Sentry from "@sentry/browser";
import React from "react";
import { wp, hp, scale } from "../utils";
import type { IHighlight } from "react-pdf-highlighter";
// import responsiveSide from './style/responseSide.css';
// import './style/sidebar.css';
import api from "../utils/api";
import { API_BASE_URL, NETWORK_URL } from "../utils/config";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Pressable,
} from "react-native";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AnnotatorBox } from "../components/AnnotatorBox";
import { SimpleLineIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
interface Props {
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
  record: () => void;
  setType: any;
  uploadType: any;
  v3: any;
  width?: any;
  getAnnotations: () => void;
}
const updateHash = (highlight: IHighlight) => {
  console.log("Highlight ==>", highlight.id);
  document.location.hash = `highlight-${highlight.id}`;
};

export function Sidebar({
  highlights,
  toggleDocument,
  resetHighlights,
  setType,
  uploadType,
  v3,
  width,
  getAnnotations,
}: Props) {
  const [sidebar, setSidebar] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [name, setName] = React.useState("");
  const [audio, setAudio] = React.useState("");
  const [id, setId] = React.useState("");
  const [hover, setHover] = React.useState("");
  const [showOptions, setShowOptions] = React.useState(false);
  const [optionId, setOptionId] = React.useState("");
  const user = useSelector((state: any) => state.userReducer);
  console.log("user:", user?.userDetails?.name);

  const reversedHighlights = highlights.reverse();
  // console.log('getAnnotations:',getAnnotations())
  const onDelete = (data: any) => {
    // const asArray = Object.entries(v3)
    // const filtered = asArray.filter(([key, value]) => typeof value === 'string');

    // let x = v3.filter((x: any) => { return x.json_data?.id === data?.id }).map((x: any) => { return x.id })
    let x = v3
      .filter((x: any) => {
        return x.json_data?.id === data?.id;
      })
      .map((x: any) => {
        return x.id;
      });

    console.log(x[0]);
  };
  const handleDelete = (id: number) => {
    console.log("id:", id);
    var config = {
      method: "delete",
      url: `${NETWORK_URL}/annotation/${id}`,
      headers: {
        "Content-Type": "application/json",
      },
      // data: payload,
    };

    api(config)
      .then(function (response) {
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
        Sentry.captureEvent(error);
      });
  };

  // const updateHash = (highlight: IHighlight) => {
  //   console.log("Highlight ==>", highlight);
  //   document.location.hash = `highlight-${highlight.id}`;
  // };

  React.useEffect(() => {
    // updateHash();
    console.log("Consoled");
  }, []);

  return (
    <>
      {/* <TouchableOpacity onPress={() => setSidebar(false)}>
        <View
          style={
            sidebar
              ? {
                  fontSize: 18,
                  display: wp(100) <= 500 ? "none" : "flex",
                  color: "black",
                  marginLeft: wp(-3),
                  marginTop: 25,
                }
              : {
                  fontSize: 18,
                  display: "none",
                  color: "black",
                }
          }
        >
          <Entypo name="squared-cross" size={24} color="#2f75e8" />
        </View>
      </TouchableOpacity> */}
      <View
        style={{
          height: wp(100) <= 426 ? hp(100) : Dimensions.get("window").height,
          overflow: "scroll",
        }}
        onClick={() => setShowOptions(false)}
      >
        <div
          className="sidebar"
          style={
            sidebar
              ? {
                  width: wp(100) <= 500 ? wp(57) : wp(25),
                  justifyContent: "flex-end",
                  marginLeft: wp(100) <= 500 ? wp(1) : wp(1),
                  height: wp(100),
                  display: "none",
                  padding: 10,
                  backgroundColor: "#ffff",
                }
              : {
                  width: wp(100) <= 500 ? wp(57) : wp(25),
                  justifyContent: "flex-end",
                  marginLeft: wp(100) <= 500 ? wp(1) : wp(1),
                  height: wp(100),
                  padding: 10,
                  backgroundColor: "#ffff",
                }
          }
        >
          {/* <TouchableOpacity
            onPress={() => setSidebar(true)}
            style={{
              marginTop: 20,
              marginLeft: wp(22),
              display: wp(100) <= 500 ? "none" : "flex",
            }}
          >
            <Entypo name="squared-cross" size={24} color="#2f75e8" />
          </TouchableOpacity> */}
          <div
            className="description"
            style={{ padding: wp(100) <= 500 ? "0px" : "10px" }}
          >
            <h2
              style={{
                // marginBottom: "20px",
                textAlign: "center",
                color: "black",
              }}
            >
              Annotations
            </h2>
            {/* <p>
              <small style={{ textAlign: "center" }}>
                To create area highlight hold ⌥ Option key (Alt), then click and
                drag.
              </small>
            </p> */}
          </div>
          {/* <hr /> */}
          <ul
            className="sidebar__highlights"
            style={{
              // marginLeft: wp(100) <= 500 ? wp(-3) : wp(-0.7),
              marginTop: wp(100) <= 500 ? "" : wp(-0.7),
              listStyle: "none",
              marginBottom: wp(100) <= 500 ? "" : wp(3),
            }}
            // style="list-style-type:none"
          >
            {highlights.reverse().map((highlight, index) => (
              <li
                key={index}
                className="sidebar__highlight"
                onClick={() => {
                  updateHash(highlight);
                  console.log(highlight);
                }}
                style={{
                  // border: "2px solid lightgray",
                  // padding: 10,
                  height: wp(100) <= 500 ? hp(15) : wp(3.5),
                  borderRadius: 15,
                  backgroundColor: "#fff",
                  shadowColor: "#ddd",
                  shadowOpacity: 0.8,
                  elevation: 1,
                  // marginBottom: scale(10),
                  borderStyle: "solid",
                  borderWidth: scale(0.3),
                  borderColor: "#eee",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  // height:10,
                  marginBottom: 5,
                }}
              >
                {/* {console.log("Highlight", highlight)} */}
                {/* <TouchableOpacity
                  onPress={() => {
                    setModal(true);
                    setAudio(highlight?.comment?.audio);
                    setId(highlight?.id);
                  }}
                > */}
                <div>
                  {/* <strong>{highlight.comment.text}</strong> */}
                  {highlight.comment.text ? (
                    <div className="row">
                      {highlight.comment.user_id == user.userDetails.id ? (
                        <div
                          className="col-4"
                          style={{
                            border: "1 px solid #2f75e8",
                            alignContent: "center",
                          }}
                        >
                          {/* <button
                            style={{
                              padding: 2,
                              backgroundColor: "#2f75e8",
                              // border: "1 px solid #2f75e8",
                              color: "#ffff",
                              fontWeight: "500",
                              borderStyle: "none",
                              borderRadius: 5,
                              cursor: "pointer",
                              alignSelf: "flex-end",
                              marginLeft: wp(19),
                            }}
                            onClick={() => handleDelete(highlight.id)}
                          >
                            <AntDesign name="delete" size={12} color="#fff" />
                          </button> */}
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <div
                              // className="highlight__location"
                              style={{
                                color: "black",
                                marginTop: wp(-1),
                                fontSize: 10,
                                marginRight: 10,
                              }}
                            >
                              <p>Page {highlight.position.pageNumber}</p>
                            </div>
                            <TouchableOpacity
                              style={{}}
                              onPress={() => {
                                setShowOptions(!showOptions);
                                setOptionId(highlight.id);
                              }}
                            >
                              <SimpleLineIcons
                                name="options-vertical"
                                size={15}
                                color="black"
                                style={{
                                  alignSelf: "flex-end",
                                  marginLeft: 10,
                                }}
                              />
                            </TouchableOpacity>
                            {optionId == highlight.id && showOptions ? (
                              <View
                                style={{
                                  // padding: 10,
                                  width: wp(100) <= 426 ? wp(25) : wp(7),
                                  position: "absolute",
                                  top: 25,
                                  backgroundColor: "#ffff",
                                  borderRadius: 7,
                                  marginLeft: wp(100) <= 426 ? wp(23) : wp(16),
                                  zIndex: 10,
                                  justifyContent: "cneter",
                                  shadowColor: "#ddd",
                                  shadowOpacity: 0.8,
                                  elevation: 1,
                                  marginBottom: scale(10),
                                  borderStyle: "solid",
                                  borderWidth: scale(0.5),
                                  borderColor: "#eee",
                                  shadowOffset: {
                                    width: 2,
                                    height: 2,
                                  },
                                }}
                              >
                                <View
                                  style={{
                                    alignSelf: "center",
                                    alignContent: "center",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {/* <Pressable
                                    onHoverIn={() => {
                                      setHover("delete");
                                    }}
                                    onHoverOut={() => {
                                      setHover("");
                                    }}
                                  > */}
                                  <TouchableOpacity
                                    style={
                                      hover == "delete"
                                        ? {
                                            backgroundColor: "lightgray",
                                            flexDirection: "row",
                                            // justifyContent: "space-around",
                                            marginVertical:
                                              wp(100) <= 426 ? 7 : 7,
                                            alignSelf: "center",
                                            alignContent: "center",
                                            justifyContent: "center",
                                            alignItems: "center",
                                          }
                                        : {
                                            flexDirection: "row",
                                            // justifyContent: "space-around",
                                            marginVertical:
                                              wp(100) <= 426 ? 7 : 7,
                                            alignSelf: "center",
                                            alignContent: "center",
                                            justifyContent: "center",
                                            alignItems: "center",
                                          }
                                    }
                                    onPress={() => {
                                      setShowOptions(false);
                                      setHover("");
                                      handleDelete(highlight.id);
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontWeight: "400",
                                        fontSize: 16,
                                        width: wp(100) <= 426 ? wp(20) : wp(5),
                                        marginLeft:
                                          wp(100) <= 426 ? wp(4) : wp(2),
                                      }}
                                    >
                                      Delete
                                    </Text>
                                  </TouchableOpacity>
                                  {/* </Pressable> */}
                                </View>
                              </View>
                            ) : null}
                          </View>
                        </div>
                      ) : null}
                      <div
                        className="col-8"
                        style={{
                          // marginTop: 10,
                          // marginBottom: 15,
                          color: "black",
                        }}
                      >
                        <blockquote style={{ fontSize: 13 }}>
                          {`${highlight.comment.text.slice(0, 80).trim()}…`}
                        </blockquote>
                        {/* <Text numberOfLines={2}>{highlight.comment.text}</Text> */}
                      </div>
                    </div>
                  ) : null}
                  {highlight.content.image ? (
                    <div
                      className="highlight__image"
                      style={{
                        // marginTop: "0.5rem",
                        border: "1px solid balck",
                      }}
                    >
                      <img src={highlight.content.image} alt={"Screenshot"} />
                    </div>
                  ) : null}
                </div>
                {/* </TouchableOpacity> */}
                {/* <div
                  className="highlight__location"
                  style={{
                    color: "black",
                    fontWeight: "500",
                    // marginTop: wp(-1),
                    marginRight: 10,
                  }}
                >
                  <p>Page {highlight.position.pageNumber}</p>
                </div> */}
              </li>
            ))}
          </ul>
        </div>

        <Modal
          style={{
            margin: 0,
            padding: 0,
          }}
          animationIn="slideInRight"
          animationOut="slideOutRight"
          isVisible={modal}
          backdropColor="white"
          backdropOpacity={0.2}
        >
          <TouchableWithoutFeedback onPress={() => setModal(false)}>
            <View style={{ backgroundColor: "transparent" }}>
              <AnnotatorBox
                onClose={() => setModal(false)}
                userName={user?.userDetails?.name}
                audio={audio}
                id={id}
              />
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </>
  );
}
