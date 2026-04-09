import * as Sentry from "@sentry/browser";
import * as React from "react";
import {
  Colors,
  DataTable,
  Divider,
  IconButton,
  Searchbar,
  TextInput,
} from "react-native-paper";
import { Icon } from "react-native-elements";

import {
  StyleSheet,
  Button,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput as Input,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Avatar, colors } from "react-native-elements";
import Navbar from "../components/Navbar";
import { hp, wp } from "../utils";
import Popup from "../components/Popup";
import Card from "../components/Card";
import Pushup from "../components/Pushup";
import MoveUp from "../components/MoveUp";
import { Popover } from "react-native-popable";
import { Image } from "react-native-elements";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { API_BASE_URL, NETWORK_URL } from "../utils/config";
import api from "../utils/api";
import { useSelector } from "react-redux";
import { RootState } from "../reduxStore/store";
import { getMediaLibraryPermissionsAsync } from "expo-image-picker";
import { navigationRef } from "../utils/RootNavigation";
import Viewer from "./Viewer";
import { black } from "react-native-paper/lib/typescript/styles/colors";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import SharePop from "../components/SharePop";
import CustomDropdown from "../components/CustomComponents/CustomDropDown";
import VirtualizedSelect from "react-virtualized-select";
import "react-virtualized/styles.css";
import "react-virtualized-select/styles.css";
import MultiSelect from "react-native-multiple-select";
import { Pane, FileUploader, FileCard } from "evergreen-ui";

// import "react-select/dist/react-select.css";
// const optionsPerPage = [2, 3, 4];

