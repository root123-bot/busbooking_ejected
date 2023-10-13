import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { memo, useMemo, useRef, useEffect } from "react";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Button, HelperText } from "react-native-paper";
import { Animation, CustomLine } from "./ui";
import { COLORS } from "../constants/colors";

export const ToastNotification = ({
  messageHeader,
  messageDescription,
  color,
}) => {
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={{
        top: 70,
        backgroundColor: `${color}`,
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 40,
        borderRadius: 5,
        padding: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        shadowColor: "#003049",
        shadowOpacity: 0.4,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
      }}
    >
      <Icon name="info" size={30} color="#f6f4f4" />
      <View>
        <Text
          style={{
            color: "#f6f4f4",
            fontWeight: "bold",
            marginLeft: 10,
            fontSize: 16,
          }}
        >
          {messageHeader}
        </Text>
        <Text
          style={{
            color: "#f6f4f4",
            fontWeight: "500",
            marginLeft: 10,
            fontSize: 14,
          }}
        >
          {messageDescription}
        </Text>
      </View>
    </Animated.View>
  );
};

export const TransparentPopUpIconMessage = ({
  messageHeader,
  icon,
  inProcess,
  textStyle,
}) => {
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <View>
        <View style={{ alignItems: "center" }}>
          {inProcess ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Icon name={icon} size={50} color="#f6f4f4" />
          )}
        </View>
        {!inProcess && (
          <Text
            style={[
              {
                fontFamily: "montserrat-17",
                color: "white",
              },
              textStyle,
            ]}
          >
            {messageHeader}
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

export const CustomizedLottieMessage = ({
  messageHeader,
  subHeader,
  lottieFile,
  buttonTitle,
  lottiestyle,
  buttonStyle,
  understandHandler,
}) => {
  const animationRef = useRef(null);
  useEffect(() => {
    animationRef.current?.play();
  });

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: "montserrat-17",
              color: COLORS.secondary,
              fontSize: 20,
              textAlign: "center",
              marginTop: "2%",
              marginBottom: "1%",
              paddingBottom: 0,
            }}
          >
            {messageHeader}
          </Text>
          <CustomLine
            style={{
              marginBottom: 0,
              paddingBottom: 0,
            }}
          />
          <HelperText
            style={{
              fontFamily: "montserrat-17",
              color: COLORS.secondary,
              marginBottom: 0,
              paddingBottom: 0,
            }}
            numberOfLines={1}
          >
            {subHeader}
          </HelperText>

          <Animation
            style={[
              {
                width: 200,
                marginTop: 0,
                alignSelf: "center",
                paddingTop: 0,
                aspectRatio: 1,
              },
              lottiestyle,
            ]}
            source={lottieFile}
          />
          <Button
            labelStyle={{
              fontFamily: "montserrat-17",
              color: COLORS.primary,
            }}
            icon="hand-okay"
            mode="contained"
            onPress={understandHandler}
            style={[
              {
                width: "90%",
                alignSelf: "center",
                backgroundColor: COLORS.secondary,
                marginBottom: "2%",
              },
              buttonStyle,
            ]}
          >
            {buttonTitle}
          </Button>
        </View>
      </View>
    </Animated.View>
  );
};
