import React, { useRef } from "react";
import { View, Animated, Text, Pressable } from "react-native";
import { COLORS } from "../../../../constants/colors";
import * as RNPaper from "react-native-paper";
import { CustomLine } from "../../../../components/ui";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";

export default function Card({ isNew, marginBottom }) {
  const navigation = useNavigation();
  const swippeableRef = useRef();

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-101, -100, -50, 0],
      outputRange: [1, 0, 0, 100],
    });

    const handleDeleteItem = () => {
    };

    return (
      <Animated.View
        style={[
          {
            transform: [{ translateX: trans }],
          },
        ]}
      >
        <Pressable onPress={handleDeleteItem}>
          <View
            style={{
              backgroundColor: COLORS.danger,
              height: 90,
              width: 90,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="delete-outline" size={30} color={"#fff"} />
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  const handleOnSwipeRightOpen = () => {};

  const handleOnSwipeRightClose = () => {};

  const color = isNew ? "black" : "grey";
  return (
    <Swipeable
      renderRightActions={renderRightActions}
      onSwipeableWillOpen={handleOnSwipeRightOpen}
      onSwipeableClose={handleOnSwipeRightClose}
      overshootRight={false}
      ref={swippeableRef}
    >
      <Pressable
        onPress={() => navigation.navigate("ViewNotification")}
        style={{
          marginBottom,
          height: 90,
          justifyContent: 'space-between'
        }}
      >
        <View
          style={{
            position: "relative",
            width: "100%",
            paddingVertical: 13,
            paddingHorizontal: 12,
          }}
        >
          {isNew && (
            <View
              style={{
                position: "absolute",
                bottom: 15,
                right: 25,
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
    </Swipeable>
  );
}
