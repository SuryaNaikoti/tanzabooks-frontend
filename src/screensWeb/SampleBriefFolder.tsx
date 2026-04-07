//import liraries
import * as Sentry from "@sentry/browser";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Card from "../components/Card";
import Footer from "../components/Footer";
import Homenav from "../components/Homenav";
import { colors, hp, scale, wp } from "../utils";
import { Feather } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { API_BASE_URL, NETWORK_URL } from "../utils/config";
import { useNavigation } from "@react-navigation/core";
import { SimpleLineIcons } from "@expo/vector-icons";

// create a component
export const SampleBriefFolder = () => {
  const [openLinkFolder, setOpenLinkFolder] = useState("");
  const [showOptions, setShowOptions] = React.useState<any>(false);
  const [optionId, setOptionId] = React.useState<any>("");
  const [data, setData] = useState([]);
  const [hover, setHover] = useState("");
  const navigation = useNavigation();
  const sampleFolderid = localStorage.getItem("openlink");
  const Path = localStorage.getItem("path");
  console.log(Path);

  useEffect(() => {
    axios
      .get(`${NETWORK_URL}/sample-folder/${sampleFolderid}`)
      .then((res) => {
        setData(res.data.data.data);
      })
      .catch((err) => {
        console.log(err);
        Sentry.captureException(err);
      });
  }, []);

  const handleView = (id: any) => {
    localStorage.setItem("tanzabook_id", id);

    window.location.href = "viewer";
    //  navigation.navigate('viewer')
  };

  return (
    <>
      <View style={styles.container} onClick={() => setShowOptions(false)}>
        <Homenav />
        <View style={styles.box}>
          {data?.length > 0 ? (
            data.map((e: any) => {
              return (
                // <View style={[styles.card, styles.shadowProp]} key={e.id}>
                //   <View style={styles.card_name}>
                //     <Text style={styles.card_name_text}>{e.name}</Text>
                //   </View>
                //   <TouchableOpacity
                //     style={styles.card_pdfIcon}
                //     onPress={() => handleView(e.id)}
                //   >
                //     <Image
                //       source={require("../../assets/tanzabook-logo.png")}
                //       style={styles.image}
                //     />
                //   </TouchableOpacity>
                //   <View style={styles.card_options}>
                //     <TouchableOpacity>
                //       <View style={styles.card_option_share}>
                //         <EvilIcons name="share-google" size={24} color="black" />
                //         <Text style={styles.card_options_text}>Share</Text>
                //       </View>
                //     </TouchableOpacity>
                //     <TouchableOpacity onPress={() => handleView(e.id)}>
                //       <View style={styles.card_option_share}>
                //         <AntDesign name="eyeo" size={24} color="black" />
                //         <Text style={styles.card_options_text}>View</Text>
                //       </View>
                //     </TouchableOpacity>
                //   </View>
                // </View>
                <TouchableOpacity
                  style={[
                    styles.cardBox,
                    {
                      zIndex: optionId == e.id ? 999 : 0,
                      backgroundColor:
                        optionId == e.id && showOptions ? "" : "#ffff",
                    },
                  ]}
                  onPress={() => {
                    setShowOptions(false);
                    handleView(e.id);
                  }}
                >
                  <TouchableOpacity onPress={() => handleView(e.id)}>
                    <Image
                      source={require("../../assets/tanzabook-logo.png")}
                      style={{
                        padding: 30,
                        resizeMode: "contain",
                        alignSelf: "flex-start",
                      }}
                    />
                  </TouchableOpacity>
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        setShowOptions(false);
                        handleView(e.id);
                        setHover("");
                      }}
                      style={{ marginTop: wp(0.5) }}
                    >
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                          overflow: "hidden",
                          width: wp(100) <= 426 ? wp(25) : wp(9),
                          // marginTop:wp(-1)
                        }}
                      >
                        {e.name}
                      </Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: "row", gap: wp(2) }}>
                      <View style={{ flexDirection: "row", gap: wp(1) }}>
                        <Text
                          style={{
                            fontSize: 12,
                            marginTop: 5,
                            color: "#a5a5a5",
                          }}
                        >
                          Created At :
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: "lato",
                            marginTop: 10,
                          }}
                        >
                          {e.createdAt}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{}}>
                    <TouchableOpacity
                      style={{}}
                      onPress={() => {
                        setShowOptions(!showOptions);
                        setOptionId(e.id);
                      }}
                    >
                      <SimpleLineIcons
                        name="options-vertical"
                        size={15}
                        color="black"
                        style={{
                          alignSelf: "flex-end",
                          marginLeft: 10,
                          // display: wp(100) <= 426 && showOptions ? "none" : "block",
                        }}
                      />
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                    style={{
                      display: wp(100) <= 426 ? "block" : "none",
                      marginTop: 20,
                      marginLeft: 5,
                    }}
                    onPress={() => {
                      setShowOptions(false);
                    }}
                  >
                    <EvilIcons name="share-google" size={28} color="#2f75e8" />
                  </TouchableOpacity> */}
                    {optionId == e.id && showOptions ? (
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
                                      // marginTop: wp(100) <= 426 ? 7 : 10,
                                    }
                                  : {
                                      flexDirection: "row",
                                      justifyContent: "space-around",
                                      // marginTop: wp(100) <= 426 ? 7 : 10,
                                    }
                              }
                              onPress={() => {
                                setShowOptions(false);
                                handleView(e.id);
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
                              setHover("share");
                            }}
                            onHoverOut={() => {
                              setHover("");
                            }}
                          >
                            <TouchableOpacity
                              style={
                                hover == "share"
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
                                Share
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
          ) : (
            <ActivityIndicator
              color="green"
              size="large"
              style={{
                marginLeft: wp(100) < 425 ? wp(7) : wp(49),
                marginTop: wp(100) < 425 ? 25 : "",
              }}
            />
          )}
        </View>
      </View>
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  box: {
    marginTop: wp(100) < 425 ? 20 : "7.5%",
    padding: 20,
    width: wp(100) < 425 ? "100%" : "96%",
    flexDirection: wp(100) < 425 ? "column" : "row",
    flexWrap: wp(100) < 425 ? "nowrap" : "wrap",
    alignSelf: "center",
    gap: 50,
    alignItems: wp(100) < 425 ? "center" : "flex-start",
    justifyContent: wp(100) < 425 ? "center" : "flex-start",
  },
  card: {
    width: wp(100) < 425 ? "95%" : "28%",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    gap: 25,
  },
  card_name: {
    flexDirection: "row",
    width: 80,
    alignItems: "center",
    gap: 5,
  },
  card_name_text: {
    fontSize: 16,
    fontWeight: "600",
  },
  card_pdfIcon: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  card_options: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  card_option_share: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },
  card_options_text: {
    fontSize: 15,
    fontWeight: "600",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderRadius: 10,
    // borderWidth:1,
  },
  cardBox: {
    flexDirection: "row",
    // borderWidth: 4,
    padding: 15,
    width: wp(100) <= 426 ? wp(82) : "24%",
    height: wp(100) <= 426 ? wp(25) : wp(6),
    marginTop: wp(100) <= 426 ? 10 : -30,
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
    gap: wp(1),
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
    marginLeft: wp(100) <= 426 ? wp(-10) : wp(-2),
    zIndex: 1,
  },
});

//make this component available to the app
