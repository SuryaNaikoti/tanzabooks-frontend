import * as Sentry from "@sentry/browser";
import React, { Component } from "react";
import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  Popup,
  AreaHighlight,
} from "react-pdf-highlighter";
import { colors, hp, wp } from "../utils";
import type { IHighlight, NewHighlight } from "react-pdf-highlighter";
import { Recorder } from "react-voice-recorder";
import "react-voice-recorder/dist/index.css";
import { testHighlights as _testHighlights } from "./test-highlights";
import { Spinner } from "./Spinner";
import { Sidebar } from "./Sidebar";
import api from "../utils/api";

import "./style/App.css";
import { API_BASE_URL, NETWORK_URL } from "../utils/config";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollViewBase,
  Text,
  Modal as RNModal,
  TouchableWithoutFeedback,
} from "react-native";
import Modal from "react-native-modal";
import { audioRecording } from "../reduxStore/actions";
import { connect } from "react-redux";
import { AnnotatorBox } from "../components/AnnotatorBox";
import { usePreventScreenCapture } from "expo-screen-capture";
import { Feather } from "@expo/vector-icons";

const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

interface State {
  url: string;
  highlights: Array<IHighlight>;
  uploadLoader: any;
  setAnnotationId: any;
  // setLoading: boolean;
}

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; emoji: string };
}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

class App extends Component<{ props: any }, State> {
  // constructor(){
  //   super(this.props);
  //   this.state={

  //   }
  // }

