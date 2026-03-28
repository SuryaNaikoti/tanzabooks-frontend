import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  ImageBackground,
} from "react-native";
import { colors } from "react-native-elements";
import { color } from "react-native-elements/dist/helpers";
import Footer from "../components/Footer";
import Homenav from "../components/Homenav";
import Swiper from "react-native-swiper/src";
import Card from "../components/Card";
import { wp, hp } from "../utils";

const NewHome = () => {
  const [hover, setHover] = useState("");

  return (
    <>
      <Homenav />
      <View style={styles.container}>
        <View style={styles.intro_content}>
          <View style={styles.intro_content_text}>
            <View style={styles.SmallTitle}>
              <View style={styles.line}></View>
              <Text style={styles.SmallTitle_text}>
                Bring out the curiosity that yearns to learn
              </Text>
            </View>
            <View style={styles.heading}>
              <Text style={styles.heading_text}>
                Making Your Childs World Better
              </Text>
            </View>
            <View style={styles.content}>
              <Text style={[styles.SmallTitle_text, { fontSize: 13 }]}>
                The new tangible interface brings forth the valuable insights
                and contexts that dwell inside the thinkers’ minds to give you
                the best learning outcomes
              </Text>
            </View>
            <View style={styles.button_box}>
              <Pressable
                style={[
                  styles.btn,
                  styles.shadowProp,
                  {
                    backgroundColor:
                      hover == "sample" ? "white" : colors.primary,
                  },
                ]}
                onHoverIn={() => {
                  setHover("sample");
                }}
                onHoverOut={() => {
                  setHover("");
                }}
                onPress={() => (window.location.href = "Sample")}
              >
                <Text
                  style={[
                    styles.btn_text,
                    { color: hover == "sample" ? colors.primary : "white" },
                  ]}
                >
                  Sample
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.intro_content_image}>
            <Image
              source={require("../../assets/book.png")}
              style={styles.image}
            />
          </View>
        </View>
        <View style={styles.featureBox}>
          <Image
            source={require("../../assets/butterfly.png")}
            style={styles.butterfly}
          />
          <View style={styles.feature_text}>
            <View style={styles.feature_heading}>
              <Text style={styles.feature_heading_text}>
                Features that we offer
              </Text>
            </View>
            <View style={styles.feature_heading_small_text}>
              <Text
                style={[
                  styles.feature_heading_small_text_content,
                  { fontSize: 13 },
                ]}
              >
                Our tool brings in the ease to upgrade your books/documents and
                gain many advantages that we offer
              </Text>
            </View>
            {/* <View style={styles.button_box}>
              <Pressable
                style={[
                  styles.btn,
                  styles.shadowProp,
                  {
                    backgroundColor:
                      hover == "feature" ? "white" : colors.primary,
                  },
                ]}
                onHoverIn={() => {
                  setHover("feature");
                }}
                onHoverOut={() => {
                  setHover("");
                }}
                onPress={() => (window.location.href = "Sample")}
              >
                <Text
                  style={[
                    styles.btn_text,
                    { color: hover == "feature" ? colors.primary : "white" },
                  ]}
                >
                  Sample
                </Text>
              </Pressable>
            </View> */}
          </View>
          <View style={[styles.feature_image]}>
            <Pressable
              style={[
                styles.card,
                styles.shadowProp,
                { backgroundColor: hover == "future" ? "lavender" : "#f8fbff" },
              ]}
              onHoverIn={() => {
                setHover("future");
              }}
              onHoverOut={() => {
                setHover("");
              }}
            >
              <View style={styles.cardIcon}>
                <Image
                  source={require("../../assets/eye.png")}
                  style={styles.cardIconImage}
                />
              </View>
              <Text style={styles.card_heading}>Audio tagging</Text>
              <View style={styles.card_icon_smalltext}>
                <Text
                  style={[
                    styles.SmallTitle_text,
                    styles.cardIcon_smalltext_align,
                    { fontSize: 12 },
                  ]}
                >
                  Be more expressive by making your pictures/docs literally
                  speak more than thousand words.
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={[
                styles.card,
                styles.shadowProp,
                {
                  backgroundColor: hover == "trainers" ? "lavender" : "#f8fbff",
                },
              ]}
              onHoverIn={() => {
                setHover("trainers");
              }}
              onHoverOut={() => {
                setHover("");
              }}
            >
              <View style={styles.cardIcon}>
                <Image
                  source={require("../../assets/trainers.png")}
                  style={styles.cardIconImage}
                />
              </View>
              <Text style={styles.card_heading}>Tangible interface</Text>
              <View style={styles.card_icon_smalltext}>
                <Text
                  style={[
                    styles.SmallTitle_text,
                    styles.cardIcon_smalltext_align,
                    { fontSize: 12 },
                  ]}
                >
                  Involve your other senses mindfully while learning and
                  activate new memory pathways
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={[
                styles.card,
                styles.shadowProp,
                { backgroundColor: hover == "job" ? "lavender" : "#f8fbff" },
              ]}
              onHoverIn={() => {
                setHover("job");
              }}
              onHoverOut={() => {
                setHover("");
              }}
            >
              <View style={styles.cardIcon}>
                <Image
                  source={require("../../assets/job.png")}
                  style={styles.cardIconImage}
                />
              </View>
              <Text style={styles.card_heading}>Authors Interaction</Text>
              <View style={styles.card_icon_smalltext}>
                <Text
                  style={[
                    styles.SmallTitle_text,
                    styles.cardIcon_smalltext_align,
                    { fontSize: 12 },
                  ]}
                >
                  Readers can directly interact on the views of authors on the
                  specific topic while reading.
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={[
                styles.card,
                styles.shadowProp,
                {
                  backgroundColor: hover == "language" ? "lavender" : "#f8fbff",
                },
              ]}
              onHoverIn={() => {
                setHover("language");
              }}
              onHoverOut={() => {
                setHover("");
              }}
            >
              <View style={styles.cardIcon}>
                <Image
                  source={require("../../assets/eye.png")}
                  style={styles.cardIconImage}
                />
              </View>
              <Text style={styles.card_heading}>
                Reducing Effective screentime
              </Text>
              <View style={styles.card_icon_smalltext}>
                <Text
                  style={[
                    styles.SmallTitle_text,
                    styles.cardIcon_smalltext_align,
                    { fontSize: 12 },
                  ]}
                >
                  With Tanzabooks one can learn to Grasp more information
                  effectively using senses other than his eyes. He/She can
                  choose to close eyes and concentrate.
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={[
                styles.card,
                styles.shadowProp,
                {
                  backgroundColor: hover == "health" ? "lavender" : "#f8fbff",
                },
              ]}
              onHoverIn={() => {
                setHover("health");
              }}
              onHoverOut={() => {
                setHover("");
              }}
            >
              <View style={styles.cardIcon}>
                <Image
                  source={require("../../assets/trainers.png")}
                  style={styles.cardIconImage}
                />
              </View>
              <Text style={styles.card_heading}>Best Digital Library</Text>
              <View style={styles.card_icon_smalltext}>
                <Text
                  style={[
                    styles.SmallTitle_text,
                    styles.cardIcon_smalltext_align,
                    { fontSize: 12 },
                  ]}
                >
                  This is a Hybrid Library, That doesn't alter the original text
                  even a bit. Yet, it can provide lots of contextual references,
                  reader's emotion and communal insights.
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={[
                styles.card,
                styles.shadowProp,
                { backgroundColor: hover == "data" ? "lavender" : "#f8fbff" },
              ]}
              onHoverIn={() => {
                setHover("data");
              }}
              onHoverOut={() => {
                setHover("");
              }}
            >
              <View style={styles.cardIcon}>
                <Image
                  source={require("../../assets/job.png")}
                  style={styles.cardIconImage}
                />
              </View>
              <Text style={styles.card_heading}>Market place</Text>
              <View style={styles.card_icon_smalltext}>
                <Text
                  style={[
                    styles.SmallTitle_text,
                    styles.cardIcon_smalltext_align,
                    { fontSize: 12 },
                  ]}
                >
                  We can boost your eBook sales tremendously. We can provide a
                  positive probability that a person will buy your eBook even if
                  he has already brought your paperback.
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
        <View
          style={[
            styles.intro_content,
            { marginTop: 140, gap: wp(100) < 425 ? 0 : 80 },
          ]}
        >
          <View
            style={[
              styles.intro_content_image_presentation,
              { width: wp(100) < 425 ? "98%" : "35%" },
            ]}
          >
            <Image
              source={require("../../assets/Presentation.png")}
              style={styles.presentaion_image}
            />
          </View>
          <View style={styles.intro_content_text}>
            <View style={styles.SmallTitle}>
              <View style={styles.line}></View>
              <Text style={styles.SmallTitle_text}>ABOUT US</Text>
            </View>
            <View style={styles.heading}>
              <Text style={styles.feature_heading_text}>
                Learn more with human touch and thoughtful insights
              </Text>
            </View>
            <View style={styles.content}>
              <Text style={[styles.SmallTitle_text, { fontSize: 12 }]}>
                Our thought leaders at Tanzabooks know it by heart how important
                it is to put their thoughts out. We always believe that the cure
                for many sufferings in this world are trapped inside many
                beautiful minds that are finding ways to express better. We want
                to give the bright ideas a voice and personal space to come
                forth and stand out. Our philosophy is that learning is not just
                about storing the data but striving to expand.the dimensions of
                mind to be able to see same things from different perspectives.
                Our perspective is that a carefully made audio is fully capable
                of drawing a mental picture on any insight for the reader. We
                made Tanzabooks to improve such learning outcomes. Please visit
                our samples page or market place to see for yourselves how a
                sonified document adds value to you.
              </Text>
            </View>
            {/* <View style={styles.button_box}>
              <TouchableOpacity style={[styles.btn, styles.shadowProp]}>
                <Text style={styles.btn_text}>Read more</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
        <View style={[styles.bluebox, styles.shadowProp]}>
          <View style={styles.bluebox_content}>
            <View
              style={{
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.bluebox_content_text}>960</Text>
              <View style={styles.bluebox_line}></View>
              <Text style={styles.bluebox_text}>All Teachers</Text>
            </View>
            <View
              style={{
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.bluebox_content_text}>860</Text>
              <View style={styles.bluebox_line}></View>
              <Text style={styles.bluebox_text}>All Students</Text>
            </View>
            <View
              style={{
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.bluebox_content_text}>980</Text>
              <View style={styles.bluebox_line}></View>
              <Text style={styles.bluebox_text}>Online Students</Text>
            </View>
            <View
              style={{
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.bluebox_content_text}>880</Text>
              <View style={styles.bluebox_line}></View>
              <Text style={styles.bluebox_text}>Offline Students</Text>
            </View>
          </View>
        </View>
        <View style={[styles.intro_content, styles.intro_content_radio]}>
          <View style={styles.intro_content_text}>
            <View style={styles.SmallTitle}>
              <View style={styles.line}></View>
              <Text style={styles.SmallTitle_text}>ADVANCE FEATURE</Text>
            </View>
            <View style={styles.heading}>
              <Text style={styles.feature_heading_text}>
                Our Advance Learning System
              </Text>
            </View>
            <View style={styles.content}>
              <Text
                style={[
                  styles.SmallTitle_text,
                  { fontSize: 13, textAlign: "justify" },
                ]}
              >
                Replenish seasons may male haith fruit beast were seas saw you
                arrie said man beast whales his void unto last session for
                bite.Set have great you'll male grass yielding man
              </Text>
            </View>
            <View
              style={[
                styles.button_box,
                { width: wp(100) < 425 ? "90%" : "40%" },
              ]}
            >
              <View style={styles.button_box_teacher}>
                <View style={[styles.teacherIcon]}>
                  <Image
                    source={require("../../assets/student.png")}
                    style={[styles.cardIconImage]}
                  />
                </View>
                <Text style={styles.btn_card_text}>Learn Anywhere</Text>
                <View style={[styles.card_icon_smalltext, { width: 200 }]}>
                  <Text style={[styles.SmallTitle_text, { fontSize: 13 }]}>
                    One of the main advantages of our interface is that it is
                    available within the grasp of your fingertips online
                  </Text>
                </View>
              </View>
              <View style={styles.button_box_teacher}>
                <View style={styles.teacherIcon}>
                  <Image
                    source={require("../../assets/leader.png")}
                    style={styles.cardIconImage}
                  />
                </View>
                <Text style={styles.btn_card_text}>Expert teachings</Text>
                <View style={[styles.card_icon_smalltext, { width: 200 }]}>
                  <Text style={[styles.SmallTitle_text, { fontSize: 13 }]}>
                    For any lesson out there in Tanzabooks there will be
                    multiple teachers pushing the quality to its best through
                    discussions and feedbacks.
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.intro_content_image]}>
            <Image
              source={require("../../assets/Video.png")}
              style={styles.image}
            />
          </View>
        </View>

        <View style={styles.slider}>
          <View style={styles.slider_title}>
            <View style={styles.line}></View>
            <Text style={styles.slider_text}>Testimonials</Text>
          </View>
          <Text style={[styles.feature_heading_text, { textAlign: "center" }]}>
            Happy Students
          </Text>

          <Swiper showsButtons={true}>
            <View style={styles.carousel}>
              <View style={[styles.carousel_image, styles.shadowProp]}>
                <Image
                  source={require("../../assets/casual-college-connection-1438081.png")}
                  style={styles.carousel_slider_image}
                />
              </View>
              <View style={[styles.carousel_content, styles.shadowProp]}>
                <Text style={[styles.carousel_content_text]}>
                  I am probably among the first few who started learning from
                  Tanzabooks. I learnt Sanskrit slokas that were very hard to
                  learn because of various obvious reasons. As I tried the
                  interface it was very powerful and it helped me a lot in
                  learning many stotras. I suggest everyone should check it out.
                </Text>
                <ImageBackground
                  source={require("../../assets/left-quote.png")}
                  style={styles.carousel_background_image}
                />
              </View>
            </View>

            <View style={styles.carousel}>
              <View style={[styles.carousel_image, styles.shadowProp]}>
                <Image
                  source={require("../../assets/casual-college-connection-1438081.png")}
                  style={styles.carousel_slider_image}
                />
              </View>

              <View style={[styles.carousel_content, styles.shadowProp]}>
                <ImageBackground
                  source={require("../../assets/left-quote.png")}
                  style={styles.carousel_background_image}
                />
                <Text style={styles.carousel_content_text}>
                  I used this interface for our Group project for literature
                  review. One thing was we could easily segregate our research
                  papers in one place under proper named folders. Sharing our
                  thoughts and retaining the important learnings really added
                  value. We started out just to complete our project but the
                  things that I learned doing it with Tanzabooks made me retain
                  those learnings permanently in my mind. Those discussions got
                  stuck with me forever. I don’t think any video or tool out
                  there can deliver anything like this.
                </Text>
              </View>
            </View>
          </Swiper>
          {/* <View style={styles.pills}>
             <TouchableOpacity style={styles.dot}></TouchableOpacity>
             <TouchableOpacity style={styles.dot}></TouchableOpacity>
          </View> */}
        </View>
      </View>
      <Footer />
    </>
  );
};
export default NewHome;

