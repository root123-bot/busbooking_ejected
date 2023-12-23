import { StatusBar } from "expo-status-bar";
import React, { memo, useState, useContext, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import { COLORS } from "../../../constants/colors";
import { Ionicons, FontAwesome5, AntDesign } from "@expo/vector-icons";
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
import { DeleteBooking } from "../../../utils/requests";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
// https://dereckquock.com/react-native-looping-opacity-animation
// https://github.com/shubhambathe1/react-native-countdown-timer-hooks
function BlinkingView({ timeIsUpHandler, metadata, needrefresh }) {
  const refTimer = useRef();

  const [timerEnd, setTimerEnd] = useState(false);

  const timerCallbackFunc = (timerFlag) => {
    setTimerEnd(timerFlag);

    // alert("Time is up");
    console.log("HEY TIME IS UP NOW");
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
              fontSize: 16,
              color: "white",
              fontFamily: "overpass-reg",
            }}
          >
            Remaining time to pay ticket{" "}
          </RNPaper.Text>
          <View style={{ display: timerEnd ? "none" : "flex" }}>
            <CountDownTimer
              ref={refTimer}
              // timestamp={
              //   metadata.booking_timeout_to_pay_for_each_cycle
              //     ? metadata.booking_timeout_to_pay_for_each_cycle * 60
              //     : 15 * 60
              // }
              timestamp={needrefresh ? 50 : 30}
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

  const { metadata, bookedSeats, booking_id, needrefresh } = route.params;

  /*
    the logic behind iNeedToPayNow, this initially at the first blinkingViews its "false"
    when the user at the first blinkingView click to pay we make it "true", means it should
    enforce the logic of isTimeoutReached to not being executed as it force the handler to 
    return 'false', then we go to the next page payment page then we can need to back again 
    on back again the another second 'blinkingView' is executed and as you know the app cache 
    the previous changes made which display the filled information and also it has 'iNeedToPayNow' of 'true'
    which this is dangerous as if it remains true then this next blinkingView timeout will not be
    executed so what i did, is i force it to return to false through the 'useEffect' which use 
    needrefresh as 'dependency' this will be executed only once as 'needrefresh' does not change 
    so we force iNeedToPayNow to 'false' so as our timeEnd reached handler to be executed and to 
    display the animation... But it we make it to 'false' remember the 'counter' still count even if
    we move out or when we click 'Pay now' to go to the 'Payment' page by clicking go to  the 'Payment' we set
    iNeedToPayNow to 'true' which is good to stop the timeoutReached when we navigate to the 'payment' page
    so this is logic used here and its okay because the way we play with this 'iNeedToPayNow' is 
    marvelous so even if we go next then comeback here then go next it will act accordingly.. But point of 
    note here is that the 'iNeedToPayNow' logic for first 'render' or first BlinkingView is not useful
    anymore since we have the 'shouldRemoveFirstBlinkingView' which we force to remove the first blinkingView and
    its logic when we go to the 'Payment' for first time so it also remmove the onTimeReached handler 
    which delete the booking that all, you did
  */

  // console.log("Booked Seats ", bookedSeats);
  // console.log("METADATA ", metadata);
  console.log("Booking id ", booking_id);
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
  const [showTimeoutError, setShowTimeoutError] = useState(0);
  const [iNeedToPayNow, setINeedToPayNow] = useState(false);
  const [shouldRemoveFirstBlinkingView, setShouldRemoveFirstBlinkingView] =
    useState(false);
  const [favIcon, setFavIcon] = useState('hearto')


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

    // the seat should be available, so we should first make the logic of counting timer not working again before
    // we submit data, remember we take our logic in "timeIsUpHandler"
    //
    setINeedToPayNow(true);
    // i think we still need to set time count, and you know what if the request to pay for
    // ticket fail which is unlikely we need to set need to paynow false... but i think this
    // counter if user click payNow should disappear since its easy task of taking the user to next page

    // lets navigate to payment
    setShouldRemoveFirstBlinkingView(true);
    navigation.navigate("Payment", {
      metadata,
      bookedSeats,
      booking_id,
      name,
      firstFormattedPhoneNumber: formattedValue,
      secondFormattedPhoneNumber: secondFormattedValue,
    });
  };

  const handleFavorite = async (tr) => {
    const trip = JSON.stringify({
      from: tr.from,
      destination: tr.destination,
      trip_id: metadata.id
    })
    if (favIcon === 'hearto') {
      setFavIcon('heart')
      let favtrips =  await AsyncStorage.getItem('favorite-trips')
      console.log('FAV ', favtrips)
      if (favtrips) {
        favtrips = JSON.parse(favtrips)
        console.log("fav2 ", favtrips)
        const existingtrip = favtrips.find(val => val === trip)
        if (!existingtrip) {
          favtrips = [...favtrips, trip]
          await AsyncStorage.setItem('favorite-trips', JSON.stringify(favtrips))
        }
      }
      else {
        await AsyncStorage.setItem('favorite-trips', JSON.stringify([trip]))
      }
    }
    else {
      setFavIcon('hearto')
      let favtrips =  await AsyncStorage.getItem('favorite-trips')

      if (favtrips) {
        favtrips = JSON.parse(favtrips)
        const existingtrip = favtrips.find(val => val === trip)

        if (existingtrip) {
          favtrips.splice(favtrips.findIndex(val => val === trip) , 1)
          await AsyncStorage.setItem('favorite-trips', JSON.stringify(favtrips))
        }
      }
    }
  }

  useEffect(() => {
    async function checkIfFavorite() {
      let favtrips =  await AsyncStorage.getItem('favorite-trips')
      const trip = JSON.stringify({
        from: AppCtx.userTripMetadata.from,
        destination: AppCtx.userTripMetadata.destination,
        trip_id: metadata.id
      })
      if (favtrips) {
        favtrips = JSON.parse(favtrips)
        const existingtrip = favtrips.find(val => val === trip)
        if (existingtrip) {
          setFavIcon('heart')
        }
        else {
          setFavIcon('hearto')
        }
      } else {
        setFavIcon('hearto')
      }
    }
    
    checkIfFavorite()
  }, [])

  useEffect(() => {
    // kama huyu ni true basi mlazimishe awe false
    if (needrefresh) {
      setINeedToPayNow(false);
    }
  }, [needrefresh]);

  console.log("THIS IS iNeedToPayNow", iNeedToPayNow);
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
              {"Timeout Reached"}
            </Text>
            <CustomLine
              style={{
                marginBottom: 0,
                paddingBottom: 0,
              }}
            />
            <View
              style={{
                width: width * 0.7,
              }}
            >
              <HelperText
                style={{
                  fontFamily: "montserrat-17",
                  color: "white",
                  marginBottom: 0,
                  paddingBottom: 0,
                }}
              >
                {"The seats you've selected has been released."}
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
                  width: width * 0.7,
                },
              ]}
              onPress={() =>
                navigation.navigate("PickSeatsScreen", {
                  metadata,
                })
              }
            >
              Book again
            </Button>
          </View>
        </View>
        <View
          style={[
            styles.container,
            {
              opacity: showTimeoutError ? 0.4 : 1,
            },
          ]}
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
                        onPress={() => {
                          const formData = new FormData();
                          formData.append("booking_id", booking_id);
                          DeleteBooking(formData).catch((err) => {
                            console.log("Error occured in deleting booking");
                            Alert.alert(
                              "Something went wrong",
                              `${err.toString()}`,
                              [
                                {
                                  text: "Okay",
                                },
                              ]
                            );
                          });
                          navigation.navigate("PickSeatsScreen", {
                            metadata,
                          });
                        }}
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
                      <TouchableOpacity onPress={handleFavorite.bind(this, AppCtx.userTripMetadata)}>
                        <AntDesign name={favIcon} size={25} color={'white'} />
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
                  marginBottom: 150,
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
                          isValid: true,
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
                {shouldRemoveFirstBlinkingView &&
                  needrefresh &&
                  !showTimeoutError && (
                    <BlinkingView
                      metadata={metadata}
                      needrefresh={needrefresh}
                      timeIsUpHandler={() => {
                        // this point ni muhimu ku-avoid
                        if (iNeedToPayNow) {
                          console.log("THIS IS MY END");
                          // its okay  this will make the function return nothing but before it return nothing lets make
                          // the iNeedToPayNow to its default value..
                          setINeedToPayNow(false);
                          return;
                        }
                        console.log("PLEASE REACH THIS POINT..");
                        setShowTimeoutError((prevState) => prevState + 1);

                        // let's delete  that booking
                        const formData = new FormData();
                        formData.append("booking_id", booking_id);
                        console.log("IM TILL HERE");
                        DeleteBooking(formData)
                          .then((data) => {
                            console.log("Data ", data);
                          })
                          .catch((err) => {
                            console.log("Error occured in deleting booking");
                            Alert.alert(
                              "Something went wrong",
                              `${err.toString()}`,
                              [
                                {
                                  text: "Okay",
                                },
                              ]
                            );
                          });
                      }}
                    />
                  )}
                {!shouldRemoveFirstBlinkingView &&
                  !needrefresh &&
                  !showTimeoutError && (
                    <BlinkingView
                      metadata={metadata}
                      needrefresh={needrefresh}
                      timeIsUpHandler={() => {
                        // THIS HAS NO MEANING HERE YOU CAN REMOVE IT ..
                        if (iNeedToPayNow) {
                          console.log("WE DONT DELETE THE BOOKING");
                          setINeedToPayNow(false);

                          return;
                        }

                        setShowTimeoutError((prevState) => prevState + 1);

                        // let's delete  that booking
                        const formData = new FormData();
                        formData.append("booking_id", booking_id);
                        DeleteBooking(formData)
                          .then((data) => {
                            console.log("Data ", data);
                          })
                          .catch((err) => {
                            console.log("Error occured in deleting booking");
                            Alert.alert(
                              "Something went wrong",
                              `${err.toString()}`,
                              [
                                {
                                  text: "Okay",
                                },
                              ]
                            );
                          });
                      }}
                    />
                  )}

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
                    Continue
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
