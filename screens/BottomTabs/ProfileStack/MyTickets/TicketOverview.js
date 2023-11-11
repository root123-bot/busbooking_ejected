import React, { memo } from "react";
import { View, Text, Platform } from "react-native";
import * as RNPaper from "react-native-paper";
import { COLORS } from "../../../../constants/colors";

function TicketOverview() {
  return (
    <View
      style={{
        width: "100%",
      }}
    >
      <View
        style={{
          width: "100%",
          height: 200,
          backgroundColor: COLORS.light,
          borderRadius: 10,

          shadowOffset: {
            width: 0,
            height: 2,
          },
          elevation: 0.7,
          shadowOpacity: 0.03,
          shadowRadius: 4.84,
          position: "relative",
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
                color: "#00B4D8",
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              2 MORE DAYS
            </Text>
          </View>
          <View>
            <RNPaper.Text>#HIACE28</RNPaper.Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default memo(TicketOverview);
