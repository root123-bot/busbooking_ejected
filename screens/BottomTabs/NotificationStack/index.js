import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { memo, useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Button, HelperText } from "react-native-paper";
import { COLORS } from "../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import * as RNPaper from "react-native-paper";

function Notification({ navigation }) {
  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View
          style={{
            width: "100%",
            height: "15%",
            backgroundColor: COLORS.darkprimary,
            justifyContent: "flex-end",
            paddingBottom: 15,
          }}
        >
          <View>
            <View
              style={{
                width: "85%",
                marginLeft: "auto",
                marginRight: "auto",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <RNPaper.Text
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                    color: COLORS.light,
                    fontFamily: "montserrat-17",
                  }}
                >
                  Notifications
                </RNPaper.Text>
              </View>
            </View>
          </View>
        </View>
        {/* lets now render our notification here */}
        <View
          style={{
            width: "100%",
            height: "85%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "overpass-reg",
              fontSize: 20,
              color: "grey",
            }}
          >
            Login to view notifications
          </Text>
          <Button
            style={{
              marginVertical: 10,
            }}
            labelStyle={{
              fontFamily: "montserrat-17",
            }}
            contentStyle={{
              backgroundColor: COLORS.darkprimary,
            }}
            mode="contained"
            // onPress={() => navigation.navigate("Login")}
          >
            Login here
          </Button>
        </View>
      </View>
    </>
  );
}

export default memo(Notification);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