  state = {
    url: this.props.url,
    highlights: testHighlights[this.props.url]
      ? [...testHighlights[this.props.url]]
      : [],
    uploadType: null,
    audioDetails: {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: 0,
        m: 0,
        s: 0,
      },
    },
    setAudioFile: "",
    recordedFile: "",
    annotation_id: "",
    fileAnnotations: "",
    play: false,
    v3: "",
    mp3: "",
    viewModal: false,
    setModal: false,
    setAudio: "",
    uploadLoader: false,
    setAnnotationId: "",
    // setLoading: false,
  };

  uploadRef = React.createRef();

  resetHighlights = () => {
    this.setState({
      highlights: [],
    });
  };

  toggleDocument = () => {
    this.setState({
      url: this.props.url,
      highlights: testHighlights[newUrl] ? [...testHighlights[newUrl]] : [],
    });
  };

  scrollViewerTo = (highlight: any) => {};

  scrollToHighlightFromHash = () => {
    const highlight = this.getHighlightById(parseIdFromHash());

    if (highlight) {
      this.scrollViewerTo(highlight);
    }
  };

  componentDidMount() {
    console.log("User", this.props.user?.userDetails?.name);
    window.addEventListener(
      "hashchange",
      this.scrollToHighlightFromHash,
      false
    );
    setTimeout(() => {
      this.getAnnotations();
    }, 1000);
  }

  componentDidUpdate(
    prevProps: Readonly<{ props: any }>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    if (prevProps.audio !== this.props.audio) {
      console.log(audio, "AUDIO ===>");
    }
    if (this.state.setModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }

  getAnnotations() {
    const tanzabook_id = localStorage.getItem("tanzabook_id");
    api
      .get(`${NETWORK_URL}/tanzabook/${tanzabook_id}`, {
        headers: {
        },
      })
      .then((result) => {
        console.log("Annotatino Result", result);
        if (result.status === 200) {
          let v2 = result.data.data.annotations.data.map((x: any) => {
            return {
              content: {
                text: x?.comment,
              },
              position: {
                boundingRect: {
                  pageNumber: x?.position?.pageNumber,
                  x1: parseFloat(x?.position?.boundingRect.x1),
                  y1: parseFloat(x?.position?.boundingRect.y1),
                  x2: parseFloat(x?.position?.boundingRect.x2),
                  y2: parseFloat(x?.position?.boundingRect.y2),
                  width: parseFloat(x?.position?.boundingRect.width),
                  height: parseFloat(x?.position?.boundingRect.height),
                },
                rects: [
                  {
                    pageNumber: x?.position?.rects[0].pageNumber,
                    x1: parseFloat(x?.position?.rects[0].x1),
                    y1: parseFloat(x?.position?.rects[0].y1),
                    x2: parseFloat(x?.position?.rects[0].x2),
                    y2: parseFloat(x?.position?.rects[0].y2),
                    width: parseFloat(x?.position?.rects[0].width),
                    height: parseFloat(x?.position?.rects[0].height),
                  },
                  {
                    pageNumber: x?.position?.rects[1].pageNumber,
                    x1: parseFloat(x?.position?.rects[1].x1),
                    y1: parseFloat(x?.position?.rects[1].y1),
                    x2: parseFloat(x?.position?.rects[1].x2),
                    y2: parseFloat(x?.position?.rects[1].y2),
                    width: parseFloat(x?.position?.rects[1].width),
                    height: parseFloat(x?.position?.rects[1].height),
                  },
                ],
                pageNumber: parseFloat(x?.position?.pageNumber),
              },
              comment: {
                text: x?.comment,
                audio: x?.audio,
                user_id: x?.user_id,
              },
              id: x?.id.toString(),
            };
          });

          this.setState({
            highlights: v2,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        Sentry.captureEvent(error);
      });
  }

  getHighlightById(id: string) {
    const { highlights } = this.state;

    return highlights.find((highlight) => highlight.id === id);
  }

  tanzabook_id = localStorage.getItem("tanzabook_id");

  addHighlight(highlight: T_NewHighlight) {
    this.props.setLoading(true);
    const { highlights } = this.state;

    console.log("Saving highlight", highlight);

    var id = getNextId();

    api
      .post(
        `${NETWORK_URL}/annotation`,
        {
          tanzabook_id: this.tanzabook_id,
          annotation_json: {
            content: {
              text: highlight?.content?.text,
            },
            position: {
              boundingRect: {
                pageNumber: highlight?.position?.pageNumber,
                x1: highlight?.position?.boundingRect?.x1,
                y1: highlight?.position?.boundingRect?.y1,
                x2: highlight?.position?.boundingRect?.x2,
                y2: highlight?.position?.boundingRect?.y2,
                width: highlight?.position?.boundingRect?.width,
                height: highlight?.position?.boundingRect?.height,
              },
              rects: [
                {
                  pageNumber: highlight?.position?.pageNumber,
                  x1: highlight?.position?.rects[0]?.x1,
                  y1: highlight?.position?.rects[0]?.y1,
                  x2: highlight?.position?.rects[0]?.x2,
                  y2: highlight?.position?.rects[0]?.y2,
                  width: highlight?.position?.rects[0]?.width,
                  height: highlight?.position?.rects[0]?.height,
                },
                {
                  pageNumber: highlight?.position?.pageNumber,
                  x1: highlight?.position?.rects[0]?.x1,
                  y1: highlight?.position?.rects[0]?.y1,
                  x2: highlight?.position?.rects[0]?.x2,
                  y2: highlight?.position?.rects[0]?.y2,
                  width: highlight?.position?.rects[0]?.width,
                  height: highlight?.position?.rects[0]?.height,
                },
              ],
              pageNumber: highlight?.position?.pageNumber,
            },
            comment: {
              audio: this.state.recordedFile,
            },
            id: id,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log("annotation:", res);
        window.location.reload();
        this.props.setLoading(false);
      })
      .catch((err) => {
        console.log(err?.response?.data);
        Sentry.captureEvent(err);
        this.props.setLoading(false);
      });
  }

  updateHighlight(highlightId: string, position: Object, content: Object) {
    console.log("Updating highlight", highlightId, position, content);
    this.setState({
      highlights: this.state.highlights.map((h) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
              id,
              position: { ...originalPosition, ...position },
              content: { ...originalContent, ...content },
              ...rest,
            }
          : h;
      }),
    });
  }

  handleAudioStop(data: any) {
    this.setState({ audioDetails: data });
  }
  async handleAudioUpload(file: any, content: any, position: any, comment: any) {
    console.log("Content", content, position, comment);

    if (!file) return;

    let formData = new FormData();
    this.props.setLoading(true);
    this.setState({ uploadLoader: true });
    console.log(file, "file");
    console.log(content, "content");
    console.log(position, "position");
    console.log(comment, "comment");

    formData.append("file", file);
    formData.append("type", "audio");

    try {
      const result = await api.post("/upload", formData);

      if (result.status === 201) {
        console.log(result, "audioFile");
        this.setState({
          recordedFile: result.data.data.id,
          annotation_id: result?.data?.data?.id,
        });
        setTimeout(() => {
          this.addHighlight({ content, position, comment });
        }, 1000);
      }
    } catch (error: any) {
      console.log("UPLOAD ERROR FULL:", error.response);
      Sentry.captureEvent(error);
    } finally {
      this.setState({ uploadLoader: false });
      this.props.setLoading(false);
    }
  }
  handleReset() {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: 0,
        m: 0,
        s: 0,
      },
    };
    this.setState({ audioDetails: reset });
  }

  handleUploadType(type: any) {
    if (type === "upload") {
      document.getElementById("upload-type").style.display = "block";
      document.getElementById("record-type").style.display = "none";
    }
    if (type === "record") {
      document.getElementById("upload-type").style.display = "none";
      document.getElementById("record-type").style.display = "block";
    }
    this.setState({ uploadType: type, viewModal: true });
  }

  async handleUpload(content: any, position: any, comment: any) {
    console.log("Content", content, position, comment);
    
    if (!this.state.setAudioFile) return;

    this.props.setLoading(true);
    this.setState({ uploadLoader: true });
    let formData = new FormData();

    formData.append("file", this.state.setAudioFile);
    formData.append("type", "audio");

    try {
      const result = await api.post("/upload", formData);

      if (result.status === 201) {
        this.setState({
          recordedFile: result.data.data.id,
          annotation_id: result.data.data.id,
        });
        setTimeout(() => {
          this.addHighlight({ content, position, comment });
        }, 1000);
      }
    } catch (error: any) {
      console.log("UPLOAD ERROR FULL:", error.response);
      Sentry.captureEvent(error);
    } finally {
      this.setState({ uploadLoader: false });
      this.props.setLoading(false);
    }
  }

  togglePlay = (audio: any, type: any) => {
    console.log("Audio File", audio);
    let file: any;

    if (type === "play") {
      file = new Audio(audio);
      this.setState({ mp3: file });
    } else {
      file = this.state.mp3;
    }

    this.setState({ play: !this.state.play }, () => {
      this.state.play ? file.play() : file.pause();
    });
  };

  render() {
    const { url, highlights } = this.state;
    return (
      <div
        className="App"
        style={{
          display: "flex",
          flexDirection: "row",
          height: wp(100),
          width: "100%",
          marginTop: wp(100) < 425 ? 200 : 0,
        }}
      >
        {/* {console.log("Annotation", this.state.highlights)} */}
        {console.log("SetLoading", this.props)}

        <div
          style={{
            marginTop: wp(1),
          }}
        >
          <PdfLoader
            url={this.props.url}
            beforeLoad={<Spinner style={{ justifyContent: "center" }} />}
          >
            {(pdfDocument) => (
              <View
                style={{
                  minWidth: wp(100) < 500 ? 320 : wp(50),
                  marginRight: wp(100) < 500 ? 0 : -25,
                  marginTop: wp(100) <= 500 ? -200 : 0,
                  minHeight: wp(100) <= 500 ? 700 : wp(45),
                  margin: "auto",
                  overflow: "scroll",
                  overflowX: "hidden",
                  overflowY: "hidden",
                }}
              >
                <PdfHighlighter
                  pdfDocument={pdfDocument}
                  enableAreaSelection={(event) => event.altKey}
                  onScrollChange={resetHash}
                  scrollRef={(scrollTo) => {
                    this.scrollViewerTo = scrollTo;

                    this.scrollToHighlightFromHash();
                  }}
                  onSelectionFinished={(
                    position,
                    content,
                    hideTipAndSelection,
                    transformSelection
                  ) => (
                    <div>
                      <div className="btn dropdown">
                        <div
                          className="card"
                          style={{
                            // backgroundColor: "grey",
                            // margin: 10,
                            // padding: 10,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: 10,
                            width: "35%",
                          }}
                        >
                          <div className="form-group p-1 col-4">
                            <button
                              type="button"
                              className="btn"
                              onClick={() => this.handleUploadType("upload")}
                              style={{
                                backgroundColor: colors.primary,
                                border: "none",
                                color: "#fff",
                                padding: 7,
                                borderRadius: 6,
                              }}
                            >
                              <Feather
                                name="upload"
                                size={15}
                                color="#fff"
                                style={{ marginRight: 2 }}
                              />
                              Upload
                            </button>
                          </div>
                          <div className="form-group p-1 col-6">
                            <button
                              type="button"
                              className="btn"
                              onClick={() => this.handleUploadType("record")}
                              style={{
                                backgroundColor: "#01122e",
                                border: "none",
                                color: "#fff",
                                padding: 7,
                                borderRadius: 6,
                                // marginTop: 2,
                              }}
                            >
                              <Feather
                                name="mic"
                                size={15}
                                color="#fff"
                                style={{ marginRight: 2 }}
                              />
                              Record
                            </button>
                          </div>
                        </div>
                        <div
                          id="upload-type"
                          className="form-group"
                          style={{ display: "none" }}
                        >
                          <input
                            className="form-control mt-1 mb-2"
                            type="file"
                            name="audio"
                            accept="audio/*"
                            onChange={(e) =>
                              this.setState({ setAudioFile: e.target.files[0] })
                            }
                            style={{
                              padding: 10,
                              width: "60%",
                              color: "black",
                              backgroundColor: "#ffff",
                            }}
                          />
                          <button
                            type="button"
                            disabled={this.state.uploadLoader}
                            onClick={() =>
                              this.handleUpload(
                                content,
                                position,
                                this.state.uploadType
                              )
                            }
                            style={{
                              backgroundColor: colors.primary,
                              color: "#fff",
                              borderRadius: 5,
                              padding: 5,
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            {this.state.uploadLoader ? "Uploading..." : "save"}
                          </button>
                        </div>
                        <div id="record-type" style={{ display: "none" }}>
                          <Recorder
                            record={true}
                            title={
                              <View style={{}}>
                                <Text numberOfLines={2}>{content?.text}</Text>
                              </View>
                            }
                            audioURL={this.state.audioDetails.url}
                            showUIAudio={false}
                            handleAudioStop={(data: any) =>
                              this.handleAudioStop(data)
                            }
                            handleAudioUpload={(data: any) =>
                              this.handleAudioUpload(
                                data,
                                content,
                                position,
                                "test"
                              )
                            }
                            handleReset={() => this.handleReset()}
                            mimeTypeToUseWhenRecording={`audio/webm`} // For specific mimetype.
                          />
                        </div>
                        )
                      </div>
                    </div>
                  )}
                  highlightTransform={(
                    highlight,
                    index,
                    setTip,
                    hideTip,
                    viewportToScaled,
                    screenshot,
                    isScrolledTo
                  ) => {
                    const isTextHighlight = !Boolean(
                      highlight.content && highlight.content.image
                    );

                    const component = isTextHighlight ? (
                      <div>
                        <Highlight
                          onClick={() => {
                            // alert(highlight.comment?.audio);
                            this.setState({
                              setModal: true,
                              setAnnotationId: highlight?.id,
                              setAudio: highlight.comment?.audio,
                            });
                          }}
                          isScrolledTo={isScrolledTo}
                          position={highlight.position}
                          comment={highlight.comment?.text}
                          onMouseOver={() => {
                            this.togglePlay(
                              `${highlight?.comment?.audio}`,
                              "play"
                            );
                          }}
                          onMouseOut={() => {
                            this.togglePlay(
                              `${highlight?.comment?.audio}`,
                              "pause"
                            );
                          }}
                          className="Highlight__part"
                        />

                        {console.log(highlight?.comment?.audio)}
                      </div>
                    ) : (
                      <AreaHighlight
                        isScrolledTo={isScrolledTo}
                        highlight={highlight}
                        onChange={(boundingRect) => {
                          this.updateHighlight(
                            highlight.id,
                            { boundingRect: viewportToScaled(boundingRect) },
                            { image: screenshot(boundingRect) }
                          );
                        }}
                      />
                    );

                    return (
                      <Popup
                        popupContent={<HighlightPopup {...highlight} />}
                        onMouseOver={(popupContent) =>
                          setTip(highlight, (highlight) => popupContent)
                        }
                        onMouseOut={hideTip}
                        key={index}
                        children={component}
                      />
                    );
                  }}
                  highlights={highlights}
                />
              </View>
            )}
          </PdfLoader>
          <Modal
            style={{
              margin: 0,
              padding: 0,
              // backgroundColor: "transparent",
            }}
            animationIn="slideInRight"
            animationOut="slideOutRight"
            isVisible={this.state.setModal}
            backdropColor="white"
            backdropOpacity={0.2}
          >
            <TouchableWithoutFeedback
              onPress={() => this.setState({ setModal: false })}
            >
              <View style={{ backgroundColor: "transparent" }}>
                <AnnotatorBox
                  onClose={() => this.setState({ setModal: false })}
                  userName={this.props.user?.userDetails?.name}
                  audio={this.state.setAudio}
                  id={this.state.setAnnotationId}
                />
                {/* <Text>Mahidnra</Text> */}
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </div>

        <Modal
          style={{ margin: 0, padding: 0 }}
          animationIn="slideInRight"
          animationOut="slideOutRight"
          isVisible={this.props.modalVisible}
        >
          <View style={[styles.centeredRightView]}>
            <View style={[styles.modalRightView]}>
              <ScrollView style={{ maxHeight: hp(80) }}>
                <>
                  <View
                    style={{
                      width: "100%",
                      marginTop: 10,
                    }}
                  >
                    <View
                      style={{
                        marginTop: wp(100) < 425 ? 20 : 0,
                      }}
                    >
                      <Sidebar
                        width={150}
                        highlights={highlights}
                        resetHighlights={this.resetHighlights}
                        toggleDocument={this.toggleDocument}
                        v3={this.state.v3}
                      />
                    </View>
                  </View>
                </>
              </ScrollView>
            </View>
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 10,
                left: 10,
              }}
              onPress={() => {
                this.props.setModalVisible();
              }}
            >
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/271/271226.png",
                }}
                style={{
                  width: hp(3),
                  height: hp(3),
                  marginLeft: wp(85),
                  marginTop: 5,
                }}
                resizeMode={"contain"}
              />
            </TouchableOpacity>
          </View>
        </Modal>

        {wp(100) >= 768 && (
          <View style={{}}>
            <Sidebar
              width={25}
              highlights={this.state.highlights}
              resetHighlights={this.resetHighlights}
              toggleDocument={this.toggleDocument}
              v3={this.state.v3}
            />
          </View>
        )}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    audioRecording: (data) => dispatch(audioRecording(data)),
  };
}
function mapStateToProps(state) {
  return {
    audio: state.pathReducer,
    user: state.userReducer,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

const styles = StyleSheet.create({
  modalRightView: {
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderLeftColor: "white",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: wp(70),
    minHeight: hp(100),
  },
  centeredRightView: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  msgbox1: {
    width: wp(65),
    height: hp(64),
    justifyContent: "center",
    borderRadius: 20,
    marginLeft: wp(40),
    marginRight: wp(0.5),
    borderWidth: 1,
    backgroundColor: "white",
  },
  msgcontent1: {
    marginLeft: 70,
    marginTop: -35,
    fontSize: 10,
    flexWrap: "wrap",
  },
});