const styles = StyleSheet.create({
  container: {
    marginTop: wp(100) < 425 ? 0 : wp(3),
    backgroundColor: "white",
    paddingBottom: 20,
  },
  intro_content: {
    width: "100%",
    flexDirection: wp(100) < 425 ? "column-reverse" : "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    gap: wp(100) < 425 ? wp(7) : wp(2),
    marginTop: wp(100) < 425 ? 20 : 40,
  },
  intro_content_text: {
    width: wp(100) < 425 ? "98%" : "40%",
    gap: 15,
    marginTop: wp(100) < 425 ? hp(2) : 0,
    alignItems: wp(100) < 425 ? "center" : "flex-start",
    justifyContent: wp(100) < 425 ? "center" : "flex-start",
  },
  intro_content_image: {
    width: wp(100) < 425 ? "98%" : "40%",
    gap: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  SmallTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  line: {
    borderWidth: 1,
    borderColor: colors.primary,
    width: 80,
    height: 2.5,
    backgroundColor: colors.primary,
  },
  SmallTitle_text: {
    fontSize: 12,
    color: "grey",
    lineHeight: 20,
    fontFamily: "OpenSans_Light",
  },
  heading: {
    width: "80%",
  },
  heading_text: {
    fontSize: 35,
    fontFamily: "OpenSans_Bold",
  },
  content: {
    width: "95%",
  },
  button_box: {
    flexDirection: wp(100) < 425 ? "column" : "row",
    gap: 30,
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 7,
    marginTop: 30,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  btn_text: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    color: "white",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: wp(100) < 425 ? 200 : 380,
    height: wp(100) < 425 ? 150 : 270,
    resizeMode: "stretch",
  },
  featureBox: {
    width: wp(100) < 425 ? "98%" : "70%",
    alignSelf: "center",
    marginTop: wp(100) < 425 ? hp(3) : hp(12),
    flexDirection: wp(100) < 425 ? "column" : "row",
    gap: 10,
    alignItems: wp(100) < 425 ? "center" : "flex-start",
    justifyContent: wp(100) < 425 ? "center" : "flex-start",
  },
  feature_text: {
    width: wp(100) < 425 ? "100%" : "40%",
    alignItems: wp(100) < 425 ? "center" : "flex-start",
    justifyContent: wp(100) < 425 ? "center" : "flex-start",
  },
  feature_heading: {
    width: "70%",
  },
  feature_heading_text: {
    fontSize: 27,
    fontWeight: "600",
    textAlign: wp(100) < 425 ? "center" : "left",
  },
  feature_heading_small_text: {
    width: wp(100) < 425 ? "70%" : "60%",
    marginTop: 15,
  },
  feature_heading_small_text_content: {
    fontSize: 14,
    color: "grey",
    lineHeight: 18,
  },
  card: {
    width: wp(100) < 425 ? "90%" : "30%",
    height: wp(100) < 425 ? "20%" : hp(45),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  feature_image: {
    width: wp(100) < 425 ? "90%" : "70%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: wp(100) < 425 ? "column" : "row",
    gap: 20,
    flexWrap: wp(100) < 425 ? null : "wrap",
    marginTop: wp(100) < 425 ? hp(25) : 0,
    marginBottom: wp(100) < 425 ? 20 : 0,
  },
  cardIcon: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  cardIconImage: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  card_heading: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    zIndex: 10,
  },
  card_icon_smalltext: {
    width: "90%",
    textAlign: wp(100) < 425 ? "center" : "left",
    // alignItems:wp(100) < 425 ?  'center' : 'flex-start',
    // justifyContent:wp(100) < 425  ?  'center'  : 'flex-start'
  },
  cardIcon_smalltext_align: {
    textAlign: "center",
  },
  presentaion_image: {
    width: wp(100) < 425 ? wp(55) : 380,
    height: wp(100) < 425 ? hp(50) : 270,
    resizeMode: "contain",
  },
  intro_content_image_presentation: {
    width: wp(100) < 425 ? "100%" : "70%",
    alignItems: "center",
    justifyContent: "center",
  },
  bluebox: {
    marginTop: wp(100) < 425 ? 20 : 100,
    width: "100%",
    // height: 170,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  bluebox_content: {
    width: wp(100) < 425 ? "100%" : "50%",
    height: "80%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: colors.primary,
  },
  bluebox_content_text: {
    fontSize: 25,
    fontWeight: "700",
    color: "white",
  },
  bluebox_line: {
    width: 30,
    height: 2,
    backgroundColor: "white",
  },
  bluebox_text: {
    color: "white",
  },
  intro_content_radio: {
    width: "90%",
    marginTop: 80,
  },
  button_box_teacher: {
    marginTop: 30,
    gap: 15,
    alignItems: wp(100) < 425 ? "center" : "flex-start",
  },
  teacherIcon: {
    width: "100%",
    alignItems: wp(100) < 425 ? "center" : "flex-start",
    justifyContent: wp(100) < 425 ? "center" : "flex-start",
  },
  btn_card_text: {
    fontSize: 20,
    fontWeight: "600",
  },
  slider: {
    width: wp(100) < 425 ? "98%" : "72.5%",
    height: wp(100) < 425 ? hp(92) : 380,
    alignSelf: "center",
    marginTop: wp(100) < 425 ? hp(4) : 100,

    // alignItems:wp(100) < 425 ? 'center'  : 'flex-start',
    // justifyContent:wp(100) < 425 ? 'center'  : 'flex-start'
  },
  slider_title: {
    flexDirection: "row",
    width: "20%",
    alignSelf: "center",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  slider_text: {
    color: "grey",
    fontSize: 9,
  },
  carousel: {
    width: "100%",
    marginTop: 40,
    flexDirection: wp(100) < 425 ? "column" : "row",
    // flexWrap:'wrap',
    gap: 20,
    alignItems: "center",
    marginLeft: wp(100) < 425 ? null : wp(4),
  },
  carousel_image: {
    height: 220,
    width: 180,
    borderRadius: 5,
    marginLeft: wp(100) < 425 ? "" : 10,
  },
  carousel_content: {
    width: wp(100) < 425 ? "90%" : "70%",
    height: wp(100) < 425 ? 230 : 180,
    borderRadius: 5,
    padding: 20,
  },

  // made some changes
  carousel_background_image: {
    position: "absolute",
    width: 85,
    height: 70,
    resizeMode: "contain",
    alignSelf: "center",
    opacity: 0.4,
    marginTop: wp(100) < 425 ? wp(15) : wp(2),
  },
  carousel_content_text: {
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "OpenSans_Ittalic",
    color: "grey",
  },
  pills: {
    width: 100,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 20,
    marginTop: 30,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 50,
    borderWidth: 1,
  },
  carousel_slider_image: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  butterfly: {
    width: wp(55),
    height: hp(70),
    left: wp(25),
    bottom: wp(20),
    resizeMode: "stretch",
    position: "absolute",
    display: wp(100) < 425 ? "none" : "flex",
  },
});
