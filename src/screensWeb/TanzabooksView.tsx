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
  ScrollView,
} from "react-native";

import { Avatar, colors } from "react-native-elements";
import Navbar from "../components/Navbar";
import { hp, wp } from "../utils";
import Popup from "../components/Popup";
import Card from "../components/Card";

import { Popover } from "react-native-popable";
import { Image } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { API_BASE_URL, NETWORK_URL } from "../utils/config";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../reduxStore/store";
import { getMediaLibraryPermissionsAsync } from "expo-image-picker";
import { navigationRef } from "../utils/RootNavigation";
import Viewer from "./Viewer";
import { BriefcaseIcon } from "evergreen-ui";
// import filter from "lodash.filter";

const optionsPerPage = [2, 3, 4];

const TanzabooksView = ({ navigation }: any) => {
  const user = useSelector((state: RootState) => state.userReducer);

  const [page, setPage] = React.useState<number>(0);

  const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]);

  const [title, setTitle] = React.useState("");

  const [body, setBody] = React.useState("");

  const [editModal, setEditModal] = React.useState(false);

  const [data, setData] = React.useState<any>([]);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [books, setBooks] = React.useState("");
  const handlePress = () => false;
  const [tanza, show_Tanza] = React.useState("");

  const [searchQuery, setSearchQuery] = React.useState("");
  // const [searchTimer, setSearchTimer] = React.useState(null);
  // const [input, setInput] = React.useState('');
  // const onChangeSearch = (query: React.SetStateAction<string>) =>

  useFocusEffect(
    React.useCallback(() => {
      const result = axios
        .get(`${NETWORK_URL}/tanzabook/14`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.auth_token}`,
          },
        })
        .then((response) => {
          setData(response.data.data);
          console.log("file", response.data.data);

          setLoading(false);
          alert(JSON.stringify(response.data));
          //   alert(response.data.data.length);
        })
        .catch(function (error: any) {
          alert(user.auth_token);
          // setError(error.response.data.error);
          Sentry.captureException(error)
        });
    }, [])
  );

  //

  return (
    <View style={styles.container}>
      <Navbar />

      <ScrollView style={{ width: wp(90), height: hp(100), marginLeft: 20 }}>
        <View style={{ flexDirection: "row", width: "100%", marginTop: 20 }}>
          <View
            style={{
              justifyContent: "center",
              width: wp(100) <= 768 ? "30%" : "5%",
              marginLeft: "2%",
            }}
          ></View>
        </View>

        <View style={{ flexDirection: "row" }}>
          {/* Lesson boxes */}

          {/* <TouchableOpacity
            onPress={() => navigation.navigate("Viewer")}
            style={{ flexDirection: "row" }}
          >
    
    
            <View style={styles.box}>
              <View style={styles.img}>
                <Image
                  source={{
                    uri: "https://pixlok.com/wp-content/uploads/2021/10/Edit-Icon_038ncw2.png",
                  }}
                  style={{ width: 30, height: 30 }}
                />
              </View>

              <View style={styles.textSet}>
                <Text style={styles.title}>
                  {data.file}
                  22
                </Text>
                {/* <Text style={styles.subtitle}> 
                    {data.user_id}
                     </Text> */}
          {/* </View> */}
          {/* </View> */}

          {/* </TouchableOpacity> */}

          <DataTable
            style={{ marginTop: hp(5), marginLeft: wp(12), width: "70%" }}
          >
            <DataTable.Header>
              <DataTable.Title>ID</DataTable.Title>
              <DataTable.Title>Tanzabook_name</DataTable.Title>
              <DataTable.Title numeric>URL</DataTable.Title>
              <DataTable.Title numeric>Created_at</DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
              <DataTable.Cell>{data.id}</DataTable.Cell>
              <DataTable.Cell>{data.name}</DataTable.Cell>
              <DataTable.Cell numeric>{data.file}</DataTable.Cell>
              <DataTable.Cell numeric>{data.created_at}</DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </View>
      </ScrollView>
      {/* <View
        style={{ width: "10%", height: "100%", backgroundColor: "#fff" }}
      ></View> */}

      {/* {} */}

      {/* {} */}
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
    marginLeft: wp(50) <= 425 ? 4 : 50,
    marginBottom: -5,

    width: wp(100) <= 425 ? wp(50) : wp(10),
    height: wp(100) <= 425 ? wp(50) : wp(10),

    borderRadius: 9,
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "#fff",
    zIndex: -99999,
  },

  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 11,
  },
  pencil: {
    position: "relative",
    left: 20,
    top: 10,
  },
  textSet: {
    position: "absolute",
    bottom: 2.0,
    left: 10,
  },
  img: {
    position: "absolute",
    right: 18,
  },
});

export default TanzabooksView;
