import React from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  Image,
} from "react-native";
import { COLORS } from "../constants/colors";
import { Animation } from "../components/ui";
import SwipeButton from "rn-swipe-button";
import arrowRight from "../assets/images/icons/right-arrow.png";

const { width, height } = Dimensions.get("window");
console.log("height ", height);
const CheckoutButton = () => {
  return (
    <View
      style={{
        width: 100,
        height: 30,
        backgroundColor: "#C70039",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#ffffff" }}>Checkout</Text>
    </View>
  );
};

function IntroScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        position: "relative",
      }}
    >
      <View style={styles.container}>
        <View
          style={{
            marginTop: height < 700 ? "10%" : height < 800 ? "15%" : "20%",
          }}
        >
          <Image
            source={require("../assets/images/logo2.png")}
            style={{
              width: "70%",
              alignSelf: "center",
              height: height < 800 ? 35 : 70,
            }}
          />
        </View>
        <View
          style={{
            marginVertical: height < 800 ? "3%" : "5%",
            marginTop: height < 800 ? 0 : "5%",
          }}
        >
          <Animation
            style={{
              width: "80%",
              marginTop: 0,
              alignSelf: "center",
              paddingTop: 0,
              aspectRatio: 1,
            }}
            source={require("../assets/LottieAnimations/animation_lm2c2rf4.json")}
          />
        </View>
        <View>
          <Image
            source={require("../assets/images/words1.png")}
            style={{
              width: "90%",
              alignSelf: "center",
              height: 150,
            }}
          />
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          backgroundColor: COLORS.primary,
          width: "100%",
          height: height < 800 ? "12%" : "15%",
          borderTopRightRadius: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            minWidth: 250,
          }}
        >
          <SwipeButton
            disableResetOnTap
            onSwipeSuccess={() => navigation.navigate("MyTabs")}
            forceReset={(reset) => {
              forceResetLastButton = reset;
            }}
            railBackgroundColor="#fff"
            railStyles={{
              backgroundColor: "#0080a788",
              borderColor: "#0080a788",
            }}
            railBorderColor={COLORS.light}
            thumbIconBackgroundColor={COLORS.secondary}
            title="Swipe to Start"
          />
        </View>
      </View>
    </View>
  );
}

export default IntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
});