const GroupView = ({ navigation }: any) => {
  const user = useSelector((state: RootState) => state.userReducer);
  const [ApiData, setApiData] = React.useState<any>([]);
  const [page, setPage] = React.useState<number>(0);
  const [selected_tab, setselected_tab] = React.useState("Tanzabooks");
  const [allData, setAllData] = React.useState<any>([]);
  const [filteredData, setFilteredData] = React.useState(allData);
  const [pop, setPop] = React.useState(" ");
  const [body, setBody] = React.useState(" ");
  const [search, setNewSearch] = React.useState("");
  const [editModal, setEditModal] = React.useState(false);
  const [visiblePull, setVisiblePull] = React.useState(false);
  const [sharePull, setSharePull] = React.useState(false);
  const [data, setData] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(true);
  const [saveMember, setSaveMember] = React.useState("");
  const [selectedUserData, setSelectedUserData] = React.useState<any>();
  // console.log("selectedUserData", selectedUserData);
  const [loadOptionsData, setLoadOptionsData] = React.useState<any>([]);
  const [searchUser, setSearchUser] = React.useState(" ");
  const [move, setMove] = React.useState(false);
  const [drop, selectDrop] = React.useState();
  const [searchText, setSearchText] = React.useState("");
  const [searchRes, setSearchRes] = React.useState<any>([]);
  const [selectedOption, setSelectedOption] = React.useState<any>({});
  const [postRes, setPostRes] = React.useState<any>("");
  const [list, setList] = React.useState<any>([]);
  const [fileRejections, setFileRejections] = React.useState([]);
  const [setFolder_id, setAllFolder_id] = React.useState("");
  const [file_name, setFile_name] = React.useState(" ");
  const [visiblePop, setVisiblePop] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const handleChange = React.useCallback((files) => setFiles([files[0]]), []);

  const handleRemove = React.useCallback(() => {
    setFiles([]);
    setFileRejections([]);
  }, []);

  const group_id = useSelector((store: any) => store?.designReducer?.groupId);
  console.log("Group ID", group_id);

  const handleSearch = (fix: any) => {
    //  let value = fix.allData.toLowerCase();
    let result = [];
    result = allData.filter((info: any) => {
      return info.mobile.search !== -1;
    });
    setFilteredData(result);
  };

  useFocusEffect(
    React.useCallback(() => {
      const result = axios
        .get(`${NETWORK_URL}/group/${group_id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setData(response.data.data);
          console.log("Groupview", response.data.data);
          setLoading(false);

          // alert(JSON.stringify(response.data));
          //  alert(response.data.data.length);
        })
        .catch(function (error: any) {
          // alert(user.auth_token);
          //   setError(error.response.data.error);
          Sentry.captureException(error);
        });
    }, [postRes])
  );
  // React.useEffect(() => {
  //   groupData();
  //   // window.location.reload();
  // }, [postRes]);

  useFocusEffect(
    React.useCallback(() => {
      axios
        .get(`${NETWORK_URL}/user/folders`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setList(response.data.data.data);
        })

        .catch(function (error: any) {
          Sentry.captureException(error);
        });
    }, [])
  );

  // const groupData = () => {
  //   axios
  //     .get(
  //       `${NETWORK_URL}/group/${new URLSearchParams(
  //         window.location.search
  //       )?.get("group_id")}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       setData(response.data.data);
  //       console.log("Groupview", response.data.data);
  //       setLoading(false);
  //     })
  //     .catch(function (error: any) {
  //       console.log(error);
  //     });
  // };

  const getUserData = (data: any) => {
    if (data.length > 2) {
      axios
        .get(`${NETWORK_URL}/user?q=${data}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setLoadOptionsData(response.data.data);
          } else {
            setLoadOptionsData([{}]);
          }
        })
        .catch(function (error: any) {
          console.log(error);
          Sentry.captureException(error);
        });
    }
  };
  const loadOptions = (inputValue: string, callback: (options: []) => void) => {
    setTimeout(() => {
      callback(
        loadOptionsData?.map((peers: any, index: any) => {
          return { value: peers.id, label: peers.email };
        })
      );
    }, 1000);
  };

  const options = searchRes?.map((peers: any, index: any) => {
    return { value: peers.id, label: peers.name };
  });

  const addMember = () => {
    api({
      method: "post",
      url: `${NETWORK_URL}/group-member`,
      data: {
        group_id: new URLSearchParams(window.location.search)?.get("group_id"),
        invite_user: selectedOption.map((x: any) => {
          return {
            user_id: x.value,
          };
        }),
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("Post response of addMember", response);
        setPostRes(response);
        setVisiblePull(false);
      })
      .catch(function (error: any) {
        console.log(error);
        Sentry.captureException(error);
      });
  };
  const ShareMember = () => {
    api({
      method: "post",
      url: `${NETWORK_URL}/tanzabook/share`,
      data: {
        tanzabook_id: data?.created_by,
        invite_user: selectedOption.map((x: any) => {
          return {
            user_id: x.value,
          };
        }),
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("Share response", response);
      })
      .catch(function (error: any) {
        console.log(error);
        Sentry.captureException(error);
      });
  };

  //Create Tanza books Function
  const createTanza = () => {
    if (setFolder_id !== "" && file_name !== "" && files.length > 0) {
      let formData = new FormData();
      formData.append("name", file_name);
      formData.append("file", files[0]);
      formData.append("folder_id", setFolder_id);

      // console.log("Form Data", formData)
      setVisiblePop(false);
      // axios
      //   .post(
      //     `${NETWORK_URL}/tanzabook`,
      //     // {
      //     formData,
      //     // },
      //     {
      //       headers: {
      //         "Content-Type": "multipart/form-data",
      //       },
      //     }
      //   )
      //   .then((response) => {
      //     console.log("tanzabook", response);
      //     localStorage.setItem("tanzabook_id", response.data.data.folder_id);
      //     // alert("book-created");
      //     setVisiblePop(!visiblePop);
      //     setFile_name("");
      //     window.location.reload();
      //   })

      //   .catch(function (error: any) {
      //     console.log("error:", error);
      // Sentry.captureException(error);

      //   });
    } else {
      alert("Please Fill All Fields");
    }
  };

  const callAddData = (searchText: any) => {
    console.log(searchText);
    return axios
      .get(`${NETWORK_URL}/user?q=${searchText}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("Search Response", res?.data?.data);
        var optionData;
        optionData = res?.data?.data?.map((peers: any, index: any) => {
          return { value: peers.id, label: peers.name };
        });
        return optionData;
      })
      .catch((err) => {
        console.log(err);
        Sentry.captureException(err);
      });
  };

  // React.useEffect(() => {
  //   let debouncing = setTimeout(() => {
  //     handleChange();
  //   }, 500);

  //   return () => clearTimeout(debouncing);
  // }, [searchText]);

  const CustomStyle = {
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "black" : "gray",
    }),
  };

  return (
    <View style={styles.container}>
      <>
        <Navbar />
        {wp(100) >= 768 && (
          <ScrollView
            style={{
              width: wp(90),
              height: hp(100),
              marginLeft: wp(100) <= 768 ? 10 : wp(10),
            }}
          >
            <View
              style={{ flexDirection: "row", width: "100%", marginTop: 10 }}
            >
              <View
                style={{
                  justifyContent: "center",
                  width: wp(100) <= 768 ? "30%" : "15%",
                  // marginLeft: "2%",
                  marginTop: 8,
                  // marginLeft: wp(1),
                }}
              >
                <Text style={{ fontSize: 30, fontWeight: "800" }}>
                  {data?.name}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: hp(2),
                gap: 20,
                alignItems: "center",
                justifyContent: "space-between",
                width: "98%",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={{}}
                  onPress={() => {
                    setselected_tab("Tanzabooks");
                  }}
                >
                  <Text
                    style={
                      selected_tab == "Tanzabooks"
                        ? {
                            // textDecorationLine: "underline",
                            fontWeight: "600",
                            textDecorationColor: colors.primary,
                            color: "white",
                            backgroundColor: colors.primary,
                            fontSize: 18,
                            borderRadius: 5,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                          }
                        : {
                            fontSize: 18,
                            fontFamily: "lato",
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                          }
                    }
                  >
                    Tanzabooks
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ alignItems: "center", justifyContent: "center" }}
                  onPress={() => {
                    setselected_tab("Members");
                  }}
                >
                  <Text
                    style={
                      selected_tab == "Members"
                        ? {
                            // textDecorationLine: "underline",
                            fontWeight: "600",
                            textDecorationColor: colors.primary,
                            color: "white",
                            backgroundColor: colors.primary,
                            fontSize: 18,
                            borderRadius: 5,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                          }
                        : {
                            fontSize: 18,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                          }
                    }
                  >
                    Members
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={{
                    // marginLeft: wp(100) <= 500 ? wp(-38) : wp(41),
                    margin: 10,
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                    borderRadius: 7,
                    backgroundColor: "#000",
                  }}
                  onPress={() => {
                    setVisiblePull(true);
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
                    Add Members
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    // margin: 10,
                    margin: 10,
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                    borderRadius: 7,
                    backgroundColor: "#000",
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
              </View>
            </View>

            {selected_tab == "Tanzabooks" && (
              // <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              //   {/* Lesson boxes */}
              //   {/* {data?.map((elem1: any, key: any) => {
              // return ( */}
              //   <View style={[styles.box, styles.shadowProp]}>
              //     <View style={styles.img}></View>

              //     <TouchableOpacity
              //       style={{ marginLeft: wp(1), marginTop: hp(1) }}
              //       onPress={() => navigation.navigate("Viewer")}
              //     >
              //       <Text style={styles.title}> {data?.name}</Text>
              //     </TouchableOpacity>

              //     {/* <View style={styles.textSet}> */}

              //     <View
              //       style={{
              //         flexDirection: "row",
              //         justifyContent: "space-around",
              //         marginTop: hp(6),
              //       }}
              //     >
              //       <TouchableOpacity
              //         style={{ flexDirection: "row", marginTop: hp(6) }}
              //         onPress={() => {
              //           setSharePull(true);
              //         }}
              //       >
              //         <Image
              //           source={require("../assets/Group 3135.png")}
              //           style={{ width: 20, height: 20 }}
              //         />
              //         <Text style={{ marginLeft: wp(0.4) }}>Share</Text>
              //       </TouchableOpacity>
              //       <TouchableOpacity
              //         style={{ flexDirection: "row", marginTop: hp(6) }}
              //         onPress={() => setMove(true)}
              //       >
              //         <Image
              //           source={require("../assets/Group 3136.png")}
              //           style={{ width: 20, height: 20 }}
              //         />
              //         <Text style={{ marginLeft: wp(0.4) }}>Move</Text>
              //       </TouchableOpacity>
              //     </View>
              //     {/* </View> */}
              //   </View>
              // </View>
              <Text style={{ marginLeft: 20, fontWeight: 700, fontSize: 20 }}>
                No data Found
              </Text>
            )}

            <MoveUp style={{ wp: 20 }} modalVisible={move}>
              <View
                style={{
                  flexDirection: "row",
                  width: wp(30),
                  // alignItems: "center",
                  marginLeft: wp(1),
                }}
              >
                {/* <TextInput
                  label="Move to Folder name"
                  mode="outlined"
                  value={drop}
                  onChangeText={(drop) => selectDrop(drop)}
                  outlineColor={colors.primary}
                  activeOutlineColor={colors.primary}
                  style={{
                    marginLeft: wp(1),
                    width: wp(100) <= 426 ? wp(5) : wp(20),
                    marginTop: hp(4),
                    height: 40,
                  }}
                  theme={{ roundness: 10 }}
                  autoComplete={false}
                /> */}
                <select
                  style={{
                    padding: 10,
                    // marginTop: hp(4),
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
                    return <option value={x.id}>{x.folder_name}</option>;
                  })}
                </select>
                <View style={{ flexDirection: wp(100) <= 426 ? "row" : "row" }}>
                  <TouchableOpacity
                    style={{
                      justifyContent: "space-between",
                      width: wp(100) <= 426 ? "10%" : "48%",
                      marginLeft: wp(1),
                      // marginTop: hp(4),
                      backgroundColor: colors.primary,
                      borderRadius: 10,
                      padding: 10,
                      height: 40,
                    }}
                    // onPress={() => {
                    //   ShareMember();
                    // }}
                  >
                    <Text style={{ color: "#fff", textAlign: "center" }}>
                      Move
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      width: wp(100) <= 426 ? "10%" : "48%",
                      marginLeft: wp(1),
                      // marginTop: hp(4),
                      backgroundColor: "black",
                      borderRadius: 10,
                      padding: 10,
                      height: 40,
                    }}
                    onPress={() => {
                      setMove(!move);
                    }}
                  >
                    <Text style={{ color: "#fff", textAlign: "center" }}>
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* </View> */}
            </MoveUp>

            <SharePop modalVisible={sharePull}>
              {/* <AsyncSelect
                cacheOptions
                style={{ marginTop: hp(3) }}
                loadOptions={loadOptions}
                defaultOptions
                onInputChange={(selectedOption: any) =>
                  getUserData(selectedOption)
                }
                onChange={(selectedOption) => console.log(selectedOption)}
              /> */}
              <View style={{ padding: 10 }}>
                <AsyncSelect
                  styles={CustomStyle}
                  cacheOptions
                  defaultOptions={[]}
                  loadOptions={callAddData}
                  isMulti
                  onChange={(selectedOption: any) =>
                    setSelectedOption(selectedOption)
                  }
                  // closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      text: "#3599B8",
                      font: "#3599B8",
                      primary25: "#3599B8",
                      primary: "#3599B8",
                      neutral80: "black",
                      color: "black",
                    },
                  })}
                />
              </View>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    width: wp(100) < 425 ? wp(30) : wp(6),
                    marginLeft: wp(1),
                    marginTop: hp(2),
                    backgroundColor: colors.primary,
                    borderRadius: 10,
                    padding: 10,
                    height: 40,
                  }}
                  onPress={() => {
                    ShareMember();
                  }}
                >
                  <Text style={{ color: "#fff", alignSelf: "center" }}>
                    Share
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    width: wp(100) < 425 ? wp(30) : wp(6),
                    marginLeft: wp(1),
                    marginTop: hp(2),
                    backgroundColor: "black",
                    borderRadius: 10,
                    padding: 10,
                    height: 40,
                  }}
                  onPress={() => {
                    setSharePull(!sharePull);
                  }}
                >
                  <Text style={{ color: "#fff", marginLeft: wp(1) }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>

              {/* </View> */}
            </SharePop>

            {selected_tab == "Members" && (
              <View>
                <DataTable style={{ marginLeft: wp(0.5), width: "96%" }}>
                  <DataTable.Header>
                    <DataTable.Title style={{ flex: 2 }}>
                      <Text style={styles.tableHead}>Member name</Text>
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 2 }}>
                      <Text style={styles.tableHead}>Email</Text>
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 2 }}>
                      <Text style={styles.tableHead}>Mobile Number</Text>
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 2 }}>
                      <Text style={styles.tableHead}>Member_Since</Text>
                    </DataTable.Title>
                  </DataTable.Header>
                  {data?.members?.data?.map((elem1: any, key: any) => {
                    return (
                      <DataTable.Row>
                        <DataTable.Cell style={{ flex: 2 }}>
                          <Text style={styles.tableHead}>{elem1.ame}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={{ flex: 2 }}>
                          <Text style={styles.tableHead}>{elem1.email}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={{ flex: 2 }}>
                          <Text style={styles.tableHead}>{elem1.mobile}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={{ flex: 2 }}>
                          <Text style={styles.tableHead}>
                            {elem1.member_since}
                          </Text>
                        </DataTable.Cell>
                      </DataTable.Row>
                    );
                  })}
                </DataTable>
              </View>
            )}
            <Pushup modalVisible={visiblePull}>
              <View
                style={{
                  padding: 20,
                  gap: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "700" }}>
                  {" "}
                  You Can Add a New Member !
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setVisiblePull(!visiblePull);
                  }}
                >
                  <Entypo name="cross" size={24} color="black" />
                </TouchableOpacity>
              </View>
              {/* <View style={{ width: "60%", marginTop: 30, paddingLeft: 5 }}> */}
              <AsyncSelect
                styles={CustomStyle}
                cacheOptions
                defaultOptions={[]}
                loadOptions={callAddData}
                isMulti
                onChange={(selectedOption: any) =>
                  setSelectedOption(selectedOption)
                }
                hideSelectedOptions={false}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 5,
                  colors: {
                    ...theme.colors,
                    text: "#3599B8",
                    font: "#3599B8",
                    primary25: "#3599B8",
                    primary: "#3599B8",
                    neutral80: "black",
                    color: "black",
                  },
                })}
              />
              {/* </View> */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 20,
                  alignSelf: "flex-end",
                  // borderWidth: 1,
                  // width: wp(15),
                }}
              >
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: hp(4),
                    backgroundColor: colors.primary,
                    borderRadius: 7,
                    paddingHorizontal: 20,
                    paddingVertical: 7,
                  }}
                  onPress={() => {
                    addMember();
                  }}
                >
                  <Text style={{ color: "#fff" }}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: hp(4),
                    backgroundColor: "black",
                    borderRadius: 7,
                    paddingHorizontal: 20,
                    paddingVertical: 7,
                  }}
                  onPress={() => {
                    setVisiblePull(!visiblePull);
                  }}
                >
                  <Text style={{ color: "#fff" }}>Close</Text>
                </TouchableOpacity>
              </View>
            </Pushup>
          </ScrollView>
        )}
        {/* -------------------- Mobile view ---------------------------------- */}
        {wp(100) <= 425 && (
          <ScrollView
            style={{ width: wp(90), height: hp(100), marginLeft: 15 }}
          >
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                marginTop: 20,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  width: wp(100) <= 768 ? "40%" : "5%",
                  marginLeft: "2%",
                  marginTop: hp(2),
                }}
              >
                <Text style={{ fontSize: 30, fontWeight: "700" }}>
                  {data?.name}
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  marginLeft: wp(100) <= 500 ? wp(20) : wp(38),
                  margin: 10,
                  borderWidth: 1,
                  paddingHorizontal: 10,
                  paddingVertical: 7,
                  borderRadius: 7,
                  backgroundColor: "#000",
                }}
                onPress={() => {
                  setVisiblePull(true);
                }}
              >
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  Add members
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row", marginTop: hp(2) }}>
              <TouchableOpacity
                style={{ margin: 10 }}
                onPress={() => {
                  setselected_tab("Tanzabooks");
                }}
              >
                <Text
                  style={
                    selected_tab == "Tanzabooks"
                      ? {
                          // textDecorationLine: "underline",
                          fontWeight: "600",
                          textDecorationColor: colors.primary,
                          color: "white",
                          backgroundColor: colors.primary,
                          fontSize: 20,
                          borderRadius: 5,
                          fontFamily: "lato",
                          padding: 10,
                        }
                      : {
                          fontSize: 20,
                          padding: 10,
                        }
                  }
                >
                  Tanzabooks
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginLeft: 10, margin: 10 }}
                onPress={() => {
                  setselected_tab("Members");
                }}
              >
                <Text
                  style={
                    selected_tab == "Members"
                      ? {
                          // textDecorationLine: "underline",
                          fontWeight: "600",
                          textDecorationColor: colors.primary,
                          color: "white",
                          backgroundColor: colors.primary,
                          fontSize: 20,
                          borderRadius: 10,
                          padding: 10,
                        }
                      : {
                          fontSize: 20,
                          padding: 10,
                        }
                  }
                >
                  Members
                </Text>
              </TouchableOpacity>
            </View>

            {selected_tab == "Tanzabooks" && (
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {/* Lesson boxes */}
                {/* {data?.map((elem1: any, key: any) => {
        return ( */}
                {/* <View style={styles.box1}>
                  <View style={styles.img}></View>

                  <TouchableOpacity
                    style={{ marginLeft: wp(1), marginTop: hp(1) }}
                    onPress={() => navigation.navigate("Viewer")}
                  >
                    <Text style={styles.title1}> {data?.name}</Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      marginTop: hp(6),
                      // marginLeft: wp(-38),
                    }}
                  >
                    <TouchableOpacity
                      style={{ flexDirection: "row", marginTop: hp(6) }}
                      onPress={() => {
                        setSharePull(true);
                      }}
                    >
                      <Image
                        source={require("../assets/Group 3135.png")}
                        style={{ width: 20, height: 20 }}
                      />
                      <Text style={{ marginLeft: wp(0.4) }}>Share</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{ flexDirection: "row", marginTop: hp(6) }}
                      onPress={() => setMove(true)}
                    >
                      <Image
                        source={require("../assets/Group 3136.png")}
                        style={{ width: 20, height: 20 }}
                      />
                      <Text style={{ marginLeft: wp(0.4) }}>Move</Text>
                    </TouchableOpacity>
                  </View>
                </View> */}
                <Text>No data Found</Text>
              </View>
            )}

            <MoveUp modalVisible={move}>
              {/* <View style={{ flexDirection: "row" }}>
                <TextInput
                  label="Move to Folder name"
                  mode="outlined"
                  value={drop}
                  onChangeText={(drop) => selectDrop(drop)}
                  outlineColor={colors.primary}
                  activeOutlineColor={colors.primary}
                  style={{
                    // marginLeft: wp(1),
                    width: wp(100) <= 500 ? wp(40) : wp(20),
                    marginTop: hp(4),
                    height: 40,
                    backGroundColor: "#fff",
                  }}
                  theme={{ roundness: 10 }}
                  autoComplete={false}
                />
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    width: wp(10),
                    marginLeft: wp(1.5),
                    marginTop: hp(4),
                    backgroundColor: colors.primary,
                    borderRadius: 20,
                    padding: 4,
                  }}
                  // onPress={() => {
                  //   ShareMember();
                  // }}
                >
                  <Text style={{ color: "#fff", marginLeft: wp(2) }}>Move</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    width: wp(10),
                    marginLeft: wp(2),
                    marginTop: hp(4),
                    backgroundColor: "black",
                    borderRadius: 20,
                    padding: 10,
                  }}
                  onPress={() => {
                    setMove(!move);
                  }}
                >
                  <Text style={{ color: "#fff", marginLeft: wp(1) }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View> */}

              {/* modified with removing input tag to select game */}
              <View
                style={{
                  flexDirection: "row",
                  // width: wp(30),
                  // alignItems: "center",
                  marginLeft: wp(1),
                }}
              >
                {/* <TextInput
                  label="Move to Folder name"
                  mode="outlined"
                  value={drop}
                  onChangeText={(drop) => selectDrop(drop)}
                  outlineColor={colors.primary}
                  activeOutlineColor={colors.primary}
                  style={{
                    marginLeft: wp(1),
                    width: wp(100) <= 426 ? wp(5) : wp(20),
                    marginTop: hp(4),
                    height: 40,
                  }}
                  theme={{ roundness: 10 }}
                  autoComplete={false}
                /> */}
                <select
                  style={{
                    padding: 10,
                    // marginTop: hp(4),
                    width: wp(45),
                    borderRadius: 10,
                  }}
                  onChange={(e) => {
                    setAllFolder_id(e.target.value);
                    console.log(e.target.value);
                  }}
                >
                  <option value="">Select One</option>
                  {list?.map((x: any) => {
                    return <option value={x.id}>{x.folder_name}</option>;
                  })}
                </select>
                <View style={{ flexDirection: wp(100) <= 426 ? "row" : "row" }}>
                  <TouchableOpacity
                    style={{
                      justifyContent: "space-between",
                      width: wp(15),
                      marginLeft: wp(1),
                      // marginTop: hp(4),
                      backgroundColor: colors.primary,
                      borderRadius: 10,
                      padding: 10,
                      height: 40,
                    }}
                    // onPress={() => {
                    //   ShareMember();
                    // }}
                  >
                    <Text style={{ color: "#fff", alignSelf: "center" }}>
                      Move
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: wp(15),
                      marginLeft: wp(1),
                      // marginTop: hp(4),
                      backgroundColor: "black",
                      borderRadius: 10,
                      padding: 10,
                      height: 40,
                    }}
                    onPress={() => {
                      setMove(!move);
                    }}
                  >
                    <Text style={{ color: "#fff", alignSelf: "center" }}>
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* </View> */}
            </MoveUp>

            <SharePop modalVisible={sharePull}>
              <View style={{ padding: 10 }}>
                <AsyncSelect
                  styles={CustomStyle}
                  cacheOptions
                  defaultOptions={[]}
                  loadOptions={callAddData}
                  isMulti
                  onChange={(selectedOption: any) =>
                    setSelectedOption(selectedOption)
                  }
                  // closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      text: "#3599B8",
                      font: "#3599B8",
                      primary25: "#3599B8",
                      primary: "#3599B8",
                      neutral80: "black",
                      color: "black",
                    },
                  })}
                />
              </View>
              <View style={{ flexDirection: "row", marginLeft: 3 }}>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    width: wp(100) <= 426 ? "25%" : "15%",
                    marginLeft: wp(1),
                    marginTop: hp(1),
                    backgroundColor: colors.primary,
                    borderRadius: 10,
                    padding: 10,
                    height: 40,
                  }}
                  onPress={() => {
                    ShareMember();
                  }}
                >
                  <Text style={{ color: "#fff", alignSelf: "center" }}>
                    Share
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    width: wp(100) <= 426 ? "28%" : "15%",
                    marginLeft: wp(2),
                    marginTop: hp(1),
                    backgroundColor: "black",
                    borderRadius: 10,
                    padding: 10,
                    height: 40,
                  }}
                  onPress={() => {
                    setSharePull(!sharePull);
                  }}
                >
                  <Text style={{ color: "#fff", alignSelf: "center" }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </SharePop>

            {selected_tab == "Members" && (
              <ScrollView>
                <View style={{ height: wp(120), marginLeft: wp(10) }}>
                  <Card
                    style={{
                      width: "fit-content",
                      marginTop: wp(10),
                      marginLeft: wp(2),
                    }}
                  >
                    {data?.members?.data?.map((elem1: any, key: any) => {
                      return (
                        <View style={{ marginBottom: 10 }}>
                          <Text style={{ marginBottom: hp, fontWeight: "400" }}>
                            <Text style={[styles.headText, { marginLeft: -4 }]}>
                              {" "}
                              Member name -
                            </Text>{" "}
                            {elem1.ame}
                          </Text>
                          <Text style={{ marginBottom: hp, fontWeight: "400" }}>
                            <Text style={styles.headText}>Email - </Text>
                            {elem1.email}
                          </Text>
                          <Text style={{ marginBottom: hp, fontWeight: "400" }}>
                            <Text style={styles.headText}>Mobile - </Text>
                            {elem1.mobile}
                          </Text>
                          <Text style={{ marginBottom: hp, fontWeight: "400" }}>
                            <Text style={styles.headText}>Member_Since -</Text>{" "}
                            {elem1.member_since}
                          </Text>
                          <View style={{ marginVertical: wp(3) }}>
                            <Divider />
                          </View>
                        </View>
                      );
                    })}
                  </Card>
                </View>
              </ScrollView>
            )}

            <Pushup modalVisible={visiblePull}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "700" }}>
                  You Can Add a New Member !
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setVisiblePull(!visiblePull);
                  }}
                >
                  <Entypo name="cross" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <View style={{ width: "80%", marginTop: 30, paddingLeft: 5 }}>
                <AsyncSelect
                  styles={CustomStyle}
                  cacheOptions
                  defaultOptions={[]}
                  loadOptions={callAddData}
                  isMulti
                  onChange={(selectedOption: any) =>
                    setSelectedOption(selectedOption)
                  }
                  // closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      text: "#3599B8",
                      font: "#3599B8",
                      primary25: "#3599B8",
                      primary: "#3599B8",
                      neutral80: "black",
                      color: "black",
                    },
                  })}
                />
              </View>
              <View
                style={{
                  flexDirection: wp(100) < 425 ? "column" : "row",
                  gap: wp(100) < 425 ? 10 : 20,
                  alignSelf: "flex-end",
                  // borderWidth: 1,
                  width: wp(100) < 425 ? wp(20) : wp(15),
                }}
              >
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: hp(4),
                    backgroundColor: colors.primary,
                    borderRadius: 7,
                    paddingHorizontal: wp(100) < 425 ? 10 : 20,
                    // marginLeft: wp(100) < 425 ? "" : "",
                    paddingVertical: 7,
                  }}
                  onPress={() => {
                    addMember();
                  }}
                >
                  <Text style={{ color: "#fff" }}>Save</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    // marginTop: hp(4),
                    backgroundColor: "black",
                    borderRadius: 7,
                    paddingHorizontal: wp(100) < 425 ? 10 : 20,
                    paddingVertical: 7,
                  }}
                  onPress={() => {
                    setVisiblePull(!visiblePull);
                  }}
                >
                  <Text style={{ color: "#fff" }}>Close</Text>
                </TouchableOpacity> */}
              </View>

              {/* </View> */}
            </Pushup>
          </ScrollView>
          // </>
        )}
      </>

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

          {/* <select
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
              return <option value={x.id}>{x.folder_name}</option>;
            })}
          </select> */}

          <View
            style={{
              padding: 12,
              marginTop: hp(4),
              width: wp(100) <= 500 ? "85%" : "60%",
              // height: 35,
              borderRadius: 10,
              // marginLeft: wp(1),
              borderWidth: 1,
            }}
          >
            <Text
              style={{ fontFamily: "Lato", fontWeight: "800", fontSize: 16 }}
            >
              {data?.name}
              {/* Mahindra */}
            </Text>
          </View>

          <View
            style={{
              flexDirection: wp(100) <= 768 ? "column" : "row",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: wp(100) <= 426 ? wp(-14) : wp(0),
            }}
          ></View>
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
              marginTop: 10,
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
            <Pane maxWidth={300}>
              <FileUploader
                label="Upload File"
                description="Takes only jpg and pdf files."
                maxSizeInBytes={50 * 1024 ** 2}
                maxFiles={1}
                onChange={handleChange}
                renderFile={(file) => {
                  const { name, size, type } = file;
                  return (
                    <FileCard
                      key={name}
                      name={name}
                      onRemove={handleRemove}
                      sizeInBytes={size}
                      type={type}
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
                  Create
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflowX: "hidden",
    flexDirection: "row",
  },
  box: {
    FlexDirection: "row",
    flexWrap: "wrap",
    marginTop: 50,
    marginLeft: wp(2),
    marginBottom: -5,

    width: wp(20),
    height: wp(10),

    borderRadius: 9,
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "#fff",
    zIndex: -99999,
  },
  box1: {
    FlexDirection: "row",
    flexWrap: "wrap",
    marginTop: 50,
    marginLeft: wp(10),
    marginBottom: -5,
    width: wp(100) < 425 ? wp(70) : wp(54),
    height: wp(100) < 425 ? hp(25) : hp(15),
    borderRadius: 9,
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "#fff",
    zIndex: -99999,
  },

  title1: {
    fontSize: 14,
    fontWeight: "bold",
  },
  subtitle1: {
    fontSize: 11,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 11,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderRadius: 10,
    // borderWidth:1,
  },
  pencil: {
    position: "relative",
    left: 20,
    top: 10,
  },
  textSet: {
    position: "absolute",
    // bottom: 10,
    left: 10,
  },
  img: {
    position: "absolute",
    right: 18,
  },
  headText: {
    width: 100,
    fontSize: 15,
    fontWeight: "bold",
    // borderWidth: 1,
  },
  tableHead: {
    fontSize: 15,
    fontWeight: "500",
    color: "black",
  },
});

export default GroupView;
