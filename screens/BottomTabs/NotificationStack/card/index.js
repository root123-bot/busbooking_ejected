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
import { useNavigation } from "@react-navigation/native";

export default function Card({ isNew }) {
  const navigation = useNavigation();

  const color = isNew ? "black" : "grey";
  return (
    <Pressable
      style={{
        paddingHorizontal: 10,
      }}
      onPress={() => navigation.navigate("ViewNotification")}
    >
      <View
        style={{
          position: "relative",
          //   flexDirection: "row",
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
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "60%",
            }}
          >
            <RNPaper.Text
              style={{
                fontSize: 17,
                color,
                fontFamily: "montserrat-17",
              }}
              numberOfLines={1}
            >
              Booked successful
            </RNPaper.Text>
          </View>
          <View
            style={
              {
                //   alignItems: "flex-end",
              }
            }
          >
            <View
              style={{
                marginRight: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <RNPaper.Text
                style={{
                  //   fontFamily: "overpass-reg",
                  marginRight: 5,
                  fontSize: 13,
                  color,
                }}
              >
                2 months
              </RNPaper.Text>
              <MaterialCommunityIcons size={20} name="chevron-right" color />
            </View>
          </View>
        </View>
        <View
          style={{
            width: "90%",
            //   backgroundColor: "red",
          }}
        >
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
      </View>
      <CustomLine
        style={{
          marginBottom: 0,
        }}
      />
    </Pressable>
  );
}
