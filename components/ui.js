import React, { useRef, useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  StatusBar,
  ImageBackground,
  StyleSheet,
  Text,
  Image,
  useContext,
} from "react-native";
import AnimatedLottieView from "lottie-react-native";
import { Searchbar } from "react-native-paper";
import { COLORS } from "../constants/colors";
import { AppContext } from "../store/context";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";
import * as ImageCache from "react-native-expo-image-cache";

export const LoadingSpinner = ({ color }) => {
  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={color && color} />
      </View>
    </>
  );
};

export const Animation = ({
  source,
  style,
  onAnimationFinish,
  autoplay = true,
  loop = true,
  speed = 1.5,
}) => {
  const lottieRef = useRef(null);
  useEffect(() => {
    lottieRef.current?.reset();
    setTimeout(() => {
      lottieRef.current?.play();
    }, 0);
  }, []);
  // fix end

  return (
    <AnimatedLottieView
      source={source}
      autoPlay={autoplay}
      loop={loop}
      style={style}
      speed={speed}
      onAnimationFinish={onAnimationFinish}
      ref={lottieRef}
    />
  );
};

export const RouteCard = () => {
  return (
    <View
      style={{
        backgroundColor: "red",
        height: 500,
      }}
    >
      <Text>RouteCard</Text>
    </View>
  );
};

export const CustomLine = ({ style }) => {
  return (
    <View
      style={[
        {
          marginBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#cfcfcf",
        },
        style,
      ]}
    ></View>
  );
};

export const Background = ({ children, image, style }) => {
  return (
    <>
      <LinearGradient
        colors={["#000000", "#000000"]}
        style={[{ flex: 1 }, style && style]}
      >
        <ImageBackground
          style={{
            flex: 1,
          }}
          imageStyle={{ opacity: 0.5 }}
          source={image ? image : require("../assets/images/background/4.jpg")}
        >
          {children}
        </ImageBackground>
      </LinearGradient>
    </>
  );
};

export const CustomImageCache = ({ uri, style }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const getCacheImage = async () => {
      const path = `${FileSystem.cacheDirectory}${uri}`;
      const resource = await FileSystem.getInfoAsync(path);
      if (resource.exists) {
        setImageUrl(resource.uri);
      } else {
        try {
          const newResource = await FileSystem.downloadAsync(
            `${BASE_URL}${uri}`,
            path
          );
          setImageUrl(newResource.uri);
        } catch (error) {
          console.log("error ", error);
          setImageUrl(`${BASE_URL}${uri}`);
        }
      }
    };
    getCacheImage();
  });

  return (
    <>
      {imageUrl ? (
        <Image
          style={style}
          source={{
            uri: imageUrl,
          }}
        />
      ) : (
        <View
          style={[
            style,
            {
              backgroundColor: COLORS.darkprimary,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <ActivityIndicator size={"large"} />
        </View>
      )}
    </>
  );
};
