import * as Sentry from "@sentry/browser";
import * as React from "react";
import { DataTable, Searchbar, TextInput } from "react-native-paper";
import { Icon } from "react-native-elements";

import {
  StyleSheet,
  Button,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput as Input,
  Pressable,
  TouchableWithoutFeedback,
  Modal,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import Hoverable from "../components/Hoverable";
import { FontAwesome5 } from "@expo/vector-icons";
import { Pane, FileUploader, FileCard } from "evergreen-ui";

import { Avatar, colors } from "react-native-elements";
import Navbar from "../components/Navbar";
import { hp, scale, wp } from "../utils";
import Popup from "../components/Popup";
import Card from "../components/Card";
import SharePop from "../components/SharePop";
import MoveUp from "../components/MoveUp";
import RenamePop from "../components/RenamePop";

import { Popover } from "react-native-popable";
import { Image } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { API_BASE_URL, NETWORK_URL } from "../utils/config";
import api from "../utils/api";
import { useSelector } from "react-redux";
import { RootState } from "../reduxStore/store";
import { navigationRef } from "../utils/RootNavigation";
import Viewer from "./Viewer";
import { BriefcaseIcon } from "evergreen-ui";
import AsyncSelect from "react-select/async";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import PublishPop from "../components/PublishPop";
import { SimpleLineIcons } from "@expo/vector-icons";
import { DeleteModal } from "../components/DeleteModal";
import DeletePop from "../components/Deletepop";

const optionsPerPage = [2, 3, 4];
const Briefcase = ({ navigation }: any) => {
  // React.useEffect(() => {
  //   window.location.reload();
  // }, []);
  const user = useSelector((state: RootState) => state.userReducer);
  const [page, setPage] = React.useState<number>(0);
  const [ApiData, setApiData] = React.useState<any>([]);
  const [renamePop, setRenamePop] = React.useState(false);
  const [deletePop, setDeletePop] = React.useState(false);
  const [publishPop, setPublishPop] = React.useState(false);
  const [visiblePop, setVisiblePop] = React.useState(false);
  const [model, setModel] = React.useState(false);
  const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]);
  const [filteredData, setFilteredData] = React.useState("");

  const [title, setTitle] = React.useState("");
  const [files, setFiles] = React.useState([]);

  const [setFolder_id, setAllFolder_id] = React.useState("");
  const [list, setList] = React.useState<any>([]);

  const [editModal, setEditModal] = React.useState(false);
  const [pop, setPop] = React.useState("");
  const [body, setBody] = React.useState("");
  const [r_name, setR_name] = React.useState();
  const [file_name, setFile_name] = React.useState("");
  const handleChange = React.useCallback((files) => {
    const file = files[0];
    if (file) {
      setFiles([file]);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const handleRemove = React.useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    setFiles([]);
  }, [previewUrl]);

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const [data, setData] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [visiblePull, setVisiblePull] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState("");
  const [books, setBooks] = React.useState("");
  const [tanza, show_Tanza] = React.useState("");
  const [selectedUserData, setSelectedUserData] = React.useState<any>([]);
  const [tanza_id, setTanza_id] = React.useState();
  const [sharePull, setSharePull] = React.useState(false);
  const [move, setMove] = React.useState(false);
  const [drop, selectDrop] = React.useState();
  const [loadOptionsData, setLoadOptionsData] = React.useState<any>([]);
  const [selectedOption, setSelectedOption] = React.useState<any>({});
  const [showOptions, setShowOptions] = React.useState<any>(false);
  const [optionId, setOptionId] = React.useState<any>("");
  // console.log('folder_id,',folder_id)
  const folder_id = localStorage.getItem("folderId");
  const folder_name = localStorage.getItem("folderName");
  const [hover, setHover] = React.useState("");
  const [createLoad, setCreateLoad] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  console.log("folder_id", folder_id);

  const getFolderWithId = () => {
    api
      .get(`${NETWORK_URL}/folder/${folder_id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setData(response.data.data);

        setLoading(true);
        // console.log(JSON.stringify(response.data));
        // console.log(response.data.data.length);
      })
      .catch(function (error: any) {
        // setError(error.response.data.error);
        Sentry.captureException(error);
      });
  };
  React.useEffect(() => {
    getFolderWithId();
  }, []);

  const handleRemove = React.useCallback(() => {
    setFiles([]);
  }, []);
  const handlePress = () => false;

  const getUserData = (data: any) => {
    if (data.length > 2) {
      api
        .get(`${NETWORK_URL}/user?q=${data}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setLoadOptionsData(response.data.data);

          // setLoadOptionsData([{}]);
        })
        .catch(function (error: any) {
          console.log(error);
          Sentry.captureException(error);
        });
    }
  };

  const createTanza = async () => {
    if (file_name.trim() !== "" && files.length > 0) {
      try {
        setCreateLoad(true);
        const token = localStorage.getItem("tbzToken");

        // --- STEP 1: CREATE FOLDER ---
        console.log("Step 1: Creating Brief Folder - Request Payload:", { name: file_name.trim() });
        const folderResponse = await fetch(`${NETWORK_URL}/brief-folder`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({ name: file_name.trim() }),
        });

        let folderData;
        try {
          folderData = await folderResponse.json();
          console.log("Step 1 Response:", folderData);
        } catch (e) {
          console.error("Critical: Failed to parse folder creation response", e);
          throw new Error("Invalid folder creation response from server");
        }

        if (!folderResponse.ok || folderData.success === false) {
          console.error("Folder creation failed:", folderData);
          throw new Error(folderData.message || "Folder creation failed");
        }

        const newFolderId = folderData.data?.id;
        console.log("Step 1 Success: Folder ID =", newFolderId);

        // --- STEP 2: UPLOAD FILE ---
        const formData = new FormData();
        formData.append("name", file_name.trim());
        formData.append("description", "");
        formData.append("folder_id", String(newFolderId));
        formData.append("file", files[0]);
        formData.append("type", "file");

        console.log("Step 2: Uploading File - FormData Payload:", {
          name: file_name.trim(),
          folder_id: newFolderId,
          file: files[0]?.name,
          type: "file"
        });

        const res = await fetch(`${NETWORK_URL}/tanzabooks`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          }
        });
        
        let data;
        try {
          data = await res.json();
          console.log("Step 2 Response:", data);
        } catch (e) {
          console.error("Critical: Failed to parse upload response", e);
          throw new Error("Invalid upload response from server");
        }

        if (!res.ok || data.success === false) {
          console.error("Tanzabook upload failed:", data);
          throw new Error(data.message || "Upload failed");
        }

        console.log("Full Sequential Creation Success:", data);
        localStorage.setItem("tanzabook_id", data.data?.folder_id || data.data?.id);
        
        // Reset states
        setVisiblePop(false);
        handleRemove(); // ensure files array clears
        setFile_name("");
        getFolderWithId();
        getFolders();
        alert("Tanzabook Created Successfully");
      } catch (err: any) {
        console.error("CREATE TANZABOOK ERROR:", err);
        alert(err.message || "Sequential creation failed");
      } finally {
        setCreateLoad(false);
      }
    } else {
      alert("Please provide both a name and a file");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getFolders();
      localStorage.removeItem("pdfurl");
    }, [])
  );

  const getFolders = () => {
    api
      .get(`${NETWORK_URL}/user/folders`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("response", response);
        setLoading(true);
        // Normalize folders from the new API if necessary
        const folders = response.data.data.data.map((f: any) => ({
          ...f,
          folder_name: f.name || f.folder_name,
          createdAt: f.created_at || f.createdAt,
        }));
        setList(folders);
      })
      .catch(function (error: any) {
        console.log(error);
        Sentry.captureException(error);
      });
  };

  const createBriefFolder = async () => {
    if (pop === "") {
      alert("Please enter the name of folder");
      return;
    }
    try {
      setCreateLoad(true);
      const res = await api.post(`${NETWORK_URL}/brief-folder`, {
        name: pop,
      });

      console.log("Folder Creation Response:", res.data);

      if (res.data && (res.data.success === true || res.data.id)) {
        setPop("");
        setVisiblePull(false);
        getFolders(); // Refresh list
        alert("Folder Created Successfully");
      } else {
        alert(res.data?.message || "Folder creation failed");
      }
    } catch (err: any) {
      console.error("Folder Creation Error:", err.response?.data || err);
      alert(err.response?.data?.message || "Folder creation failed");
    } finally {
      setCreateLoad(false);
    }
  };

  const ShareMember = () => {
    api({
      method: "post",
      url: `${NETWORK_URL}/tanzabook/share`,
      data: {
        tanzabook_id: tanza_id,
        invite_user: selectedUserData.map((x: any) => {
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
        console.log(response);
        setSharePull(false);
        alert(response?.data?.message);
      })
      .catch(function (error: any) {
        console.log(error);
        Sentry.captureException(error);
      });
    console.log({
      tanzabook_id: tanza_id,
      invite_user: selectedUserData.map((x: any) => {
        return {
          user_id: x.value,
        };
      }),
    });
  };

  const moveFolder = () => {
    console.log("tanza_id", tanza_id);
    api({
      method: "post",
      url: `${NETWORK_URL}/tanzabook/move`,

      data: {
        tanzabook_id: tanza_id,
        // modifications
        // folder_id: setFolder_id,
        folder_id: folder_id, // sending folder which is coming from the localStorage instead of setFolder_id
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        console.log("Tanzabook Moved");
        getFolderWithId();
        getFolders();
        setMove(!move);
      })
      .catch(function (error: any) {
        console.log(error.response);
        setMove(!move);
        Sentry.captureException(error);
      });
  };

  const deleteTanzabook = (id: any) => {
    console.log("tanza_id", id);
    // alert("You are deleting your Tanzabook");
    setDeleting(true);
    api({
      method: "delete",
      url: `${NETWORK_URL}/tanzabook/${tanza_id}`,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        setDeleting(false);
        setDeletePop(false);
        console.log("Tanzabook Deleted");
        getFolderWithId();
        getFolders();
      })
      .catch(function (error: any) {
        console.log(error.response);
        Sentry.captureException(error);
      });
  };

  function renameTanza(id: any) {
    console.log("Renaming tanzabook..." + tanza_id + "<<");
    api({
      method: "patch",
      url: `${NETWORK_URL}/tanzabook/` + tanza_id,
      data: {
        name: r_name,
      },

      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(" Tanzabook Renamed Successfully");
        getFolderWithId();
        getFolders();
        setRenamePop(!renamePop);
      })
      .catch(function (error: any) {
        console.log(error);
        setRenamePop(!renamePop);
        Sentry.captureException(error);
      });
  }

  const loadOptions = (inputValue: string, callback: (options: []) => void) => {
    callback(
      loadOptionsData?.map((peers: any, index: any) => {
        return { value: peers.id, label: peers.email };
      })
    );
  };

  const handleFolderId = (id: any) => {
    console.log("hanldeId", id);
    localStorage.setItem("tanzabook_id", id);
    navigation.navigate("Viewer");
  };

  const callAddData = (searchText: any) => {
    console.log(searchText);
    return api
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

  const CustomStyle = {
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "black" : "gray",
    }),
  };

  return (
    <View
      onClick={() => setShowOptions(false)}
      style={{
        width: wp(100) <= 426 ? "" : Dimensions.get("window").width - 20,
        height: Dimensions.get("window").height,
      }}
    >
      <View style={styles.container}>
        <View>
          <Navbar />
        </View>
        <View style={styles.contentDiv}>
          <View style={styles.headerDiv}>
            <View>
              <Text style={styles.headertext}>{folder_name}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  marginRight: wp(1),
                  width: wp(100) < 425 ? hp(20) : wp(10),
                  borderRadius: 7,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  setVisiblePull(true);
                  setShowOptions(false);
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    paddingVertical: 7,
                    fontSize: 12,
                    fontWeight: "750",
                    color: "white",
                  }}
                >
                  Create Folder
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.black,
                  marginRight: wp(100) < 425 ? wp(2) : wp(2),
                  width: wp(100) < 425 ? hp(20) : wp(10),
                  borderRadius: 7,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  setVisiblePop(!visiblePop);
                  setShowOptions(false);
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    // paddingHorizontal:8,
                    paddingVertical: 7,
                    fontSize: 12,
                    fontWeight: "750",
                    color: "white",
                  }}
                >
                  Create Tanzabook
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {loading ? (
            <View
              style={{
                flexDirection: wp(100) <= 768 ? "column" : "row",
                overflow: wp(100) <= 426 ? "scroll" : "",
                flexWrap: "wrap",
                gap: wp(100) < 425 ? 20 : wp(2),
                justifyContent: wp(100) < 425 ? "" : "flex-start",
                alignItems: "center",
                width: "100%",
                marginTop: wp(100) <= 426 ? hp(2) : "5%",
                marginBottom: wp(100) <= 426 ? hp(2) : hp(5),
              }}
            >
              {data?.tanzabooks?.data?.length > 0 ? (
                data?.tanzabooks?.data?.map((elem1: any, key: any) => {
                  return (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          handleFolderId(elem1.id);
                          setShowOptions(false);
                        }}
                        style={[
                          {
                            PaddingBottom: 10,
                            backgroundColor:
                              optionId == elem1.id && showOptions
                                ? ""
                                : "#ffff",
                          },
                          styles.cardBox,
                          { zIndex: optionId == elem1.id ? 999 : 0 },
                        ]}
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
                          <View
                          // style={{ marginTop: wp(1) }}
                          >
                            <Text
                              numberOfLines={1}
                              style={{
                                fontSize: 14,
                                fontWeight: "bold",
                                overflow: "hidden",
                                width: wp(100) <= 426 ? wp(25) : wp(9),
                              }}
                            >
                              {elem1.name}
                            </Text>
                          </View>
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
                                  marginTop: 5,
                                }}
                              >
                                {elem1.createdAt}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={{ zIndex: 2 }}>
                          <TouchableOpacity
                            style={{ zIndex: 999 }}
                            onPress={() => {
                              setShowOptions(!showOptions);
                              setOptionId(elem1.id);
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
                          {optionId == elem1.id && showOptions ? (
                            <View
                              style={[styles.displayOptions, { zIndex: 100 }]}
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
                                          }
                                        : {
                                            flexDirection: "row",
                                            justifyContent: "space-around",
                                          }
                                    }
                                    onPress={() => {
                                      setShowOptions(false);
                                      setRenamePop(true);
                                      setTanza_id(elem1.id);
                                      setHover("");
                                      setR_name("");
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
                                    setHover("View");
                                  }}
                                  onHoverOut={() => {
                                    setHover("");
                                  }}
                                >
                                  <TouchableOpacity
                                    style={
                                      hover == "View"
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
                                      handleFolderId(elem1.id);
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
                                {/* <Pressable
                                onHoverIn={() => {
                                  setHover("publish");
                                }}
                                onHoverOut={() => {
                                  setHover("");
                                }}
                              >
                                <TouchableOpacity
                                  style={
                                    hover == "publish"
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
                                    setPublishPop(true);
                                    setShowOptions(false);
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontWeight: "400",
                                      fontSize: 16,
                                      width: wp(100) <= 426 ? wp(20) : wp(5),
                                    }}
                                  >
                                    Publish
                                  </Text>
                                </TouchableOpacity>
                              </Pressable> */}
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
                                            marginTop: wp(100) <= 426 ? 7 : 4,
                                            display:
                                              wp(100) <= 426 ? "none" : "flex",
                                          }
                                        : {
                                            flexDirection: "row",
                                            justifyContent: "space-around",
                                            marginTop: wp(100) <= 426 ? 7 : 4,
                                            display:
                                              wp(100) <= 426 ? "none" : "flex",
                                          }
                                    }
                                    onPress={() => {
                                      setShowOptions(false);
                                      setSharePull(true);
                                      setTanza_id(elem1.id);
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
                                            marginTop: wp(100) <= 426 ? 7 : 4,
                                          }
                                        : {
                                            flexDirection: "row",
                                            justifyContent: "space-around",
                                            marginTop: wp(100) <= 426 ? 7 : 4,
                                          }
                                    }
                                    onPress={() => {
                                      // setTanza_id(elem1.id); // here we are setting tanzabook id
                                      // deleteTanzabook(elem1.id);
                                      setShowOptions(false);
                                      setTanza_id(elem1.id);
                                      setHover("");
                                      setDeletePop(true);
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
                          <TouchableOpacity
                            style={{
                              display: wp(100) <= 426 ? "block" : "none",
                              marginTop: 20,
                              marginLeft: 5,
                            }}
                            onPress={() => {
                              setShowOptions(false);
                              setSharePull(true);
                              setTanza_id(elem1.id);
                            }}
                          >
                            <EvilIcons
                              name="share-google"
                              size={28}
                              color="#2f75e8"
                            />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    </>
                  );
                })
              ) : data?.tanzabooks?.data?.length === 0 ? (
                <>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 14, fontFamily: "lato" }}>
                      No Data Found
                    </Text>
                  </View>
                </>
              ) : null}
            </View>
          ) : (
            <ActivityIndicator
              color="green"
              size="large"
              style={{
                marginLeft: wp(100) < 425 ? wp(7) : wp(-10),
                marginTop: wp(100) < 425 ? 25 : "",
              }}
            />
          )}
        </View>
      </View>

      <Popup modalVisible={visiblePop}>
        <View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                marginTop: hp(5),
                fontFamily: "Lato",
                fontWeight: "800",
                fontSize: 16,
                marginLeft: wp(1.2),
              }}
            >
              Create
            </Text>
            <TouchableOpacity
              onPress={() => {
                setVisiblePop(!visiblePop);
              }}
            >
              <Text style={{ fontWeight: "800", fontFamily: "sans-serif" }}>
                <Entypo name="cross" size={24} color="black" />
              </Text>
            </TouchableOpacity>
          </View>
          {/* modifications  created view by commenting select tag*/}
          <View
            style={{
              padding: 10,
              marginTop: hp(4),
              width: wp(100) <= 500 ? "80%" : "50%",
              height: 35,
              borderRadius: 10,
              marginLeft: wp(1),
              borderWidth: 1,
            }}
          >
            <Text
              style={{ fontFamily: "Lato", fontWeight: "800", fontSize: 16 }}
            >
              {folder_name}
            </Text>
          </View>
          <View
            style={{
              width: wp(100) <= 768 ? "89 %" : "50%",
              flexDirection: wp(100) <= 768 ? "column" : "row",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: wp(100) <= 768 ? wp(8) : wp(1),
            }}
          >
            <Input
              placeholder="Name of Tanzabook"
              mode="outlined"
              value={file_name}
              onChangeText={(file_name) => setFile_name(file_name)}
              outlineColor={colors.primary}
              activeOutlineColor={colors.primary}
              style={{
                marginTop: hp(1),
                width: wp(100) <= 390 ? "90%" : "100%",
                height: 35,
                marginLeft: wp(100) <= 390 ? wp(-20) : "",
                borderWidth: 2,
                borderRadius: 10,
                borderColor: colors.primary,
                padding: 10,
                outlineStyle: "none",
              }}
              theme={{ roundness: 10 }}
              autoComplete={false}
            />
          </View>

          <View
            style={{
              justifyContent: "flex-start",
              padding: 4,
              marginTop: hp(2),
              marginLeft: wp(1),
            }}
          >
            {/* <input type="file" id="avatar" name="avatar" accept="pdf" /> */}

            <Pane maxWidth={500}>
              <FileUploader
                acceptedMimeTypes={["application/pdf", "image/jpeg", "image/png"]}
                label="Upload File"
                description="Takes jpg, png and pdf files."
                maxSizeInBytes={50 * 1024 ** 2}
                maxFiles={1}
                onChange={handleChange}
                renderFile={(file) => {
                  const { name, size, type } = file;
                  const isPDF = type === "application/pdf";
                  return (
                    <View
                      key={name}
                      style={{
                        marginTop: 10,
                        borderWidth: 1,
                        borderColor: "#E6E8F0",
                        borderRadius: 8,
                        padding: 10,
                        backgroundColor: "#F9FAFC",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: previewUrl && !isPDF ? 10 : 0,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            flex: 1,
                          }}
                        >
                          <AntDesign
                            name={isPDF ? "pdffile1" : "picture"}
                            size={24}
                            color={isPDF ? "#D14343" : "#3599B8"}
                          />
                          <View style={{ flex: 1 }}>
                            <Text
                              numberOfLines={1}
                              style={{
                                fontWeight: "600",
                                fontSize: 13,
                                color: "#425A70",
                              }}
                            >
                              {name}
                            </Text>
                            <Text style={{ fontSize: 11, color: "#69778A" }}>
                              {(size / 1024).toFixed(1)} KB
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity onPress={handleRemove}>
                          <Entypo name="cross" size={20} color="#69778A" />
                        </TouchableOpacity>
                      </View>

                      {previewUrl && !isPDF && (
                        <View
                          style={{
                            maxHeight: 180,
                            width: "100%",
                            overflow: "hidden",
                            borderRadius: 4,
                            marginTop: 5,
                            alignItems: "center",
                            backgroundColor: "#EBEDF2",
                          }}
                        >
                          <Image
                            source={{ uri: previewUrl }}
                            style={{
                              width: "100%",
                              height: 180,
                            }}
                            resizeMode="contain"
                          />
                        </View>
                      )}
                      
                      {isPDF && (
                        <View style={{
                          marginTop: 8,
                          padding: 8,
                          backgroundColor: "#f0f2f5",
                          borderRadius: 4,
                          borderStyle: "dashed",
                          borderWidth: 1,
                          borderColor: "#d1d5db",
                          alignItems: "center"
                        }}>
                          <Text style={{ fontSize: 12, color: "#4b5563" }}>
                            PDF Preview Disabled for Stability
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                }}
                values={files}
              />
            </Pane>
          </View>
          <View
            style={{
              alignItems: "flex-end",
              justifyContent: "center",
              width: "90%",
            }}
          >
            <View style={{ flexDirection: "row", gap: 20 }}>
              <TouchableOpacity
                style={{
                  // width: "25%",
                  marginTop: 20,
                  backgroundColor: colors.primary,
                  borderRadius: 6,
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                disabled={createLoad}
                onPress={() => {
                  createTanza();
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    fontFamily: "Lato",
                    color: "white",
                    paddingHorizontal: 15,
                    paddingVertical: 7,
                  }}
                >
                  {createLoad ? "Loading..." : "Create"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  marginTop: 20,
                  backgroundColor: colors.black,
                  borderRadius: 6,
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  // console.log("Modal has been closed.");
                  setVisiblePop(!visiblePop);
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    fontFamily: "Lato",
                    color: "white",
                    paddingHorizontal: 15,
                    paddingVertical: 7,
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
              height: 40,
              padding: 8,
              width: wp(100) <= 426 ? wp(37) : wp(22),
              borderWidth: 2,
              borderColor: colors.primary,
              borderRadius: 10,
              outlineStyle: "none",
            }}
            theme={{ roundness: 10 }}
            onKeyPress={(e: any) => {
              if (e.nativeEvent.key == "Enter" && r_name.length > 0) {
                renameTanza();
              }
            }}
          />

          <TouchableOpacity
            style={{
              justifyContent: "center",
              width: wp(100) <= 426 ? wp(17) : wp(5),
              marginLeft: wp(1),
              marginTop: hp(4),
              backgroundColor: colors.primary,
              borderRadius: 10,
              padding: 8,
            }}
            onPress={() => {
              // setF_ID(elem1.id)
              renameTanza();
            }}
          >
            <Text style={{ color: "#fff", alignSelf: "center" }}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              width: wp(100) <= 426 ? wp(17) : wp(5),
              marginLeft: wp(1),
              marginTop: hp(4),
              backgroundColor: "black",
              borderRadius: 10,
              padding: 8,
            }}
            onPress={() => {
              setRenamePop(!renamePop);
            }}
          >
            <Text style={{ color: "#fff", alignSelf: "center" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </RenamePop>
      <DeletePop modalVisible={deletePop}>
        <View style={{}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "400",
              marginLeft: 30,
              marginTop: 10,
            }}
          >
            You are deleting your Tanzabook!
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginLeft: wp(100) <= 426 ? wp(25) : wp(5),
            }}
          >
            <TouchableOpacity
              style={{
                justifyContent: "center",
                width: wp(100) <= 426 ? wp(17) : wp(5),
                marginLeft: wp(1),
                marginTop: hp(3),
                backgroundColor: colors.primary,
                borderRadius: 5,
                padding: 8,
              }}
              onPress={() => {
                deleteTanzabook();
              }}
            >
              <Text style={{ color: "#fff", alignSelf: "center" }}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                width: wp(100) <= 426 ? wp(17) : wp(5),
                marginLeft: wp(1),
                marginTop: hp(3),
                backgroundColor: "black",
                borderRadius: 5,
                padding: 8,
              }}
              onPress={() => {
                setDeletePop(!deletePop);
              }}
            >
              <Text style={{ color: "#fff", alignSelf: "center" }}>Cancle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </DeletePop>
      <SharePop style={{}} modalVisible={sharePull}>
        <View style={{ padding: 20, gap: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            {" "}
            Do You want to share your Tanzabook ?
          </Text>
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
              borderRadius: 10,
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

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 20,
            }}
          >
            <TouchableOpacity
              style={{
                justifyContent: "center",
                backgroundColor: colors.primary,
                borderRadius: 7,
                paddingHorizontal: 15,
                paddingVertical: 5,
                alignItems: "center",
              }}
              onPress={() => {
                ShareMember();
              }}
            >
              <Text style={{ color: "#fff" }}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                justifyContent: "center",
                // width: wp(100) > 768 ? wp(7) : wp(18),
                borderRadius: 7,
                paddingHorizontal: 15,
                paddingVertical: 5,
                alignItems: "center",
                backgroundColor: "black",
              }}
              onPress={() => {
                setSharePull(!sharePull);
              }}
            >
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SharePop>
      <Popup modalVisible={visiblePull}>
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
              Create Brief Folder
            </Text>
            <TouchableOpacity
              onPress={() => {
                setVisiblePull(false);
              }}
            >
              <Entypo name="cross" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <Input
            placeholder="Enter Folder Name"
            value={pop}
            onChangeText={(text) => setPop(text)}
            style={{
              width: wp(100) <= 500 ? "85%" : "100%",
              padding: 10,
              borderWidth: 2,
              borderColor: colors.primary,
              borderRadius: 10,
              marginTop: 20,
              outlineStyle: "none",
            }}
            theme={{ roundness: 10 }}
            onKeyPress={(e: any) => {
              if (e.nativeEvent.key === "Enter" && pop.length > 0) {
                createBriefFolder();
              }
            }}
          />

          <View style={{ flexDirection: "row-reverse", marginTop: 20, gap: 10 }}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                borderRadius: 7,
                paddingHorizontal: 20,
                paddingVertical: 8,
              }}
              disabled={createLoad}
              onPress={createBriefFolder}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                {createLoad ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "black",
                borderRadius: 7,
                paddingHorizontal: 20,
                paddingVertical: 8,
              }}
              onPress={() => {
                setVisiblePull(false);
                setPop("");
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Popup>
    </View>
  );
};

const styles = StyleSheet.create({
  contentDiv: {
    padding: 15,
    marginLeft: wp(100) <= 426 ? "" : wp(9),
    height: wp(100) <= 426 ? hp(90) : "",
    overflow: wp(100) <= 426 ? "scroll" : "",
  },
  headerDiv: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  headertext: {
    fontSize: 30,
    fontWeight: "700",
  },
  cardBox: {
    flexDirection: "row",
    padding: 15,
    width: wp(100) <= 426 ? wp(82) : wp(20),
    // height: wp(100) <= 426 ? wp(25) : wp(5.3),
    marginTop: wp(100) <= 426 ? "" : -40,
    shadowColor: "#ddd",
    shadowOpacity: 0.8,
    elevation: 1,
    marginBottom: scale(10),
    borderStyle: "solid",
    borderWidth: scale(0.3),
    borderColor: "#eee",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    gap: wp(0.5),
    justifyContent: "space-between",
    borderRadius: 10,
    // position: "relative",
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
    zIndex: 25,
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
    marginLeft: wp(100) <= 426 ? wp(-10) : wp(-3),
  },
  modalDiv: {
    width: Dimensions.get("window").width + 10,
    height: Dimensions.get("window").height,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 2,
  },
});
export default Briefcase;
