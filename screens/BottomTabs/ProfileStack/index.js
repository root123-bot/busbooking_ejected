import React, { memo, useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { AppContext } from "../../../store/context";
import {
  Background,
  CustomImageCache,
  LoadingSpinner,
} from "../../../components/ui";
import { COLORS } from "../../../constants/colors";
import { Modal, Button } from "react-native-paper";
import { BASE_URL } from "../../../constants/domain";
import { TransparentPopUpIconMessage } from "../../../components/Messages";
import * as ImageCache from "react-native-expo-image-cache";
import TransparentBackButton from "../../../components/TransparentBackButton";
import { _cacheResourcesAsync } from "../../../utils";
import { Box, Skeleton, VStack } from "native-base";

function ProfileScreen({ navigation, route }) {
  const AppCtx = useContext(AppContext);
  const [profileIsReady, setProfileIsReady] = useState(false);

  // useEffect(() => {
  //   const loadResources = async () => {
  //     await _cacheResourcesAsync();
  //     setProfileIsReady(true);
  //   };
  //   loadResources();
  // }, []);

  // previously it was if (!profileIsReady || AppCtx.stillExecutingUserMetadata), think waiting for these resources to load to show profile
  // it takes about 6seconds which is bad user experience, so what i did is i load these resources on App.js without waiting so if it will be
  // loaded before going to profile screen then its lucky to user, otherwise its will be ugly which i think this is best approach since its
  // 50% to 50%
  if (AppCtx.stillExecutingUserMetadata) {
    // i think here we should show skeleton
    // return <LoadingSpinner />;
    return (
      <Box flex={1} justifyContent={'center'}>
        <Box mx={4}>
          <Box alignItems={'center'} mb={5}>
          <Skeleton size={200} rounded={'full'} />
          </Box>
          <Box mb={3}>
            <Skeleton borderRadius={5} h={'48px'} w={'100%'} />
          </Box>
          <VStack space={1} mt={2}>
            <Skeleton borderRadius={5} h={'48px'} w={'100%'} />
            <Skeleton borderRadius={5} h={'48px'} w={'100%'} />
            <Skeleton borderRadius={5} h={'48px'} w={'100%'} />
            <Skeleton borderRadius={5} h={'48px'} w={'100%'} />
            {
              Platform.OS === 'ios' && (
                <Skeleton borderRadius={5} h={'48px'} w={'100%'} bg={'red.100'} />
              )
            }

          </VStack>
 
        </Box>
      </Box>
    ) 
  }

  if (AppCtx.isAunthenticated) {
    return (
      <View
        style={{
          flex: 1,
          position: "relative",
        }}
      >
        <View style={[{ flex: 1 }]}>
          <ImageBackground
            style={styles.imgBack}
            source={require("../../../assets/images/background/2.jpg")}
          >
            <SafeAreaView style={styles.parentContainer}>
              <ScrollView style={[styles.childContainer]}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("PickAvatarScreen");
                  }}
                >
                  <View style={styles.innerContainer}>
                    <CustomImageCache
                      uri={AppCtx.usermetadata.get_avatar}
                      style={{
                        width: 190,
                        height: 190,
                        borderRadius: 190 / 2,
                      }}
                    />
                  </View>
                </TouchableOpacity>
                <View style={styles.nameContainer}>
                  <Text style={styles.phone}>
                    {AppCtx.usermetadata.phone_number}
                  </Text>
                </View>
                <View style={styles.footer}>
                  <TransparentBackButton />
                </View>
              </ScrollView>
            </SafeAreaView>
          </ImageBackground>
        </View>
      </View>
    );
  } else {
    return (
      <>
        <Background>
          <View style={styles.authContainer}>
            <View style={styles.authInnerContainer}>
              <Text style={styles.authText}>
                This feature need you to have account.
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginVertical: 12,
                }}
              >
                <Button
                  mode="contained"
                  labelStyle={{
                    fontFamily: "montserrat-17",
                  }}
                  style={{
                    width: "48%",
                    backgroundColor: "grey",
                  }}
                  onPress={() =>
                    navigation.navigate("Register", {
                      ugroup: undefined,
                    })
                  }
                >
                  Register
                </Button>
                <Button
                  mode="contained"
                  labelStyle={{
                    fontFamily: "montserrat-17",
                  }}
                  style={{ width: "48%", backgroundColor: "grey" }}
                  onPress={() => navigation.navigate("Login")}
                >
                  Login
                </Button>
              </View>
            </View>
          </View>
        </Background>
      </>
    );
  }
}

export default memo(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textWrapper: {
    flexDirection: "row",
  },
  loginText: {
    color: COLORS.primary,
  },
  registerText: {
    color: COLORS.primary,
  },
  authText: {
    fontFamily: "montserrat-17",
    color: COLORS.light,
    marginVertical: 10,
    textAlign: "center",
  },
  authContainer: {
    flex: 1,
    justifyContent: "center",
  },
  authInnerContainer: {
    backgroundColor: COLORS.darkprimary,
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    padding: 10,
    borderRadius: 10,
  },
  container: {
    flex: 1,
  },
  imgBack: {
    flex: 1,
  },
  imgStyle: {
    opacity: 0.5,
  },
  parentContainer: {
    flex: 1,
  },
  childContainer: {
    flex: 1,
    paddingTop: 50,
  },
  innerContainer: {
    marginTop: 14,
    alignItems: "center",
  },
  iconHolder: {
    width: 190,
    height: 190,
    borderRadius: 190 / 2, // kwenye android borderRadius kwa % inasumbua...ili upate round chukua width ya image / 2 instead ya kutumia %
    backgroundColor: COLORS.darkprimary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconimg: {
    width: 90,
    height: 90,
  },
  nameContainer: {
    backgroundColor: "black",
    marginTop: 5,
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 10,
    opacity: 0.7,
    paddingVertical: 10,
    alignItems: "center",
  },
  name: {
    fontSize: 17,
    fontWeight: "bold",
    fontFamily: "montserrat-17",
    textTransform: "capitalize",
    color: "white",
  },
  phone: {
    fontSize: 15,
    fontFamily: "montserrat-17",
    textTransform: "capitalize",
    color: "white",
  },
  footer: {
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 21,
  },
});
