import React, { memo } from "react";
import {
  View,
  Text,
  Platform,
  Image,
  ImageBackground,
  Pressable,
  Dimensions,
} from "react-native";
import { COLORS } from "../../../../../constants/colors";
import Barcode from "react-native-barcode-builder";
import * as RNPaper from "react-native-paper";
import CardMainContent from "../TicketOverview/Content";

const { height } = Dimensions.get("window");
const ticketHeight = height * 0.62;
const top = 5;

function computeSpacing() {
  if (height > 820) {
    return {
      marginTop: 20,
      top: 110,
    };
  }
  if (height < 820 && height > 800) {
    return {
      marginTop: 15,
      top: 110,
    };
  }

  if (height < 820 && height > 780) {
    return {
      marginTop: 5,
      top: 105,
    };
  }

  if (height < 780 && height > 750) {
    return {
      marginTop: 0,
      top: 100,
    };
  }

  if (height < 750 && height > 700) {
    return {
      marginTop: 0,
      top: 90,
    };
  }

  if (height < 700 && height > 680) {
    return {
      marginTop: 0,
      top: 80,
    };
  }

  // for the height < 680 i think we should top ticket header having ticketId, busname and underline
  // i will then test this on small screen to see how it behave..
  if (height < 681) {
    return {
      marginTop: 0,
      top: 80,
    };
  }
}

function Details() {
  return (
    <View
      style={{
        width: "100%",
      }}
    >
      <View
        style={{
          width: "100%",
          height: ticketHeight,
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
        {/* first circle */}
        <View
          style={{
            position: "absolute",
            top: ticketHeight * 0.7,
            left: -10,
            width: 20,
            height: 20,
            backgroundColor: COLORS.background,
            borderRadius: 10,
          }}
        ></View>
        {/* second circle */}
        <View
          style={{
            position: "absolute",
            top: ticketHeight * 0.7,
            right: -10,
            width: 20,
            height: 20,
            backgroundColor: COLORS.background,
            borderRadius: 10,
          }}
        ></View>
        {/* line divider */}
        <View
          style={{
            position: "absolute",
            top: ticketHeight * 0.7 + 10,
            left: 10,
            width: "100%",
            borderBottomColor: COLORS.background,
            borderBottomWidth: Platform.OS === "android" ? 3 : 2,
            borderStyle: Platform.OS === "android" ? "dashed" : "solid",
          }}
        ></View>
        {/* the end of line divider */}
        {/* the first view to have the content of first big box */}
        <ImageBackground
          style={{
            position: "absolute",
            top: 5,
            left: 0,
            width: "100%",
            height: ticketHeight * 0.69,
          }}
          imageStyle={{
            opacity: 1,
          }}
          source={require("../../../../../assets/images/background/ticket-bg/back4.jpeg")}
        >
          <View
            style={{
              paddingHorizontal: 15,
              marginTop: 7,
            }}
          >
            {/* this view should go to hell if we have height < 680 */}
            {height > 680 && (
              <View>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "grey",
                      }}
                    >
                      #EID8329...
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={require("../../../../../assets/images/tour-bus.png")}
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
                </View>
                {/* below line */}
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    borderWidth: 1,
                    marginTop: 5,
                    borderColor: COLORS.grayWhite,
                  }}
                ></View>
              </View>
            )}
            <View>
              <CardMainContent top={top} isTicketDetails />
              {/* then we have above top=5 then the above card takes up to the 100 height
              so we expect the total of 105 space height to be occupied, lets have another data
              at the position starting from 110, lets go.. POINT OF NOTE HERE AS YOU SEE WE HARDCODED
              THE HEIGHT AND POSITON TOP because as we tell we made sure the CardMainContent occupy the
              100px so its okay to hardcode here to start with 110 */}
              <View
                style={{
                  position: "absolute",
                  top: computeSpacing().top,
                  left: 0,
                  width: "100%",
                  paddingHorizontal: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      width: "60%",
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.darkGray,
                        fontSize: 13,
                        fontFamily: "overpass-reg",
                      }}
                    >
                      Booked By
                    </Text>
                    <Text numberOfLines={2} style={{}}>
                      PASCHAL CONSTANTINO NZWANGA
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "30%",
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.darkGray,
                        fontSize: 13,
                        fontFamily: "overpass-reg",
                        textAlign: "right",
                      }}
                    >
                      Booked Seats
                    </Text>
                    <Text
                      style={{
                        textAlign: "right",
                      }}
                    >
                      11, 13, 15, 21, 98, 81, 18, 21, 32, 52
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    marginTop: computeSpacing().marginTop,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: COLORS.darkGray,
                        fontSize: 13,
                      }}
                    >
                      Bus Primary Color
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={require("../../../../../assets/images/tour-bus.png")}
                        style={{
                          width: 20,
                          height: 20,
                        }}
                      />
                      <RNPaper.Text
                        style={{
                          fontWeight: Platform.OS === "ios" ? "500" : "600",
                          fontSize: 13,
                          marginLeft: 5,
                        }}
                      >
                        YELLOW
                      </RNPaper.Text>
                    </View>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: COLORS.darkGray,
                        fontSize: 13,
                        fontFamily: "overpass-reg",
                        textAlign: "right",
                      }}
                    >
                      Plate no.
                    </Text>
                    <Text
                      style={{
                        textAlign: "right",
                      }}
                    >
                      TZ9239
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "30%",
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.darkGray,
                        fontSize: 13,
                        fontFamily: "overpass-reg",
                        textAlign: "right",
                      }}
                    >
                      Bus name
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={{
                        textAlign: "right",
                      }}
                    >
                      KIPARA
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    marginTop: computeSpacing().marginTop,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: COLORS.darkGray,
                        fontSize: 13,
                      }}
                    >
                      Customer Care
                    </Text>
                    <Text>+255623317196</Text>
                    <Text>+255753752668</Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: COLORS.darkGray,
                        fontSize: 13,
                      }}
                    >
                      Net price
                    </Text>
                    <Text>Tsh 2,500,000/=</Text>
                  </View>
                  <View>
                    <Image
                      source={require("../../../../../assets/images/approved.jpeg")}
                      style={{
                        width: 55,
                        height: 55,
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
        {/* try to place something in qr code area */}
        <View
          style={{
            position: "absolute",
            top: ticketHeight * 0.7 + 25,
            left: 0,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 15,
          }}
        >
          <Text>
            <Barcode value="Hello World" format="CODE128" />
          </Text>
        </View>
      </View>
    </View>
  );
}

export default memo(Details);
