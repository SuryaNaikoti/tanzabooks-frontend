import * as Sentry from "@sentry/browser";
import * as React from "react";
import { DataTable, Searchbar, TextInput } from "react-native-paper";

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
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import { RootState } from "../reduxStore/store";

const optionsPerPage = [2, 3, 4];

const Listing = () => {
  const user = useSelector((state: RootState) => state.userReducer);

  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]);

  const [title, settitle] = React.useState("");

  const [bodys, setbody] = React.useState("");

  const [editmodal, seteditmodal] = React.useState(false);

  const handlePress = () => false;
  const [searchQuery, setSearchQuery] = React.useState("");

  const onChangeSearch = (query: React.SetStateAction<string>) =>
    setSearchQuery(query);

  useFocusEffect(
    React.useCallback(() => {
      axios
        .get(`${API_BASE_URL}/api/institute/students`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.auth_token}`,
          },
        })
        .then((response) => {
          // alert(JSON.stringify(response.data));
          setData(response.data.data.data);

          // alert(response.data.data.data.length);
        })

        .catch(function (error: any) {
          Sentry.captureException(error);
          // alert(user.auth_token);
          //   setError(error.response.data.error);
        });
    }, [])
  );

  return (
    <View style={styles.container}>
      <Navbar />

      <ScrollView style={{ width: wp(90), height: hp(100), marginLeft: 20 }}>
        <View style={{ flexDirection: "row", width: "100%", marginTop: 20 }}>
          <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={{
              width: wp(100) <= 768 ? "60%" : "20%",
              borderRadius: 10,
              height: 40,
            }}
          />

          <View
            style={{
              justifyContent: "center",
              width: wp(90) <= 768 ? "20%" : "10%",
              marginLeft: "2%",
              borderRadius: 20,
            }}
          >
            <TouchableOpacity
              style={{
                width: "100%",
                backgroundColor: colors.primary,
                borderRadius: wp(100) < 425 ? 7 : wp(0.5),
              }}
              onPress={() => {}}
            >
              <Text
                style={{
                  alignSelf: "center",
                  margin: 10,
                  fontSize: 12,
                  color: "white",
                }}
              >
                Filter
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {wp(100) <= 768 ? (
          <View style={{ width: "90%" }}>
            {data.map((elem1: any, key) => {
              return (
                <Card style={{ marginTop: 20 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <Text>Name : </Text>
                    <Text>{elem1.full_name}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <Text>Classroom : </Text>
                    <Text>{elem1.classroom}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <Text>Email : </Text>
                    <Text>{elem1.email}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <Text>Parent name : </Text>
                    <Text>Sidharth</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <Text>Parent number : </Text>
                    <Text>8619617247</Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: "100%",
                      backgroundColor: colors.primary,
                      borderRadius: wp(5),
                      marginTop: 10,
                    }}
                    onPress={() => {
                      seteditmodal(true);
                    }}
                  >
                    <Text
                      style={{
                        alignSelf: "center",
                        margin: 10,
                        fontSize: 12,
                        color: "white",
                      }}
                    >
                      Add/Edit
                    </Text>
                  </TouchableOpacity>
                </Card>
              );
            })}
          </View>
        ) : (
          <DataTable
            style={{
              marginTop: hp(5),
              backgroundColor: "#F2F2F2",
              width: "75%",
            }}
          >
            <DataTable.Header>
              <DataTable.Title>Names</DataTable.Title>
              <DataTable.Title>Classroom</DataTable.Title>
              <DataTable.Title>Email</DataTable.Title>
              <DataTable.Title>Parent name</DataTable.Title>
              <DataTable.Title numeric>Parent number</DataTable.Title>
              <DataTable.Title numeric>{} </DataTable.Title>
            </DataTable.Header>

            {data.map((elem1: any, key: any) => {
              return (
                <DataTable.Row key={key}>
                  <DataTable.Cell>{elem1.full_name}</DataTable.Cell>
                  <DataTable.Cell>{elem1.classroom}</DataTable.Cell>
                  <DataTable.Cell>{elem1.email}</DataTable.Cell>
                  <DataTable.Cell>Name</DataTable.Cell>
                  <DataTable.Cell numeric>999999</DataTable.Cell>
                  <DataTable.Cell numeric>
                    <TouchableOpacity
                      style={{
                        width: "100%",
                        backgroundColor: colors.primary,
                        borderRadius: wp(5),
                      }}
                      onPress={() => {
                        seteditmodal(true);
                      }}
                    >
                      <Text
                        style={{
                          alignSelf: "center",
                          margin: 10,
                          fontSize: 12,
                          color: "white",
                        }}
                      >
                        Add/Edit
                      </Text>
                    </TouchableOpacity>
                  </DataTable.Cell>
                </DataTable.Row>
              );
            })}
          </DataTable>
        )}
      </ScrollView>

      <Popup modalVisible={editmodal}>
        <View>
          <TextInput
            label="Title"
            mode="outlined"
            value={title}
            onChangeText={(text) => settitle(text)}
            outlineColor={colors.primary}
            activeOutlineColor={colors.primary}
            style={{ marginTop: 10 }}
            autoComplete={false}
          />

          <TextInput
            label="Title"
            mode="outlined"
            value={title}
            onChangeText={(text) => settitle(text)}
            outlineColor={colors.primary}
            activeOutlineColor={colors.primary}
            style={{ marginTop: 10 }}
            autoComplete={false}
          />

          <TextInput
            label="Body"
            multiline
            mode="outlined"
            value={bodys}
            onChangeText={(text) => setbody(text)}
            outlineColor={colors.primary}
            activeOutlineColor={colors.primary}
            style={{ height: hp(25), marginTop: 10 }}
            autoComplete={false}
          />

          <TouchableOpacity
            style={{
              width: "30%",
              marginTop: 20,
              backgroundColor: colors.primary,
              borderRadius: wp(5),
              alignSelf: "center",
            }}
            onPress={() => {}}
          >
            <Text
              style={{
                alignSelf: "center",
                margin: 10,
                fontSize: 12,
                color: "white",
              }}
            >
              Add/Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "30%",
              marginTop: 20,
              backgroundColor: colors.primary,
              borderRadius: wp(5),
              alignSelf: "center",
            }}
            onPress={() => {
              seteditmodal(false);
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                margin: 10,
                fontSize: 12,
                color: "white",
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Popup>
    </View>
  );

  // const styles = StyleSheet.create
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflowX: "hidden",
    flexDirection: "row",
  },
});

export default Listing;
