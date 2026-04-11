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
import { API_BASE_URL } from "../utils/config";
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
import Homenav from "../components/Homenav";

// import "react-select/dist/react-select.css";
// const optionsPerPage = [2, 3, 4];

export const Orders = () => {
  const user = useSelector((state: RootState) => state.userReducer);
  const [ApiData, setApiData] = React.useState<any>([]);
  const [page, setPage] = React.useState<number>(0);
  const [selected_tab, setselected_tab] = React.useState("Purchase Details");
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
  const [files, setFiles] = React.useState([]);
  const [createLoad, setCreateLoad] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState("");

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
    setFileRejections([]);
  }, [previewUrl]);

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    // <View style={styles.container}>
    //   <>
    //     <Navbar />
    //     {wp(100) >= 768 && (
    //       <ScrollView
    //         style={{
    //           width: wp(90),
    //           height: hp(100),
    //           marginLeft: wp(100) <= 768 ? 10 : wp(8.2),
    //         }}
    //       >
    //         <View
    //           style={{ flexDirection: "row", width: "100%", marginTop: 20 }}
    //         >
    //           <View
    //             style={{
    //               justifyContent: "center",
    //               width: wp(100) <= 768 ? "30%" : "15%",
    //               // marginLeft: "2%",
    //               marginTop: hp(1),
    //               marginLeft: wp(1),
    //             }}
    //           >
    //             <Text style={{ fontSize: 24, fontWeight: "700" }}>
    //               Order Details
    //             </Text>
    //           </View>
    //         </View>

    //         <View
    //           style={{
    //             flexDirection: "row",
    //             marginTop: hp(2),
    //             gap: 20,
    //             alignItems: "center",
    //           }}
    //         >
    //           <TouchableOpacity
    //             style={{ margin: 10 }}
    //             onPress={() => {
    //               setselected_tab("Purchase Details");
    //             }}
    //           >
    //             <Text
    //               style={
    //                 selected_tab == "Purchase Details"
    //                   ? {
    //                       // textDecorationLine: "underline",
    //                       fontWeight: "600",
    //                       textDecorationColor: colors.primary,
    //                       color: "white",
    //                       backgroundColor: colors.primary,
    //                       fontSize: 18,
    //                       borderRadius: 10,
    //                       paddingHorizontal: 10,
    //                       paddingVertical: 5,
    //                     }
    //                   : {
    //                       fontSize: 18,
    //                       fontFamily: "lato",
    //                       paddingHorizontal: 10,
    //                       paddingVertical: 5,
    //                     }
    //               }
    //             >
    //               Purchase Details
    //             </Text>
    //           </TouchableOpacity>

    //           <TouchableOpacity
    //             style={{ alignItems: "center", justifyContent: "center" }}
    //             onPress={() => {
    //               setselected_tab("Sales Details");
    //             }}
    //           >
    //             <Text
    //               style={
    //                 selected_tab == "Sales Details"
    //                   ? {
    //                       // textDecorationLine: "underline",
    //                       fontWeight: "600",
    //                       textDecorationColor: colors.primary,
    //                       color: "white",
    //                       backgroundColor: colors.primary,
    //                       fontSize: 18,
    //                       borderRadius: 10,
    //                       paddingHorizontal: 10,
    //                       paddingVertical: 5,
    //                     }
    //                   : {
    //                       fontSize: 18,
    //                       paddingHorizontal: 10,
    //                       paddingVertical: 5,
    //                     }
    //               }
    //             >
    //               Sales Details
    //             </Text>
    //           </TouchableOpacity>
    //         </View>

    //         {selected_tab == "Purchase Details" && (
    //           <View>
    //             {/* <Text style={{ marginLeft: 20, fontWeight: 700, fontSize: 20 }}>
    //               For Purchases
    //             </Text> */}
    //             {/* <View style={styles.tableDiv}> */}
    //             <DataTable>
    //               <DataTable.Header>
    //                 <DataTable.Title
    //                 //   style={{ flex: 1 }}
    //                 >
    //                   <Text style={styles.tableText}>Order ID</Text>
    //                 </DataTable.Title>
    //                 <DataTable.Title
    //                 //   style={{ flex: 1 }}
    //                 >
    //                   <Text style={styles.tableText}>Purchase ID</Text>
    //                 </DataTable.Title>
    //                 <DataTable.Title
    //                 //   style={{ flex: 1 }}
    //                 >
    //                   <Text style={styles.tableText}>Customer Name</Text>
    //                 </DataTable.Title>
    //                 <DataTable.Title
    //                 //   style={{ flex: 1 }}
    //                 >
    //                   <Text style={styles.tableText}>Price</Text>
    //                 </DataTable.Title>
    //                 <DataTable.Title
    //                 //   style={{ flex: 1 }}
    //                 >
    //                   <Text style={styles.tableText}>Invoice Number</Text>
    //                 </DataTable.Title>
    //                 <DataTable.Title
    //                 //   style={{ flex: 1 }}
    //                 >
    //                   <Text style={styles.tableText}>Status</Text>
    //                 </DataTable.Title>
    //                 {/* <DataTable.Title style={{ flex: 0.5 }}>
    //                     <Text style={styles.tableText}></Text>
    //                   </DataTable.Title>
    //                   <DataTable.Title style={{ flex: 0.5 }}>
    //                     <Text style={styles.tableText}></Text>
    //                   </DataTable.Title> */}
    //               </DataTable.Header>
    //             </DataTable>
    //             {/* </View> */}
    //           </View>
    //         )}

    //         {selected_tab == "Sales Details" && (
    //           <View>
    //             {/* <Text style={{ marginLeft: 20, fontWeight: 700, fontSize: 20 }}>
    //               For Sales
    //             </Text>{" "} */}
    //             <DataTable>
    //               <DataTable.Header>
    //                 <DataTable.Title
    //                 // style={{ flex: 1 }}
    //                 >
    //                   <Text style={styles.tableText}>Order ID</Text>
    //                 </DataTable.Title>
    //                 <DataTable.Title
    //                 // style={{ flex: 1 }}
    //                 >
    //                   <Text style={styles.tableText}>Sales ID</Text>
    //                 </DataTable.Title>
    //                 <DataTable.Title
    //                 // style={{ flex: 1 }}
    //                 >
    //                   <Text style={styles.tableText}>Customer Name</Text>
    //                 </DataTable.Title>
    //                 <DataTable.Title
    //                 // style={{ flex: 1 }}
    //                 >
    //                   <Text style={styles.tableText}>Price</Text>
    //                 </DataTable.Title>
    //                 <DataTable.Title
    //                 // style={{ flex: 1 }}
    //                 >
    //                   <Text style={styles.tableText}>Invoice Number</Text>
    //                 </DataTable.Title>
    //                 <DataTable.Title
    //                 // style={{ flex: 1 }}
    //                 >
    //                   <Text style={styles.tableText}>Status</Text>
    //                 </DataTable.Title>
    //                 {/* <DataTable.Title style={{ flex: 0.5 }}>
    //                     <Text style={styles.tableText}></Text>
    //                   </DataTable.Title>
    //                   <DataTable.Title style={{ flex: 0.5 }}>
    //                     <Text style={styles.tableText}></Text>
    //                   </DataTable.Title> */}
    //               </DataTable.Header>
    //             </DataTable>
    //           </View>
    //         )}
    //       </ScrollView>
    //     )}
    //     {/* -------------------- Mobile view ---------------------------------- */}
    //     {wp(100) <= 425 && (
    //       <ScrollView
    //         style={{ width: wp(90), height: hp(100), marginLeft: 15 }}
    //       >
    //         <View
    //           style={{ flexDirection: "row", width: "100%", marginTop: 20 }}
    //         >
    //           <View
    //             style={{
    //               justifyContent: "center",
    //               marginLeft: "2%",
    //               marginTop: hp(1),
    //             }}
    //           >
    //             <Text style={{ fontSize: 20, fontWeight: "700" }}>
    //               Order Details
    //             </Text>
    //           </View>
    //         </View>

    //         <View style={{ flexDirection: "row", marginTop: hp(2) }}>
    //           <TouchableOpacity
    //             style={{ margin: 10 }}
    //             onPress={() => {
    //               setselected_tab("Purchase Details");
    //             }}
    //           >
    //             <Text
    //               style={
    //                 selected_tab == "Purchase Details"
    //                   ? {
    //                       // textDecorationLine: "underline",
    //                       fontWeight: "600",
    //                       textDecorationColor: colors.primary,
    //                       color: "white",
    //                       backgroundColor: colors.primary,
    //                       fontSize: 20,
    //                       borderRadius: 10,
    //                       fontFamily: "lato",
    //                       padding: 10,
    //                     }
    //                   : {
    //                       fontSize: 20,
    //                       padding: 10,
    //                     }
    //               }
    //             >
    //               Purchase Details
    //             </Text>
    //           </TouchableOpacity>

    //           <TouchableOpacity
    //             style={{ marginLeft: 10, margin: 10 }}
    //             onPress={() => {
    //               setselected_tab("Sales Details");
    //             }}
    //           >
    //             <Text
    //               style={
    //                 selected_tab == "Sales Details"
    //                   ? {
    //                       // textDecorationLine: "underline",
    //                       fontWeight: "600",
    //                       textDecorationColor: colors.primary,
    //                       color: "white",
    //                       backgroundColor: colors.primary,
    //                       fontSize: 20,
    //                       borderRadius: 10,
    //                       padding: 10,
    //                     }
    //                   : {
    //                       fontSize: 20,
    //                       padding: 10,
    //                     }
    //               }
    //             >
    //               Sales Details
    //             </Text>
    //           </TouchableOpacity>
    //         </View>

    //         {selected_tab == "Purchase Details" && (
    //           <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
    //             {/* <Text>For Purchases</Text> */}
    //             <DataTable>
    //               <DataTable.Header>
    //                 <DataTable.Title
    //                 // style={{ flex: 1 }}
    //                 >
    //                   <Text style={styles.tableText}>Order ID</Text>
    //                 </DataTable.Title>
    //                 <DataTable.Title
    //                 // style={{ flex: 1 }}
    //                 >
    //                   <Text style={styles.tableText}>Purchase ID</Text>
    //                 </DataTable.Title>
    //                 <DataTable.Title
    //                 // style={{ flex: 1 }}
    //                 >
    //                   <Text style={styles.tableText}>Customer Name</Text>
    //                 </DataTable.Title>
    //                 <DataTable.Title
    //                 // style={{ flex: 1 }}
    //                 >
    //                   <Text style={styles.tableText}>Price</Text>
    //                 </DataTable.Title>
    //                 <DataTable.Title
    //                 // style={{ flex: 1 }}
    //                 >
    //                   <Text style={styles.tableText}>Invoice Number</Text>
    //                 </DataTable.Title>
    //                 <DataTable.Title
    //                 // style={{ flex: 1 }}
    //                 >
    //                   <Text style={styles.tableText}>Status</Text>
    //                 </DataTable.Title>
    //                 {/* <DataTable.Title style={{ flex: 0.5 }}>
    //                     <Text style={styles.tableText}></Text>
    //                   </DataTable.Title>
    //                   <DataTable.Title style={{ flex: 0.5 }}>
    //                     <Text style={styles.tableText}></Text>
    //                   </DataTable.Title> */}
    //               </DataTable.Header>
    //             </DataTable>
    //           </View>
    //         )}

    //         {selected_tab == "Sales Details" && (
    //           <ScrollView>
    //             <View style={{ height: wp(120) }}>
    //               {/* <Text>For sales</Text> */}
    //               <DataTable>
    //                 <DataTable.Header>
    //                   <DataTable.Title
    //                   //   style={{ flex: 1 }}
    //                   >
    //                     <Text style={styles.tableText}>Order ID</Text>
    //                   </DataTable.Title>
    //                   <DataTable.Title
    //                   //   style={{ flex: 1 }}
    //                   >
    //                     <Text style={styles.tableText}>Sales ID</Text>
    //                   </DataTable.Title>
    //                   <DataTable.Title
    //                   //   style={{ flex: 1 }}
    //                   >
    //                     <Text style={styles.tableText}>Customer Name</Text>
    //                   </DataTable.Title>
    //                   <DataTable.Title
    //                   //   style={{ flex: 1 }}
    //                   >
    //                     <Text style={styles.tableText}>Price</Text>
    //                   </DataTable.Title>
    //                   <DataTable.Title
    //                   //   style={{ flex: 1 }}
    //                   >
    //                     <Text style={styles.tableText}>Invoice Number</Text>
    //                   </DataTable.Title>
    //                   <DataTable.Title
    //                   //   style={{ flex: 1 }}
    //                   >
    //                     <Text style={styles.tableText}>Status</Text>
    //                   </DataTable.Title>
    //                   {/* <DataTable.Title style={{ flex: 0.5 }}>
    //                     <Text style={styles.tableText}></Text>
    //                   </DataTable.Title>
    //                   <DataTable.Title style={{ flex: 0.5 }}>
    //                     <Text style={styles.tableText}></Text>
    //                   </DataTable.Title> */}
    //                 </DataTable.Header>
    //               </DataTable>
    //             </View>
    //           </ScrollView>
    //         )}
    //       </ScrollView>
    //       // </>
    //     )}
    //   </>
    // </View>
    <>
      <Homenav />
      <View style={styles.container}>
        <Image
          source={require("../../assets/comingGIF.gif")}
          style={{
            width: 600,
            height: 350,
            resizeMode: "contain",
            alignSelf: "center",
            borderRadius: 10,
          }}
        />
        <Text style={{ fontSize: 25 }}>Coming Soon...</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     overflowX: "hidden",
  //     flexDirection: "row",
  //   },
  container: {
    alignItems: "center",
    justifyContent: "center",
    // marginTop: wp(100) < 425 ? 0 : 60,
    backgroundColor: "white",
    flex: 1,
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
  tableText: {
    // fontFamily: "poppins-Bold",
    fontWeight: "bold",
    color: "black",
    fontSize: 15,
  },
  tableData: {
    // fontFamily: "poppins-Medium",
    color: "black",
    fontSize: 13,
  },
  tableDiv: {
    paddingTop: 20,
  },
});
