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
import { API_BASE_URL } from "../utils/config";
import { useNavigation } from "@react-navigation/core";
import { SimpleLineIcons } from "@expo/vector-icons";

// create a component
const Sample = () => {
  const [openLinkFolder, setOpenLinkFolder] = useState("");
  const [data, setData] = useState<any>([]);
  const navigation = useNavigation<any>();
  const [showOptions, setShowOptions] = useState(false);
  const [optionId, setOptionId] = useState("");
  const [hover, setHover] = useState("");

  console.log(data);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/sample-folders`)
      .then((res) => {
        setData(res.data.data.data);
      })
      .catch((err) => {
        console.log(err);
        Sentry.captureException(err);
      });
  }, []);

  const handleView = (id: any) => {
    localStorage.setItem("openlink", id);
    // console.log(id)
    navigation.navigate("samplebrieffolder");
    setShowOptions(false);
  };

  return (
    <>
      <View style={styles.container} onClick={() => setShowOptions(false)}>
        <Homenav />
        <View style={styles.box}>
          {data?.length > 0 ? (
            data?.map((e: any) => {
              return (
                // <View style={[styles.card, styles.shadowProp]} key={e.id}>
                //   <View style={styles.card_name}>
                //     <Text style={styles.card_name_text}>{e.folder_name}</Text>
                //   </View>
                //   <View style={styles.icon_view}>
                //     <Image
                //       source={require("../../assets/folder.png")}
                //       style={styles.image}
                //     />
                //     <View style={styles.tanzabook}>
                //       <Text style={styles.tanzabook_text}>Total Tanzabooks</Text>
                //       <Text>{e.total_tanzabooks}</Text>
                //     </View>
                //     <View style={styles.tanzabook}>
                //       <Text style={styles.tanzabook_text}>Created at</Text>
                //       <Text>{e.createdAt}</Text>
                //     </View>
                //   </View>
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
                  onPress={() => handleView(e.id)}
                >
                  <View>
                    <Image
                      source={require("../../assets/folder.png")}
                      style={{
                        padding: 20,
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
                      {e.folder_name}
                    </Text>{" "}
                    <View style={{ flexDirection: "row", gap: wp(2) }}>
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
                          {e.total_tanzabooks}
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
                        style={{ alignSelf: "flex-end", marginLeft: 10 }}
                      />
                    </TouchableOpacity>
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
      {/* <Footer /> */}
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
    marginTop: wp(100) < 425 ? 20 : "8%",
    padding: 20,
    width: wp(100) < 425 ? "100%" : "96%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "center",
    gap: wp(100) < 425 ? 20 : wp(2),
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
    width: 40,
    height: 40,
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
  icon_view: {
    width: "100%",
    padding: 5,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  tanzabook: {},
  tanzabook_text: {
    fontSize: 10,
    color: "grey",
  },
  tanzabook_count: {
    fontSize: 12,
  },
  cardBox: {
    flexDirection: "row",
    // borderWidth: 1,
    padding: 15,
    width: wp(100) <= 426 ? wp(82) : wp(21),
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

//make this component available to the app
export default Sample;
