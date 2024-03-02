import React, { memo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CustomLine } from "../../../../components/ui";
import { COLORS } from "../../../../constants/colors";
import { Button } from "react-native-paper";
import { Image } from "react-native";
import * as RNPaper from "react-native-paper";

export default function ViewNotification() {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginVertical: "2%",
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: "overpass-reg",
              color: "grey",
            }}
          >
            From: System
          </Text>
          <Text
            style={{
              fontFamily: "overpass-reg",
              color: "grey",
            }}
          >
            To: me
          </Text>
          <Text
            style={{
              fontFamily: "overpass-reg",
              color: "grey",
            }}
          >
            Date: 12/01/2023
          </Text>
        </View>
        <TouchableOpacity>
          <Text
            style={{
              fontFamily: "montserrat-17",
              color: COLORS.danger,
            }}
          >
            Delete
          </Text>
        </TouchableOpacity>
      </View>
      <CustomLine />
      <View
        style={{
          marginVertical: "2%",
        }}
      >
        <RNPaper.Text
          style={{
            // fontFamily: "montserrat-15",
            fontSize: 20,
            marginBottom: 5,
            textTransform: "capitalize",
            fontWeight: "500",
            color: COLORS.blackGray,
          }}
        >
          {"Ticket booked successful"}
        </RNPaper.Text>
        <Text
          style={{
            fontFamily: "overpass-reg",
            color: COLORS.darkGray,
            fontSize: 16,
          }}
        >
          {/* Your orderof this id {notification.order_id} has been rejected by the
      restaurant. Please click below here to check the order details. */}
          {
            "Hello, you've been successfully booked for ticket on this 13:00 of 13/03/2024, we'll would like to wish you a safe trip. Click down below to view ticket details"
          }
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
});
