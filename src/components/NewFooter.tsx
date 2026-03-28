import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Divider } from "react-native-paper";
import { colors, wp } from "../utils";
import { Linking } from "react-native";

const NewFooter = () => {
  return (
    <View style={[styles.container, styles.shadowProp, { borderRadius: 0 }]}>
      <View style={styles.box}>
        <View style={styles.content_box}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />
          <View style={styles.text_box}>
            <Text style={styles.text}>
              The next generation tangible eBooks with annotated audio notes at
              intended locations with a means to provide constructive feedback
              for best learning outcomes and value-based education.
            </Text>
          </View>
          <View style={styles.social_logo}>
            <TouchableOpacity
              style={styles.shadowProp}
              onPress={() => {
                Linking.openURL("https://www.facebook.com/Tanzabooks");
              }}
            >
              <Image
                source={require("../../assets/Group 133.png")}
                style={styles.socialMedia}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shadowProp}
              onPress={() => {
                Linking.openURL("https://www.linkedin.com/company/tanzabooks/");
              }}
            >
              <Image
                source={require("../../assets/linkedin@512px.png")}
                style={styles.socialMedia}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shadowProp}>
              <Image
                source={require("../../assets/Group 135.png")}
                style={styles.socialMedia}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shadowProp}>
              <Image
                source={require("../../assets/Group 136.png")}
                style={styles.socialMedia}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.content_box, { height: "95%" }]}>
          <Text style={styles.heading}>Contacts</Text>
          <View style={styles.contact_detail}>
            <Text style={styles.contact_detail_mobile}>Phone:</Text>
            <Text style={styles.contact_detail_mobile_detail}>
              +91 9932581970
            </Text>
          </View>
          <View style={styles.contact_detail}>
            <Text style={styles.contact_detail_mobile}>Email:</Text>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL("support@tanzabooks.com");
              }}
            >
              <Text style={styles.contact_detail_mobile_detail}>
                support@tanzabooks.com
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contact_detail}>
            <Text style={styles.contact_detail_mobile}>Address:</Text>
            <Text style={styles.contact_detail_mobile_detail}>
              Plot no.1 , Vishnupuri colony, opp Meghana marella Homes,
              Anandbagh, Malkajgiri, Hyderabad-500047
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.divider}>
        <Divider />
      </View>
      <View style={styles.company_add}>
        <View style={styles.company_addcontent}>
          <Text style={styles.company_add_text}>
            Copyright © 2022 Tanzabooks All rights reserved
          </Text>
        </View>
        <View style={styles.company_addcontent}>
          <Text style={styles.company_add_text}>
            {" "}
            Developed & Maintained by TruEquations
          </Text>
        </View>
      </View>
    </View>
  );
};
export default NewFooter;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fbff",
  },
  box: {
    width: wp(100) < 425 ? "100%" : "70%",
    flexDirection: wp(100) < 425 ? "column" : "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: wp(100) < 425 ? 20 : 0,
  },
  content_box: {
    width: wp(100) < 425 ? "95%" : "45%",
    gap: 20,
  },
  logo: {
    width: wp(100) < 425 ? "60%" : "40%",
    height: 50,
    resizeMode: "contain",
    alignSelf: "flex-start",
  },
  text_box: {
    width: "70%",
  },
  text: {
    fontSize: 12,
    color: "grey",
    lineHeight: 18,
    textAlign: "justify",
  },
  social_logo: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  socialMedia: {
    height: 30,
    width: 30,
    borderRadius: 50,
    resizeMode: "contain",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderRadius: 50,
  },
  heading: {
    fontSize: 25,
    fontWeight: "700",
  },
  contact_detail: {
    flexDirection: "row",
    gap: 3,
  },
  contact_detail_mobile: {
    color: colors.primary,
    fontSize: 12,
  },
  contact_detail_mobile_detail: {
    color: "grey",
    fontSize: 12,
  },
  divider: {
    marginTop: 50,
    width: "100%",
  },
  company_add: {
    width: wp(100) < 425 ? "100%" : "70%",
    marginVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  company_addcontent: {
    width: wp(100) < 425 ? "47%" : "45%",
  },
  company_add_text: {
    fontSize: 12,
    color: "grey",
  },
});
