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

const { height } = Dimensions.get("window");
const ticketHeight = height * 0.62;

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
          <Text>Hello</Text>
        </View>
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
            <Barcode value="Hello World" format="CODE128" />;
          </Text>
        </View>
      </View>
    </View>
  );
}

export default memo(Details);
