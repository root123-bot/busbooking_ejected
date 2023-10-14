import { StatusBar } from "expo-status-bar";
import React, { memo, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { COLORS } from "../../../constants/colors";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { HelperText, Button } from "react-native-paper";
import * as RNPaper from "react-native-paper";
import { CustomLine } from "../../../components/ui";
import PhoneInput from "react-native-phone-number-input";
import { AppContext } from "../../../store/context";
import { computeTimeTo12Format } from "../../../utils";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  Easing,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg from "react-native-svg";
import CountDownTimer from "react-native-countdown-timer-hooks";
import { CustomizedLottieMessage } from "../../../components/Messages";
import { Animation } from "../../../components/ui";

const { width } = Dimensions.get("window");
// https://dereckquock.com/react-native-looping-opacity-animation
// https://github.com/shubhambathe1/react-native-countdown-timer-hooks
function BlinkingView({ timeIsUpHandler }) {
  const refTimer = useRef();

  const [timerEnd, setTimerEnd] = useState(false);

  const timerCallbackFunc = (timerFlag) => {
    setTimerEnd(timerFlag);

    // alert("Time is up");
    timeIsUpHandler();
  };

  const opacity = useSharedValue(0.4); // this is lowest opacity to use

  // Set the opacity value to animate between 0 and 1
  opacity.value = withRepeat(
    withTiming(1, { duration: 500, easing: Easing.ease }),
    -1,
    true
  );

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }), []);

  return (
    <Animated.View style={style}>
      <Svg
        style={{
          width: "100%",
          height: 40,
        }}
        viewBox="0 0 100 100"
      >
        <View
          style={{
            backgroundColor: COLORS.danger,
            width: "100%",
            height: "100%",
            padding: 5,
            paddingTop: 6,
            paddingHorizontal: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <RNPaper.Text
            style={{
              fontSize: 17,
              color: "white",
              fontFamily: "overpass-reg",
            }}
          >
            Remaining time to pay ticket{" "}
          </RNPaper.Text>
          <View style={{ display: timerEnd ? "none" : "flex" }}>
            <CountDownTimer
              ref={refTimer}
              timestamp={30}
              timerCallback={timerCallbackFunc}
              containerStyle={{
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
              textStyle={{
                fontSize: 25,
                color: "#FFFFFF",
                fontWeight: "500",
                letterSpacing: 0.25,
              }}
            />
          </View>
        </View>
      </Svg>
    </Animated.View>
  );
}

function FillPassengerInfo({ route, navigation }) {
  const AppCtx = useContext(AppContext);

  const animation = useSharedValue(1);
  const animationStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(animation.value, {
        duration: 1000,
      }),
    };
  });

  const { metadata, bookedSeats } = route.params;
  // console.log("Booked Seats ", bookedSeats);
  // console.log("METADATA ", metadata);
  const [name, setName] = useState({
    value: "",
    isValid: true,
  });
  const [firstPhone, setFirstPhone] = useState({
    value: "",
    isValid: true,
  });
  const [secondPhone, setSecondPhone] = useState({
    value: "",
    isValid: true,
  });
  const [formattedValue, setFormattedValue] = useState("+255");
  const [secondFormattedValue, setSecondFormattedValue] = useState("+255");
  const [showTimeoutError, setShowTimeoutError] = useState(false);

  const paymentHandler = () => {
    const nameValid = name.value.trim().length > 0;
    const firstPhoneValid =
      firstPhone.value.trim().length === 9 && !firstPhone.value.startsWith("0");

    const formattedValueValid = formattedValue.length === 13;

    // of course second phone number is 'optional' so even mtu akikosea we don't
    // care much
    if (!nameValid || !firstPhoneValid) {
      setName((prevState) => ({ ...prevState, isValid: nameValid }));
      setFirstPhone((prevState) => ({
        ...prevState,
        isValid: firstPhoneValid,
      }));

      alert("Incorrect data provided");
      return;
    }

    // lets check validity if the seat user has booked are still exist
    // or its already taken
  };

  return (
    <>
      <StatusBar style="light" />

      <View
        style={{
          position: "relative",
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            // backgroundColor: "red",
            alignSelf: "center",
            position: "absolute",
            top: "30%",
            zIndex: 10000,
            display: showTimeoutError ? "flex" : "none",
          }}
        >
          <View
            style={{
              alignSelf: "center",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              paddingHorizontal: 20,
              borderRadius: 15,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontFamily: "montserrat-17",
                color: "white",
                fontSize: 20,
                textAlign: "center",
                marginTop: "2%",
                marginBottom: "1%",
                paddingBottom: 0,
              }}
            >
              {"Timeout Error"}
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
                color: "white",
                marginBottom: 0,
                paddingBottom: 0,
              }}
              numberOfLines={1}
            >
              {"The booked seats has been released."}
            </HelperText>
            <View>
              <Animation
                style={[
                  {
                    width: width * 0.7,
                    marginTop: 0,
                    alignSelf: "center",
                    paddingTop: 0,
                    aspectRatio: 1,
                  },
                ]}
                source={require("../../../assets/LottieAnimations/animation_lnqngcwe.json")}
              />
            </View>
            <Button
              labelStyle={{
                fontFamily: "montserrat-17",
              }}
              mode="contained"
              style={[
                {
                  alignSelf: "center",
                  backgroundColor: COLORS.danger,
                  marginBottom: "2%",
                },
              ]}
            >
              Book again
            </Button>
          </View>
        </View>
        <View
          style={styles.container}
          pointerEvents={showTimeoutError ? "none" : "auto"}
        >
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
                    <View
                      style={{
                        width: "20%",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("PickSeatsScreen", {
                            metadata,
                          })
                        }
                      >
                        <Ionicons name="arrow-back" size={24} color="white" />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        width: "60%",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{
                            width: "40%",
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: 17,
                              fontWeight: "bold",
                              fontFamily: "overpass-reg",
                              marginTop: 5,
                              textTransform: "capitalize",
                            }}
                            numberOfLines={1}
                          >
                            {AppCtx.userTripMetadata.from}
                          </Text>
                        </View>
                        <View
                          style={{
                            width: "10%",
                          }}
                        >
                          <Image
                            source={require("../../../assets/images/icons/right-arrow.png")}
                            style={{
                              width: "100%",
                              height: 20,
                            }}
                          />
                        </View>
                        <View
                          style={{
                            width: "40%",
                          }}
                        >
                          <View>
                            <Text
                              style={{
                                color: "white",
                                fontSize: 18,
                                fontWeight: "bold",
                                fontFamily: "overpass-reg",
                                marginTop: 5,
                                textTransform: "capitalize",
                              }}
                              numberOfLines={1}
                            >
                              {AppCtx.userTripMetadata.destination}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 12,
                            fontFamily: "overpass-reg",
                          }}
                        >{`${AppCtx.userTripMetadata.departureDate.toDateString()}`}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        alignItems: "flex-end",
                      }}
                    >
                      <TouchableOpacity>
                        <FontAwesome5
                          name="ellipsis-h"
                          size={24}
                          color="white"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <ScrollView
              style={{
                paddingBottom: 50,
              }}
            >
              <View
                style={{
                  borderRadius: 15,
                  width: "90%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  backgroundColor: COLORS.light,
                  shadowColor: "black",
                  padding: 13,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  elevation: 5,
                  shadowOpacity: 0.5,
                  shadowRadius: 3.84,
                  marginVertical: 10,
                  marginTop: 20,
                  // backgroundColor: "red",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <View>
                  <RNPaper.Text
                    style={{
                      marginBottom: 0,
                      fontWeight: "bold",
                      color: COLORS.lightGrey,
                      textTransform: "capitalize",
                    }}
                  >
                    {metadata.bus_info.bus_name}
                  </RNPaper.Text>
                  <HelperText
                    padding="none"
                    style={{
                      marginTop: 0,
                      paddingTop: 0,
                      marginBottom: 0,
                      paddingBottom: 0,
                    }}
                  >
                    Plate:{" "}
                    <Text style={{ fontFamily: "overpass-reg" }}>
                      {metadata.bus_info.plate_number}
                    </Text>
                  </HelperText>
                </View>
                <View>
                  <RNPaper.Text
                    style={{
                      fontWeight: "bold",
                      color: COLORS.darkprimary,
                    }}
                  >
                    {computeTimeTo12Format(metadata.bus_departure_time)}
                  </RNPaper.Text>
                </View>
              </View>
              <View
                style={{
                  borderRadius: 15,
                  width: "90%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  backgroundColor: COLORS.light,
                  shadowColor: "black",
                  padding: 13,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  elevation: 5,
                  shadowOpacity: 0.5,
                  shadowRadius: 3.84,
                  marginVertical: 10,
                  marginTop: 20,
                  // backgroundColor: "red",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <RNPaper.Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 20,
                          color: COLORS.lightGrey,
                        }}
                      >
                        Booking Details
                      </RNPaper.Text>
                      <View
                        style={{
                          marginTop: 10,
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              fontFamily: "overpass-reg",
                              color: COLORS.lightGrey,
                            }}
                          >
                            Total seats: {bookedSeats.length}
                          </Text>
                          <Text
                            style={{
                              fontFamily: "overpass-reg",
                              color: COLORS.lightGrey,
                            }}
                          >
                            Seat Label(s):{" "}
                            {bookedSeats.map((val) => val.seatNo).join(", ")}
                          </Text>
                        </View>
                        <View></View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              {/* Hii conter-measure tuliyoitumie hapa ni nzuri instead mtu ajaze passenger name and phone for each
              ticket inakuwa mtihani what if he want to book 10 seats, ko sio poa kwa kweli so hapa information 
              ninazohitaji ili niweze ku-track ni mtu kutuma jina na namba mbili za simu ya pili ni optional..
              hii itasaidi afu kwenye ticket what we target haitokuwa na majina ya abiria itakuwa na jina tu 
              la aliye-book na phone number yake
            */}
              <View
                style={{
                  borderRadius: 15,
                  width: "90%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  backgroundColor: COLORS.light,
                  shadowColor: "black",
                  padding: 13,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  elevation: 5,
                  shadowOpacity: 0.5,
                  shadowRadius: 3.84,
                  marginVertical: 10,
                  marginTop: 20,
                  marginBottom: 100,
                }}
              >
                <View
                  style={{
                    marginBottom: 10,
                  }}
                >
                  <RNPaper.Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 17,
                      color: COLORS.lightGrey,
                      textAlign: "center",
                    }}
                  >
                    Fill Booking Information
                  </RNPaper.Text>
                  <RNPaper.HelperText
                    padding="none"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    The information to track and validate ticket(s).
                  </RNPaper.HelperText>
                </View>
                <CustomLine />
                <View>
                  <View>
                    <RNPaper.TextInput
                      mode="outlined"
                      label="Full name"
                      style={{
                        backgroundColor: "white",
                        marginVertical: 10,
                        marginTop: 0,
                      }}
                      autoCorrect={false}
                      autoComplete="off"
                      value={name.value}
                      activeOutlineColor={
                        name.isValid ? COLORS.lightGrey : "red"
                      }
                      outlineColor={name.isValid ? COLORS.lightGrey : "red"}
                      onChangeText={(text) => {
                        setName((prevState) => ({
                          ...prevState,
                          value: text,
                        }));
                      }}
                    />
                    <PhoneInput
                      defaultValue={firstPhone.value}
                      defaultCode="TZ"
                      layout="first"
                      onChangeText={(text) => {
                        setFirstPhone({ value: text, isValid: true });
                      }}
                      onChangeFormattedText={(text) => {
                        setFormattedValue(text);
                      }}
                      containerStyle={{
                        width: "100%",
                        backgroundColor: COLORS.light,
                        borderColor: firstPhone.isValid ? "grey" : "red",
                        marginVertical: 10,
                        borderWidth: 1,
                      }}
                      textContainerStyle={{
                        backgroundColor: COLORS.light,
                      }}
                      withDarkTheme={false}
                      withShadow
                      autoFocus={false}
                    />
                    <PhoneInput
                      defaultValue={secondPhone.value}
                      defaultCode="TZ"
                      layout="first"
                      onChangeText={(text) => {
                        setSecondPhone({ value: text, isValid: true });
                      }}
                      onChangeFormattedText={(text) => {
                        setSecondFormattedValue(text);
                      }}
                      containerStyle={{
                        width: "100%",
                        backgroundColor: COLORS.light,
                        borderColor: "grey",
                        borderWidth: 1,
                        marginTop: 10,
                      }}
                      textContainerStyle={{
                        backgroundColor: COLORS.light,
                      }}
                      withDarkTheme={false}
                      withShadow
                      autoFocus={false}
                    />
                    <RNPaper.HelperText
                      style={{
                        marginTop: 2,
                        paddingTop: 0,
                        fontWeight: "bold",
                        color: COLORS.secondary,
                      }}
                    >
                      ** optional
                    </RNPaper.HelperText>
                  </View>
                </View>
              </View>
            </ScrollView>
            <View
              style={{
                width: "100%",
                position: "absolute",
                bottom: 0,
                left: 0,
                backgroundColor: "#E5E5E5",
              }}
            >
              <View>
                <BlinkingView
                  timeIsUpHandler={() => setShowTimeoutError(true)}
                />

                <View
                  style={{
                    borderTopColor: "grey",
                    borderTopWidth: 0.5,
                    width: "100%",
                    padding: 10,
                    paddingHorizontal: 20,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: "40%",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-end",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "montserrat-17",
                          fontSize: 25,
                          color: COLORS.darkprimary,
                        }}
                      >
                        ${metadata.bus_fare * bookedSeats.length}
                      </Text>
                      {/* <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "overpass-reg",
                    color: COLORS.lightGrey,
                  }}
                >
                  /4seat
                </Text> */}
                    </View>
                  </View>
                  <RNPaper.Button
                    mode="contained"
                    style={{
                      width: "50%",
                      backgroundColor: COLORS.darkprimary,
                      borderRadius: 20,
                    }}
                    labelStyle={{
                      fontWeight: "bold",
                    }}
                    onPress={paymentHandler}
                  >
                    Pay now
                  </RNPaper.Button>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

export default memo(FillPassengerInfo);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
