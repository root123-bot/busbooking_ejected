import React, { memo } from "react";
import { View, Text, Platform, Image, ImageBackground } from "react-native";
import * as RNPaper from "react-native-paper";
import { COLORS } from "../../../../constants/colors";

function TicketOverview() {
  return (
    <View
      style={{
        width: "100%",
        marginBottom: 15,
      }}
    >
      <View
        style={{
          width: "100%",
          height: 160,
          backgroundColor: COLORS.light,
          borderRadius: 10,

          shadowOffset: {
            width: 0,
            height: 2,
          },
          elevation: 0.7,
          shadowOpacity: 0.1,
          shadowRadius: 4.84,
          position: "relative",
        }}
      >
        <ImageBackground
          source={require("../../../../assets/images/background/ticket-bg/back3.jpeg")}
          style={{
            width: "100%",
            height: "100%",
          }}
          imageStyle={{
            opacity: 0.6,
          }}
        >
          {/* circle shapes */}
          <View
            style={{
              position: "absolute",
              top: 40,
              left: -10,
              width: 20,
              height: 20,
              backgroundColor: COLORS.background,
              borderRadius: 10,
            }}
          ></View>
          <View
            style={{
              position: "absolute",
              top: 40,
              right: -10,
              width: 20,
              height: 20,
              backgroundColor: COLORS.background,
              borderRadius: 10,
            }}
          ></View>
          {/* end of circle shapes */}
          {/* line divider */}
          <View
            style={{
              position: "absolute",
              top: 50,
              left: 10,
              width: "100%",
              borderBottomColor: COLORS.background,
              borderBottomWidth: 3,
              borderStyle: Platform.OS === "android" ? "dashed" : "solid",
            }}
          ></View>
          {/* the end of line divider */}
          <View
            style={{
              position: "absolute",
              top: 5,
              left: 0,
              width: "100%",
              height: 40,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 15,
            }}
          >
            <View
              style={{
                backgroundColor: "#E9ECEF",
                paddingLeft: 5,
                paddingRight: 5,
                paddingVertical: 2,
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  // fontFamily: "overpass-reg",
                  color: COLORS.primary,
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                2 MORE DAYS
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../../../assets/images/tour-bus.png")}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
              <RNPaper.Text
                style={{
                  fontWeight: Platform.OS === "ios" ? "500" : "600",
                  color: "grey",
                  fontSize: 13,
                  marginLeft: 5,
                }}
              >
                Hiace28
              </RNPaper.Text>
            </View>
          </View>
          {/* this is second square down below remember we have the full component of 160, the above component use almost 60 width, so we remained with 100px width 
        so we covered all available space we dont have another space left */}
          <View
            style={{
              position: "absolute",
              top: 60,
              left: 0,
              width: "100%",
              height: 100,
              padding: 10,
              paddingHorizontal: 15,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                width: "33%",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                <RNPaper.Text
                  numberOfLines={1}
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  20:20 PM
                </RNPaper.Text>
                <RNPaper.Text
                  numberOfLines={1}
                  style={{
                    color: "grey",
                    fontSize: 11,
                  }}
                >
                  12 Dec 2022
                </RNPaper.Text>
                <RNPaper.Text
                  numberOfLines={2}
                  style={{
                    marginTop: 3,
                    fontSize: 16,
                    color: COLORS.darkGray,
                    textAlign: "left",
                  }}
                >
                  Ubungo Bus Terminal
                </RNPaper.Text>
              </View>
            </View>
            <View
              style={{
                width: "30%",
              }}
            >
              <View
                style={{
                  width: "100%",
                  position: "relative",
                }}
              >
                {/* the first dot */}
                <View
                  style={{
                    position: "absolute",
                    top: -1,
                    left: 0,
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: "grey",
                  }}
                ></View>
                {/* the line */}
                <View
                  style={{
                    borderBottomWidth: 2,
                    borderBottomColor: "grey",
                    width: "100%",
                  }}
                ></View>
                {/* the right dot */}
                <View
                  style={{
                    position: "absolute",
                    top: -1,
                    right: 0,
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: "grey",
                  }}
                ></View>
                {/* top text */}
                <View
                  style={{
                    width: "100%",
                    position: "absolute",
                    top: Platform.OS === "ios" ? -18 : -20,
                    left: 0,
                  }}
                >
                  <Text
                    style={{
                      color: "grey",
                      fontFamily: "overpass-reg",
                      textAlign: "center",
                      fontSize: 13,
                    }}
                  >
                    2h 5m
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    position: "absolute",
                    top: Platform.OS === "ios" ? 2 : 1,
                    left: 0,
                  }}
                >
                  <Text
                    style={{
                      color: "grey",
                      fontFamily: "overpass-reg",
                      textAlign: "center",
                      fontSize: 13,
                    }}
                  >
                    Direct
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                width: "33%",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                <RNPaper.Text
                  numberOfLines={1}
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  06:20 PM
                </RNPaper.Text>
                <RNPaper.Text
                  numberOfLines={1}
                  style={{
                    color: "grey",
                    fontSize: 11,
                  }}
                >
                  14 Dec 2022
                </RNPaper.Text>
                <RNPaper.Text
                  numberOfLines={2}
                  style={{
                    marginTop: 3,
                    fontSize: 16,
                    color: COLORS.darkGray,
                    textAlign: "right",
                  }}
                >
                  Magufuli Bus Terminal
                </RNPaper.Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}

export default memo(TicketOverview);
