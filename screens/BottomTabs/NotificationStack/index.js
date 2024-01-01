import {
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { memo, useEffect, useState, useContext } from "react";
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
import { AppContext } from "../../../store/context";
import { HStack, Menu, Pressable } from "native-base";

function Notification({ navigation }) {
  const AppCtx = useContext(AppContext);

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
                  justifyContent: "space-between",
                }}
              >
                <RNPaper.Text
                  style={{
                    fontSize: 18,
                    color: COLORS.light,
                    fontFamily: "montserrat-17",
                  }}
                >
                  Notifications
                </RNPaper.Text>
                {AppCtx.isAunthenticated && (
                  <Menu
                    w="190"
                    trigger={(triggerProps) => {
                      return (
                        <Pressable accessibilityLabel="More " {...triggerProps}>
                          <FontAwesome5
                            name="ellipsis-h"
                            size={24}
                            color="white"
                          />
                        </Pressable>
                      );
                    }}
                  >
                    <Menu.Item>
                      <HStack alignItems={"center"} width={"100%"}>
                        <Ionicons
                          name="trash"
                          size={16}
                          color={COLORS.danger}
                        />
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: "overpass-reg",
                            marginLeft: 5,
                            marginTop: 3,
                            color: COLORS.danger,
                          }}
                        >
                          Delete all
                        </Text>
                      </HStack>
                    </Menu.Item>
                  </Menu>
                )}
              </View>
            </View>
          </View>
        </View>
        {/* lets now render our notification here */}
        {!AppCtx.isAunthenticated ? (
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
              onPress={() =>
                navigation.navigate("Login", {
                  next: "notificationcenter",
                })
              }
            >
              Login here
            </Button>
          </View>
        ) : (
          <></>
        )}
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
