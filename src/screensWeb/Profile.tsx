import * as Sentry from "@sentry/browser";
import * as React from "react";
import { DataTable, Searchbar, TextInput as Input } from "react-native-paper";
import {
  StyleSheet,
  Button,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Avatar, colors } from "react-native-elements";
import Navbar from "../components/Navbar";
import { hp, scale, wp } from "../utils";
import Popup from "../components/Popup";
import Card from "../components/Card";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { API_BASE_URL, NETWORK_URL } from "../utils/config";
import { useFocusEffect } from "@react-navigation/native";
import api from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxStore/store";
import { navigationRef } from "../utils/RootNavigation";
// import { MaterialIcons } from '@expo/vector-icons';
// import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import Zoom from "react-reveal/Zoom";
import { userDetails } from "../reduxStore/actions";
import { useNavigation, useRoute } from "@react-navigation/core";
import { Entypo } from "@expo/vector-icons";

const optionsPerPage = [2, 3, 4];

const Profile = () => {
  const [profile_img, setprofile_img] = React.useState();

  // const [title, settitle] = React.useState();

  const [visible_section, setvisible_section] = React.useState("edit_profile");

  // const[data,setData] = React.useState([]);

  const user = useSelector((state: RootState) => state.userReducer);
  // console.log("User Details", user)
  const [firstName, setFirstName] = React.useState("");
  const [Email, setEmail] = React.useState("");
  const [ContactNumber, setContactNumber] = React.useState("");
  const [university, setUniversity] = React.useState("");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [hover, setHover] = React.useState(false); // to display the edit icon on a profile image while hovering
  const [error, setError] = React.useState(false); // errorMessege
  const [cancel, setCancel] = React.useState(true);
  const [userData, setUserData] = React.useState<any>();
  const [patchRes, setPatchRes] = React.useState<any>("");
  const [passwordOpen, setPasswordOpen] = React.useState(false);
  const [newOpen, setNewOpen] = React.useState(false);
  const [confirmOpen, setconfirmOpen] = React.useState(false);

  // const user = useSelector((state: RootState) => state.userReducer);

  const navigation = useNavigation<any>();
  const _launchImageLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    // alert(JSON.stringify(result));

    if (!result.cancelled) {
      setprofile_img(result.uri);
    }
  };

  const dispatch = useDispatch<any>();

  // React.useEffect(() => {
  //   axios
  //     .post(`${NETWORK_URL}/password`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       data:{
  //         "current_password":currentPassword,
  //         "password":password,
  //         "password_confirmation":confirmPassword
  //       }

  //     })
  //     .then((response) => {
  //       console.log(response.data);
  //       console.log("password changes succesfully")
  //       alert(response.data)
  //       // setCurrentPassword(response.data.current_password)
  //       // setPassword(response.data.password)
  //       // setConfirmPassword(response.data.password_confirmation)

  //     })
  //     .catch(function (error: any) {
  //       alert(error.response);
  // Sentry.captureException(error);

  //       //   setError(error.response.data.error);
  //     });
  // }, []);

  function changePass() {
    api({
      method: "post",
      url: `${NETWORK_URL}/user/password`,
      data: {
        current_password: currentPassword,
        password: password,
        password_confirmation: confirmPassword,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        alert("Password changed successfully, Please Login Again!");
        logOut();
        // setVisiblePull(!visiblePull);
        // groupList()
      })
      .catch(function (error: any) {
        alert(error?.response?.data?.message);
        console.log(error);
        Sentry.captureException(error);
      });
  }

  function updateProfile() {
    setError(!error);
    // modifications
    console.log("updateing profile... ");
    console.log("testing");
    if (
      firstName.length !== 0 &&
      // ContactNumber.length !== 0 &&
      university.length !== 0 &&
      Email.length !== 0
    ) {
      api({
        method: "PATCH",
        url: `${NETWORK_URL}/user`,
        data: {
          user_name: firstName,
          email: Email,
          mobile: user?.userDetails?.mobile,
          institute_name: university,
        },

        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res: any) => {
          console.log(res?.data?.data, "response");
          setPatchRes(res);
          dispatch(userDetails(res?.data?.data));
          alert("Profile Updated Successfully");
          setError(false); // errorMessege
          setCancel(true);
        })
        .catch(function (error: any) {
          console.log(error);
          Sentry.captureException(error);
        });
    } else {
      setError(true);
    }
  }

  const handleCancel = () => {
    setCancel(!cancel);
    setError(false);

    //  when come back to profile the fields are become empty
    if (cancel) {
      setEmail("");
      setContactNumber("");
      setFirstName("");
      setUniversity("");
    }
  };

  React.useEffect(() => {
    getUsersData();
  }, [patchRes]);

  const getUsersData = () => {
    axios
      .get(`${NETWORK_URL}/user/view`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Get Resonse Of user Details", response?.data?.data);
        setUserData(response?.data?.data);
        dispatch(userDetails(response?.data?.data));
      })

      .catch(function (error: any) {
        Sentry.captureException(error);
      });
  };

  const logOut = () => {
    axios
      .get(`${NETWORK_URL}/user-logout`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        alert("You are Logged Out");
        window.localStorage.clear();
        navigation.navigate("landing");
        console.log(" Dashboard folders", response.data.data);
      })

      .catch(function (error: any) {
        window.location.href = "landing";
        window.localStorage.clear();
        Sentry.captureException(error);
      });
  };
  console.log(userData, "userData");

  return (
    <View>
      <View style={styles.headerDiv}>
        <Text style={styles.headerText}>My Profile</Text>
      </View>
      <View
        style={{
          display:
            wp(100) <= 425 && visible_section == "security" ? "flex" : "none",
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginRight: 10,
            marginTop: 10,
          }}
          onPress={() => {
            setvisible_section("edit_profile");
          }}
        >
          <Text style={{ color: colors.primary, fontWeight: "500" }}>
            Go to Edit Page{" "}
          </Text>
          <AntDesign name="arrowright" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {/* <TouchableOpacity
          style={{
            position: "absolute",
            left: 25,
            top: 15,
            display: wp(100) < 426 ? "none" : "flex",
          }}
          // onPress={() => (window.location.href = "/tanzabooks/dashboard")}
        >
          <Image
            source={require("../../assets/tanzabook-logo.png")}
            style={{ width: 50, height: 50, resizeMode: "contain" }}
          />
        </TouchableOpacity> */}
        <Navbar />
        <View style={{ marginLeft: wp(100) <= 768 ? 10 : wp(10) }}>
          <View
            style={{
              marginTop: 15,
              // borderWidth:1,
            }}
          >
            <Text
              style={{
                display: wp(100) <= 768 ? "none" : "flex",
                fontSize: 30,
                fontWeight: "800",
              }}
            >
              Profile
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.container_profile}>
              <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                My Profile
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setvisible_section("edit_profile");
                }}
              >
                <Text
                  style={
                    visible_section == "edit_profile"
                      ? {
                          fontSize: 16,
                          marginTop: 20,
                          fontWeight: "bold",
                          textDecorationColor: colors.primary,
                        }
                      : { fontSize: 16, marginTop: 20 }
                  }
                >
                  Edit Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setvisible_section("security");
                }}
              >
                <Text
                  style={
                    visible_section == "security"
                      ? {
                          fontSize: 16,
                          marginTop: 20,
                          fontWeight: "bold",

                          textDecorationColor: colors.primary,
                        }
                      : { fontSize: 16, marginTop: 20 }
                  }
                >
                  Security
                </Text>
              </TouchableOpacity>
            </View>

            {/* -------------------------- for web view do not scroll -------------------------------*/}
            {visible_section == "edit_profile" && wp(100) >= 768 && (
              <ScrollView>
                <View
                  contentContainerStyle={
                    wp(100) > 425 ? {} : { paddingBottom: hp(20) }
                  }
                  style={{
                    width: wp(100) <= 425 ? wp(90) : wp(40),
                    // height: wp(100) <= 425 ? "" : wp(40),
                    padding: 15,
                    marginLeft: wp(100) <= 425 ? "" : wp(1.5),
                    marginTop: 20,
                    borderRadius: 10,
                    backgroundColor: "white",
                    shadowColor: "#000000",
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    shadowOffset: {
                      height: 2,
                      width: 1,
                    },
                  }}
                >
                  <View
                    style={{
                      flexDirection: wp(100) <= 768 ? "row" : "column",
                      justifyContent: "space-around",
                      width: wp(100) <= 768 ? "" : wp(5),
                      borderRadius: 50,
                    }}
                  >
                    <Pressable
                      onHoverIn={() => setHover(true)}
                      onHoverOut={() => setHover(false)}
                      style={{}}
                    >
                      <Image
                        style={{
                          width: wp(100) <= 425 ? wp(20) : wp(5),
                          height: wp(100) <= 425 ? wp(20) : wp(5),
                          borderRadius: wp(100) <= 425 ? wp(20) : wp(5),
                          // marginLeft: wp(100) <= 425 ? null : wp(1),
                        }}
                        resizeMode={"cover"}
                        source={{
                          uri: profile_img
                            ? profile_img
                            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          _launchImageLibrary();
                        }}
                      >
                        <View
                          style={[
                            styles.body_img,
                            {
                              alignSelf: "center",
                              backgroundColor: hover ? "#f0ebebba" : "",
                            },
                          ]}
                        >
                          {/* Change profile photo */}
                          {/* <View style={{ alignSelf: "center" }}>
                      <MaterialIcons name="edit" size={16} color="white" />
                    </View> */}
                          <Text
                            style={{
                              alignSelf: "center",
                              display:
                                wp(100) <= 425
                                  ? "block"
                                  : hover
                                  ? "block"
                                  : "none",
                              marginTop: wp(100) <= 425 ? "" : wp(1.5),
                            }}
                          >
                            <Zoom>
                              <Feather
                                name="edit"
                                size={wp(100) <= 425 ? 18 : 32}
                                color={
                                  wp(100) <= 425 ? "black" : colors.primary
                                }
                                fontWeight="bold"
                              />
                            </Zoom>
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </Pressable>

                    <View style={styles.editDiv}>
                      <TouchableOpacity
                        style={{ flexDirection: "row", gap: wp(2) }}
                        onPress={() => {
                          setvisible_section("edit_profile");
                        }}
                      >
                        <AntDesign
                          name="edit"
                          size={20}
                          color={
                            visible_section == "edit_profile"
                              ? colors.primary
                              : "black"
                          }
                        />
                        <Text
                          style={
                            visible_section == "edit_profile"
                              ? {
                                  fontWeight: "bold",
                                  color: colors.primary,
                                }
                              : { color: "black" }
                          }
                        >
                          Edit
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          gap: wp(2),
                          marginTop: 10,
                        }}
                        onPress={() => {
                          setvisible_section("security");
                        }}
                      >
                        <MaterialIcons
                          name="security"
                          size={20}
                          color={
                            visible_section == "security"
                              ? colors.primary
                              : "black"
                          }
                        />
                        <Text
                          style={
                            visible_section == "security"
                              ? {
                                  fontWeight: "bold",
                                  color: colors.primary,
                                }
                              : { color: "black" }
                          }
                        >
                          Security
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* <View style={{ flexDirection: wp(100) <= 768 ? "column" : "row" }}> */}
                  <Text style={styles.inputNames}>Name :</Text>

                  {cancel ? (
                    // <Text>{user?.userDetails?.name}</Text>
                    <TextInput
                      style={styles.input}
                      editable={false}
                      selectTextOnFocus={false}
                      // defaultValue={user?.userDetails?.name}
                      // defaultValue={userData?.name}
                      defaultValue={user?.userDetails?.name}
                    />
                  ) : (
                    <View>
                      <TextInput
                        placeholder="FirstName"
                        placeholderTextColor="gray"
                        value={firstName}
                        onChangeText={(value) => setFirstName(value)}
                        style={[
                          // wp(100) <= 425
                          //   ? { marginTop: 10, width: "100%" }
                          //   : {
                          //       marginTop: 10,
                          //       width: "80%",
                          //       height: 40,
                          //       borderRadius: 10,
                          //     },
                          styles.input,
                        ]}
                      />
                      {/* Error Messege */}
                      {firstName.length == 0 && error ? (
                        <Text style={styles.errorMessage}>
                          Name Field Required *
                        </Text>
                      ) : null}
                    </View>
                  )}
                  {/* <TextInput
              label="Last Name"
              mode="outlined"
              defaultValue={Lastname}
              value={Lastname}
              onChangeText={(value) => setLastName(value)}
              activeOutlineColor={colors.primary}
              style={
                wp(100) <= 768
                  ? { marginTop: 10 }
                  : { marginTop: 10, marginLeft: '8%', width: '46%' }
              }
              theme={{ roundness: 18 }}
              autoComplete={false}
            /> */}
                  {/* </View> */}
                  <Text style={styles.inputNames}>Email :</Text>
                  {cancel ? (
                    // <Text>{user.userDetails.email}</Text>
                    <TextInput
                      style={styles.input}
                      editable={false}
                      selectTextOnFocus={false}
                      // defaultValue={user?.userDetails?.email}
                      // defaultValue={userData?.email}
                      defaultValue={user?.userDetails?.email}
                    />
                  ) : (
                    <View>
                      <TextInput
                        placeholder="Email"
                        placeholderTextColor="gray"
                        value={Email}
                        onChangeText={(value) => setEmail(value)}
                        style={styles.input}
                      />
                      {Email.length == 0 && error ? (
                        <Text style={styles.errorMessage}>
                          {" "}
                          Email Field Required *
                        </Text>
                      ) : null}
                    </View>
                  )}

                  {/* {!cancel ? (
                <Text style={styles.inputNames}>Contact Number :</Text>
              ) : null} */}
                  {/* {cancel ? (
                <Text>{ContactNumber}</Text>
              ) : (
                <View>
                  <TextInput
                    placeholder="Contact Number"
                    placeholderTextColor={"gray"}
                    value={ContactNumber}
                    onChangeText={(value) => setContactNumber(value)}
                    style={styles.input}
                  />
                  {ContactNumber.length == 0 && error ? (
                    <Text style={styles.errorMessage}>
                      Contact Field Required *
                    </Text>
                  ) : null}
                </View>
              )} */}

                  <Text style={styles.inputNames}>Contact Number :</Text>
                  {cancel ? (
                    // <Text>{user.userDetails.email}</Text>
                    <TextInput
                      style={styles.input}
                      editable={false}
                      selectTextOnFocus={false}
                      // defaultValue={userData?.mobile}
                      defaultValue={user?.userDetails?.mobile}
                    />
                  ) : (
                    <View>
                      <TextInput
                        placeholder="Contact Number"
                        placeholderTextColor="gray"
                        value={user?.userDetails?.mobile}
                        onChangeText={(value) => setContactNumber(value)}
                        style={styles.input}
                      />
                      {/* {ContactNumber.length == 0 && error ? (
                    <Text style={styles.errorMessage}>
                      {" "}
                      ContactNumber Field Required *
                    </Text>
                  ) : null} */}
                    </View>
                  )}

                  {/* {!cancel ? (
                <Text style={styles.inputNames}>
                  Unversity/Institute Name :
                </Text>
              ) : null}
              {cancel ? (
                <TextInput
                  style={styles.input}
                  editable={false}
                  selectTextOnFocus={false}
                  defaultValue={user?.userDetails?.institute_name}
                />
              ) : (
                <View>
                  <TextInput
                    placeholder="Institute / University name"
                    value={university}
                    onChangeText={(value) => setUniversity(value)}
                    style={styles.input}
                  />
                  {university.length == 0 && error ? (
                    <Text style={styles.errorMessage}>
                      University Field Required *
                    </Text>
                  ) : null}
                </View>
              )} */}
                  {/* <TextInput
            label="Zip Code"
            mode="outlined"
            value={ZipCode}
            onChangeText={(text) => setZipCode(text)}
            activeOutlineColor={colors.primary}
            style={{ marginTop: 10 }}
            autoComplete={false}
            theme={{ roundness: 18 }}
          /> */}

                  {/* -------------------For Institute Name------------------- */}

                  <Text style={styles.inputNames}>InstituteName :</Text>
                  {cancel ? (
                    // <Text>{user.userDetails.InstituteName}</Text>
                    <TextInput
                      style={styles.input}
                      editable={false}
                      selectTextOnFocus={false}
                      // defaultValue={userData?.institute_name}
                      defaultValue={user?.userDetails?.institute_name}
                    />
                  ) : (
                    <View>
                      <TextInput
                        placeholder="InstituteName"
                        placeholderTextColor="gray"
                        value={university}
                        onChangeText={(value) => setUniversity(value)}
                        style={styles.input}
                      />
                      {university.length == 0 && error ? (
                        <Text style={styles.errorMessage}>
                          {" "}
                          InstituteName Field Required *
                        </Text>
                      ) : null}
                    </View>
                  )}

                  <View
                    style={{ flexDirection: wp(100) <= 768 ? "column" : "row" }}
                  >
                    {/* <TextInput
              label="City"
              mode="outlined"
              value={city}
              onChangeText={(text) => setCity(text)}
              activeOutlineColor={colors.primary}
              style={
                wp(100) <= 768
                  ? { marginTop: 10 }
                  : { marginTop: 10, width: '46%' }
              }
              autoComplete={false}
              theme={{ roundness: 18 }}
            /> */}

                    {/* <TextInput
              label="State"
              mode="outlined"
              value={state}
              onChangeText={(text) => setState(text)}
              activeOutlineColor={colors.primary}
              style={
                wp(100) <= 768
                  ? { marginTop: 10 }
                  : { marginTop: 10, marginLeft: '8%', width: '46%' }
              }
              autoComplete={false}
              theme={{ roundness: 18 }}
            /> */}
                  </View>

                  <View
                    style={{ flexDirection: wp(100) <= 768 ? "column" : "row" }}
                  >
                    {/* <TextInput
              label="Address"
              mode="outlined"
              value={address}
              onChangeText={(text) => setAddress(text)}
              activeOutlineColor={colors.primary}
              style={
                wp(100) <= 768
                  ? { marginTop: 10 }
                  : { marginTop: 10, width: '46%' }
              }
              autoComplete={false}
              theme={{ roundness: 18 }}
            /> */}

                    {/* <TextInput
              label="Country"
              mode="outlined"
              value={country}
              onChangeText={(text) => setCountry(text)}
              activeOutlineColor={colors.primary}
              style={
                wp(100) <= 768
                  ? { marginTop: 10 }
                  : { marginTop: 10, marginLeft: '8%', width: '46%' }
              }
              autoComplete={false}
              theme={{ roundness: 18 }}
            /> */}
                  </View>

                  <View
                    style={{
                      flexDirection: wp(100) <= 768 ? "" : "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "80%",
                    }}
                  >
                    {cancel ? null : (
                      <TouchableOpacity
                        style={{
                          marginTop: 20,
                          backgroundColor: colors.primary,
                          borderRadius: 10,
                          // alignSelf: "center",
                          width: wp(100) <= 425 ? wp(20) : wp(8),
                        }}
                        onPress={() => {
                          updateProfile();
                        }}
                      >
                        <Text
                          style={{
                            alignSelf: "center",
                            marginVertical: 8,
                            marginHorizontal: 20,
                            fontSize: 16,
                            color: "white",
                          }}
                        >
                          Save
                        </Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={{ marginTop: 10 }}
                      onPress={handleCancel}
                    >
                      <Text
                        style={{
                          color: "red",
                          marginTop: 2,
                          padding: 3,
                          fontWeight: "bold",
                        }}
                      >
                        {cancel ? "Edit" : "Cancel"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>

        {/* ------------------------ mobile viewer for scrolling --------------------------------*/}
        {visible_section == "edit_profile" && wp(100) <= 425 && (
          <ScrollView
            contentContainerStyle={
              wp(100) > 425 ? {} : { paddingBottom: hp(20) }
            }
            style={{
              width: wp(100) <= 425 ? wp(90) : wp(40),
              height: wp(100) <= 425 ? "" : wp(40),
              padding: 15,
              marginLeft: wp(100) <= 425 ? "" : wp(1.5),
              marginTop: 20,
              borderRadius: 10,
              backgroundColor: "white",
              shadowColor: "#000000",
              shadowOpacity: 0.2,
              shadowRadius: 2,
              shadowOffset: {
                height: 1,
                width: 1,
              },
            }}
          >
            <View
              style={{
                flexDirection: wp(100) <= 768 ? "row" : "column",
                justifyContent: "space-around",
                width: wp(100) <= 768 ? "" : wp(5),
                borderRadius: 50,
              }}
            >
              <Pressable
                onHoverIn={() => setHover(true)}
                onHoverOut={() => setHover(false)}
                style={{}}
              >
                <Image
                  style={{
                    width: wp(100) <= 425 ? wp(20) : wp(5),
                    height: wp(100) <= 425 ? wp(20) : wp(5),
                    borderRadius: wp(100) <= 425 ? wp(20) : wp(5),
                    // marginLeft: wp(100) <= 425 ? null : wp(1),
                  }}
                  resizeMode={"cover"}
                  source={{
                    uri: profile_img
                      ? profile_img
                      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    _launchImageLibrary();
                  }}
                >
                  <View
                    style={[
                      styles.body_img,
                      {
                        alignSelf: "center",
                        backgroundColor: hover ? "#f0ebebba" : "",
                      },
                    ]}
                  >
                    {/* Change profile photo */}
                    <Text
                      style={{
                        alignSelf: "center",
                        display:
                          wp(100) <= 425 ? "block" : hover ? "block" : "none",
                        marginTop: wp(100) <= 425 ? "" : wp(1.5),
                      }}
                    >
                      <Zoom>
                        <Feather
                          name="edit"
                          size={wp(100) <= 425 ? 18 : 32}
                          color={wp(100) <= 425 ? "black" : colors.primary}
                          fontWeight="bold"
                        />
                      </Zoom>
                    </Text>
                  </View>
                </TouchableOpacity>
              </Pressable>

              <View style={styles.editDiv}>
                <TouchableOpacity
                  style={{ flexDirection: "row", gap: wp(2) }}
                  onPress={() => {
                    setvisible_section("edit_profile");
                    setCancel(!cancel);
                  }}
                >
                  <AntDesign
                    name="edit"
                    size={20}
                    color={
                      visible_section == "edit_profile"
                        ? colors.primary
                        : "black"
                    }
                  />
                  <Text
                    style={
                      visible_section == "edit_profile"
                        ? {
                            fontWeight: "bold",
                            color: colors.primary,
                          }
                        : { color: "black" }
                    }
                  >
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: "row", gap: wp(2), marginTop: 10 }}
                  onPress={() => {
                    setvisible_section("security");
                  }}
                >
                  <MaterialIcons
                    name="security"
                    size={20}
                    color={
                      visible_section == "security" ? colors.primary : "black"
                    }
                  />
                  <Text
                    style={
                      visible_section == "security"
                        ? {
                            fontWeight: "bold",
                            color: colors.primary,
                          }
                        : { color: "black" }
                    }
                  >
                    Security
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* <View style={{ flexDirection: wp(100) <= 768 ? "column" : "row" }}> */}
            <Text style={styles.inputNames}>Name :</Text>

            {cancel ? (
              // <Text>{user?.userDetails?.name}</Text>
              <TextInput
                style={styles.input}
                editable={false}
                selectTextOnFocus={false}
                defaultValue={userData?.name}
              />
            ) : (
              <View>
                <TextInput
                  placeholder="FirstName"
                  placeholderTextColor="gray"
                  // defaultValue={firstName}
                  value={firstName}
                  onChangeText={(value) => setFirstName(value)}
                  style={[
                    // wp(100) <= 425
                    //   ? { marginTop: 10, width: "100%" }
                    //   : {
                    //       marginTop: 10,
                    //       width: "80%",
                    //       height: 40,
                    //       borderRadius: 10,
                    //     },
                    styles.input,
                  ]}
                />
                {/* Error Message */}
                {firstName.length == 0 && error ? (
                  <Text style={styles.errorMessage}>Name Field Required *</Text>
                ) : null}
              </View>
            )}
            {/* <TextInput
                  label="Last Name"
                  mode="outlined"
                  defaultValue={Lastname}
                  value={Lastname}
                  onChangeText={(value) => setLastName(value)}
                  activeOutlineColor={colors.primary}
                  style={
                    wp(100) <= 768
                      ? { marginTop: 10 }
                      : { marginTop: 10, marginLeft: '8%', width: '46%' }
                  }
                  theme={{ roundness: 18 }}
                  autoComplete={false}
                /> */}
            {/* </View> */}
            <Text style={styles.inputNames}>Email :</Text>
            {cancel ? (
              // <Text>{user.userDetails.email}</Text>
              <TextInput
                style={styles.input}
                editable={false}
                selectTextOnFocus={false}
                defaultValue={userData?.email}
              />
            ) : (
              <View>
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="gray"
                  value={Email}
                  onChangeText={(value) => setEmail(value)}
                  style={styles.input}
                />
                {/* error message */}
                {Email.length == 0 && error ? (
                  <Text style={styles.errorMessage}>
                    {" "}
                    Email Field Required *
                  </Text>
                ) : null}
              </View>
            )}

            <Text style={styles.inputNames}>Contact Number :</Text>

            {cancel ? (
              <TextInput
                style={styles.input}
                editable={false}
                selectTextOnFocus={false}
                defaultValue={userData?.mobile}
              />
            ) : (
              <View>
                <TextInput
                  editable={false}
                  placeholder="Contact Number"
                  placeholderTextColor={"gray"}
                  value={userData?.mobile}
                  onChangeText={(value) => setContactNumber(value)}
                  style={styles.input}
                />
                {ContactNumber.length == 0 && error ? (
                  <Text style={styles.errorMessage}>
                    Contact Field Required *
                  </Text>
                ) : null}
              </View>
            )}

            <Text style={styles.inputNames}>Unversity/Institute Name :</Text>

            {cancel ? (
              <TextInput
                style={styles.input}
                editable={false}
                selectTextOnFocus={false}
                defaultValue={userData?.institute_name}
              />
            ) : (
              <View>
                <TextInput
                  placeholder="Institute / University name"
                  value={university}
                  onChangeText={(value) => setUniversity(value)}
                  style={styles.input}
                />
                {/* error message */}
                {university.length == 0 && error ? (
                  <Text style={styles.errorMessage}>
                    university Field Required *
                  </Text>
                ) : null}
              </View>
            )}
            {/* <TextInput
                label="Zip Code"
                mode="outlined"
                value={ZipCode}
                onChangeText={(text) => setZipCode(text)}
                activeOutlineColor={colors.primary}
                style={{ marginTop: 10 }}
                autoComplete={false}
                theme={{ roundness: 18 }}
              /> */}

            <View style={{ flexDirection: wp(100) <= 768 ? "column" : "row" }}>
              {/* <TextInput
                  label="City"
                  mode="outlined"
                  value={city}
                  onChangeText={(text) => setCity(text)}
                  activeOutlineColor={colors.primary}
                  style={
                    wp(100) <= 768
                      ? { marginTop: 10 }
                      : { marginTop: 10, width: '46%' }
                  }
                  autoComplete={false}
                  theme={{ roundness: 18 }}
                /> */}

              {/* <TextInput
                  label="State"
                  mode="outlined"
                  value={state}
                  onChangeText={(text) => setState(text)}
                  activeOutlineColor={colors.primary}
                  style={
                    wp(100) <= 768
                      ? { marginTop: 10 }
                      : { marginTop: 10, marginLeft: '8%', width: '46%' }
                  }
                  autoComplete={false}
                  theme={{ roundness: 18 }}
                /> */}
            </View>

            <View style={{ flexDirection: wp(100) <= 768 ? "column" : "row" }}>
              {/* <TextInput
                  label="Address"
                  mode="outlined"
                  value={address}
                  onChangeText={(text) => setAddress(text)}
                  activeOutlineColor={colors.primary}
                  style={
                    wp(100) <= 768
                      ? { marginTop: 10 }
                      : { marginTop: 10, width: '46%' }
                  }
                  autoComplete={false}
                  theme={{ roundness: 18 }}
                /> */}

              {/* <TextInput
                  label="Country"
                  mode="outlined"
                  value={country}
                  onChangeText={(text) => setCountry(text)}
                  activeOutlineColor={colors.primary}
                  style={
                    wp(100) <= 768
                      ? { marginTop: 10 }
                      : { marginTop: 10, marginLeft: '8%', width: '46%' }
                  }
                  autoComplete={false}
                  theme={{ roundness: 18 }}
                /> */}
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: wp(100) <= 425 ? "100%" : "80%",
              }}
            >
              {cancel ? null : (
                <TouchableOpacity
                  style={{
                    marginTop: 20,
                    backgroundColor: colors.primary,
                    borderRadius: 10,
                    // alignSelf: "center",
                    width: wp(100) <= 425 ? wp(20) : wp(8),
                  }}
                  onPress={() => {
                    updateProfile();
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      marginVertical: 8,
                      marginHorizontal: 20,
                      fontSize: 16,
                      color: "white",
                    }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={{ marginTop: 10 }}
                onPress={handleCancel}
              >
                <Text
                  style={{
                    color: "red",
                    marginTop: 2,
                    padding: 3,
                    fontWeight: "bold",
                  }}
                >
                  {cancel ? "Edit" : "Cancel"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {visible_section == "security" && (
          <View
            style={{
              width: wp(100) <= 425 ? "95%" : "40%",
              // height: wp(100) <= 425 ? wp(120) : wp(30),
              padding: 15,
              marginLeft: wp(100) <= 425 ? 10 : 20,
              marginTop: wp(100) <= 425 ? wp(3) : wp(5),
              backgroundColor: "white",
              borderRadius: 10,
              shadowColor: "#000000",
              shadowOpacity: 0.2,
              shadowRadius: 2,
              shadowOffset: {
                height: 1,
                width: 1,
              },
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: colors.primary,
                alignSelf: "center",
                paddingBottom: 20,
              }}
            >
              Change Password
            </Text>
            <Text style={styles.inputNames}>Current Password :</Text>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                placeholder="Current Password"
                value={currentPassword}
                secureTextEntry={passwordOpen ? false : true}
                onChangeText={(currentPassword) =>
                  setCurrentPassword(currentPassword)
                }
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => {
                  // if (currentPassword.length > 0)
                  setPasswordOpen(!passwordOpen);
                }}
              >
                {passwordOpen ? (
                  <Entypo
                    name="eye"
                    size={24}
                    color={colors.primary}
                    style={{
                      marginTop: wp(100) <= 768 ? wp(5) : wp(1.2),
                      marginLeft: wp(100) <= 768 ? wp(-10) : wp(-3),
                    }}
                  />
                ) : (
                  <Entypo
                    name="eye-with-line"
                    size={24}
                    color={colors.primary}
                    style={{
                      marginTop: wp(100) <= 768 ? wp(5) : wp(1.2),
                      marginLeft: wp(100) <= 768 ? wp(-10) : wp(-3),
                    }}
                  />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.inputNames}>New Password :</Text>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                placeholder="New Password"
                value={password}
                onChangeText={(password) => setPassword(password)}
                // outlineColor={colors.primary}
                secureTextEntry={newOpen ? false : true}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => {
                  // if (password.length > 0)
                  setNewOpen(!newOpen);
                }}
              >
                {newOpen ? (
                  <Entypo
                    name="eye"
                    size={24}
                    color={colors.primary}
                    style={{
                      marginTop: wp(100) <= 768 ? wp(5) : wp(1.2),
                      marginLeft: wp(100) <= 768 ? wp(-10) : wp(-3),
                    }}
                  />
                ) : (
                  <Entypo
                    name="eye-with-line"
                    size={24}
                    color={colors.primary}
                    style={{
                      marginTop: wp(100) <= 768 ? wp(5) : wp(1.2),
                      marginLeft: wp(100) <= 768 ? wp(-10) : wp(-3),
                    }}
                  />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.inputNames}>Confirm Password :</Text>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor={"gray"}
                value={confirmPassword}
                onChangeText={(confirmPassword) =>
                  setConfirmPassword(confirmPassword)
                }
                // outlineColor={colors.primary}
                secureTextEntry={confirmOpen ? false : true}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => {
                  // if (confirmPassword.length > 0)
                  setconfirmOpen(!confirmOpen);
                }}
              >
                {confirmOpen ? (
                  <Entypo
                    name="eye"
                    size={24}
                    color={colors.primary}
                    style={{
                      marginTop: wp(100) <= 768 ? wp(5) : wp(1.2),
                      marginLeft: wp(100) <= 768 ? wp(-10) : wp(-3),
                    }}
                  />
                ) : (
                  <Entypo
                    name="eye-with-line"
                    size={24}
                    color={colors.primary}
                    style={{
                      marginTop: wp(100) <= 768 ? wp(5) : wp(1.2),
                      marginLeft: wp(100) <= 768 ? wp(-10) : wp(-3),
                    }}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View style={{}}>
              <TouchableOpacity
                style={{
                  marginTop: 20,
                  backgroundColor: colors.primary,
                  borderRadius: 10,
                  // alignSelf: "center",
                  width: wp(100) <= 425 ? wp(20) : wp(8),
                }}
                onPress={() => {
                  changePass();
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    paddingVertical: 7,
                    paddingHorizontal: 20,
                    fontSize: 16,
                    color: "white",
                  }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
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
  container_profile: {
    width: wp(100) <= 768 ? wp(25) : wp(15),
    display: wp(100) <= 768 ? "none" : "flex",
    height: wp(100) <= 768 ? "none" : wp(32),
    marginTop: 20,
    // marginLeft: wp(100) <= 768 ? 10 : wp(10),
    shadowColor: "#000000",
    borderRadius: 10,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    backgroundColor: "white",
    paddingTop: hp(5),
    paddingLeft: wp(1),
  },
  body_img: {
    marginVertical: scale(1),
    marginLeft: wp(100) <= 768 ? wp(11) : "",
    marginTop: wp(100) <= 768 ? wp(-6) : wp(-5),
    width: wp(100) <= 425 ? "fit-content" : wp(5),
    height: wp(100) <= 425 ? "" : wp(5),
    borderRadius: 60,
    alignSelf: "center",
    // borderWidth: 1,
  },

  firstname: {
    backgroundColor: "red",
    overflow: "hidden",
  },
  input: {
    borderWidth: 2,
    borderColor: colors.primary,
    padding: 10,
    width: wp(100) <= 768 ? "100%" : "80%",
    borderRadius: 10,
    marginVertical: 10,
  },
  inputNames: {
    fontWeight: "bold",
    marginTop: 5,
  },
  headerDiv: {
    display: wp(100) <= 768 ? "flex" : "none",
    paddingTop: 20,
    paddingLeft: 20,
  },
  editDiv: {
    display: wp(100) <= 768 ? "flex" : "none",
    paddingTop: 20,
    paddingLeft: 20,
  },
  headerText: {
    // fontWeight: "bold",
    // fontSize: 18,
    // display: wp(100) < 425 ? "none" : "flex",
    fontSize: 30,
    fontWeight: "800",
  },
  // error message style
  errorMessage: {
    color: "red",
    fontWeight: "bold",
  },
});

export default Profile;
