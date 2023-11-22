import React, { memo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import ScreenHeader from "../ScreenHeader";
import { COLORS } from "../../../../../constants/colors";
import { Button } from "react-native-paper";
import Details from "./Details";

function TicketDetails({ route }) {
  return (
    <View
      style={{
        position: "relative",
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <View style={[styles.container]}>
        <ScreenHeader title={"Ticket Details"} />
        <ScrollView
          style={{
            padding: 15,
            paddingTop: 0,
            flex: 1,
          }}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            marginBottom: 50, // this is width of lower download button so we make sure our scrollview does not take any space of button it should remain in available space, also it automatically does not take the space of top header so its look fine
          }}
        >
          <Details />
        </ScrollView>
      </View>
      <View
        style={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          left: 0,
          backgroundColor: "#E5E5E5",
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
            paddingHorizontal: 20,
            borderTopColor: "grey",
            borderTopWidth: 0.5,
          }}
        >
          <Button
            mode="contained"
            style={{
              width: "100%",
              backgroundColor: COLORS.darkprimary,
              borderRadius: 20,
            }}
          >
            Download
          </Button>
        </View>
      </View>
    </View>
  );
}

export default memo(TicketDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
