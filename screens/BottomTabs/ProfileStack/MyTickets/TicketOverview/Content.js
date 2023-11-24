import React, { memo } from "react";
import { View, Text } from "react-native";
import * as RNPaper from "react-native-paper";
import { COLORS } from "../../../../../constants/colors";

function CardMainContent({ top, isTicketDetails }) {
  return (
    <View
      style={{
        position: "absolute",
        top: top ? top : 60,
        left: 0,
        width: "100%",
        height: 100,
        padding: 10,
        paddingHorizontal: isTicketDetails ? 5 : 15,
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
  );
}

export default memo(CardMainContent);
