import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { COLORS } from "../../../../constants/colors";
import * as RNPaper from "react-native-paper";
import { CustomLine } from "../../../../components/ui";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
export default function PreviewNotification({ isNew }) {
  const color = isNew ? "black" : "grey";
  return (
    <Pressable
      style={{
        paddingHorizontal: 10,
      }}
    >
      <View
        style={{
          position: "relative",
          flexDirection: "row",
          width: "100%",
          paddingVertical: 13,
        }}
      >
        {isNew && (
          <View
            style={{
              position: "absolute",
              bottom: 15,
              right: 15,
            }}
          >
            <Text
              style={{
                color: COLORS.danger,
              }}
            >
              ●
            </Text>
          </View>
        )}

        <View
          style={{
            width: "85%",
            //   backgroundColor: "red",
          }}
        >
          <RNPaper.Text
            style={{
              fontSize: 17,
              color,
              fontFamily: "montserrat-17",
            }}
          >
            Booked successful
          </RNPaper.Text>
          <RNPaper.HelperText
            padding="none"
            style={{
              fontSize: 14,
              lineHeight: 15,
              color,
            }}
            numberOfLines={2}
          >
            Your payment for booking of ticket has been made successful
          </RNPaper.HelperText>
        </View>
        <View
          style={{
            width: "15%",
            alignItems: "flex-end",
          }}
        >
          <View
            style={{
              marginRight: 10,
            }}
          >
            <MaterialCommunityIcons size={20} name="chevron-right" color />
          </View>
        </View>
      </View>
      <CustomLine
        style={{
          marginBottom: 0,
        }}
      />
    </Pressable>
  );
}
