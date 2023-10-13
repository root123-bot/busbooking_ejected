import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
  Keyboard,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../../constants/colors";
import SearchBar from "../../../components/SearchBar";
import { Button, TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
// import DatePicker from "react-native-date-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { CustomLine } from "../../../components/ui";
import * as RNPaper from "react-native-paper";
import { AppContext } from "../../../store/context";
import { LoadingSpinner } from "../../../components/ui";
import { TransparentPopUpIconMessage } from "../../../components/Messages";

const { height } = Dimensions.get("window");

function RouterCard() {
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        aliginItems: "center",
      }}
    >
      <View
        style={{
          width: "60%",
          backgroundColor: COLORS.light,
          height: 170,
          borderRadius: 15,
          borderRightWidth: 2,
          borderRightColor: COLORS.background,
          shadowColor: "#DEE2E6",
          padding: 15,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          elevation: 5,
          shadowOpacity: 0.5,
          shadowRadius: 3.84,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: COLORS.background,
            height: 10,
            width: 10,
            borderBottomLeftRadius: 6,
          }}
        ></View>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: COLORS.background,
            height: 10,
            width: 10,
            borderTopLeftRadius: 6,
          }}
        ></View>
        <View>
          <Text
            style={{
              fontSize: 17,
              fontFamily: "montserrat-17",
              color: COLORS.darkprimary,
            }}
          >
            HIACE #109
          </Text>
        </View>
        <View></View>
      </View>
      <View
        style={{
          width: "40%",
          height: 170,
          backgroundColor: COLORS.light,
          borderRadius: 15,
          shadowColor: "#DEE2E6",
          padding: 15,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          elevation: 5,
          shadowOpacity: 0.5,
          shadowRadius: 3.84,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: COLORS.background,
            height: 10,
            width: 10,
            borderBottomRightRadius: 6,
          }}
        ></View>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            backgroundColor: COLORS.background,
            height: 10,
            width: 10,
            borderTopRightRadius: 6,
          }}
        ></View>
      </View>
    </View>
  );
}

function getDayName(day) {
  let dayname;
  switch (day) {
    case 0:
      dayname = "Sunday";
      break;
    case 1:
      dayname = "Monday";
      break;
    case 2:
      dayname = "Tuesday";
      break;
    case 3:
      dayname = "Wednesday";
      break;
    case 4:
      dayname = "Thursday";
      break;
    case 5:
      dayname = "Friday";
      break;
    case 6:
      dayname = "Saturday";
      break;
    default:
      break;
  }

  return dayname;
}

function HomeScreen({ navigation }) {
  const AppCtx = useContext(AppContext);

  const [from, setFrom] = useState(
    Array.from(new Set(AppCtx.trips.map((trip) => trip.bus_source))).length
      ? Array.from(new Set(AppCtx.trips.map((trip) => trip.bus_source)))[0]
      : "NO DATA"
  );
  const [fromIcon, setFromIcon] = useState("chevron-down");
  const [toggleFromIcon, setToggleFromIcon] = useState("none");
  const [destination, setDestination] = useState(
    Array.from(new Set(AppCtx.trips.map((trip) => trip.bus_destination)))
      .length > 0
      ? Array.from(new Set(AppCtx.trips.map((trip) => trip.bus_destination)))[0]
      : "NO DATA"
  );
  const [destinationIcon, setDestinationIcon] = useState("chevron-down");
  const [toggleDestinationIcon, setToggleDestinationIcon] = useState("none");
  const [passengers, setPassengers] = useState("1");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [fromList, setFromList] = useState(
    Array.from(new Set(AppCtx.trips.map((trip) => trip.bus_source)))
  );
  const [destinationList, setDestinationList] = useState(
    Array.from(new Set(AppCtx.trips.map((trip) => trip.bus_destination)))
  );
  const [departureDate, setDepartureDate] = useState(new Date());
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  // console.log("Departure time ", departureDate);

  const executeCoreLogics = () => {
    // initially lets filter destinations depending on the "from"
    const source = Array.from(
      new Set(AppCtx.trips.map((trip) => trip.bus_source))
    ).length
      ? Array.from(new Set(AppCtx.trips.map((trip) => trip.bus_source)))[0]
      : "NO DATA";

    const result = Array.from(
      new Set(
        AppCtx.trips
          .filter((trip) => trip.bus_source === source)
          .map((data) => data.bus_destination)
      )
    );

    setDestinationList(result);
    setDestination(result.length > 0 ? result[0] : "Choose destination");
  };

  // at first we should also have the destination depended on the
  // default value of "From" used, you should notice that
  const onChangeFrom = (source) => {
    // we should yield the "Destination" according to "from" and day of departure
    // i think its okay to include also the "departure date" but you should
    // notice that the "depart date" is the condition which is below so there
    // is no need to include 'departure' date to our looking since it will be
    // difficult to have logics for some scenarios so lets end with from only...
    console.log("Source ", source);
    setFrom(source);
    const result = Array.from(
      new Set(
        AppCtx.trips
          .filter((trip) => trip.bus_source === source)
          .map((data) => data.bus_destination)
      )
    );
    console.log("New destinations ", result);
    setDestinationList(result);
    setDestination(result.length > 0 ? result[0] : "Choose destination");
  };

  const onChange = ({ type }, selectedDate) => {
    if (type === "set") {
      const currentDate = selectedDate;

      if (Platform.OS === "android") {
        toggleDatePicker();
        setDepartureDate(currentDate);
      } else {
        setDepartureDate(currentDate);
      }
      // this should be set here down below
      setDate(currentDate);
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const searchTripHandler = () => {
    // make sure passenger is not more than 3
    // if (+passengers > 3) {
    //   alert("Passengers should not be more than 3");
    //   return;
    // }

    setFormSubmitLoader(true);
    setShowAnimation(true);

    // take from, then destination, then date(day) and passenger
    const day = getDayName(new Date(departureDate).getDay());

    console.log(
      "CHECKING RETURNED BOOKINGS ",
      AppCtx.trips[0].bus_info.bookings_metadata
    );
    // console.log(
    //   "Booked one ",
    //   AppCtx.trips.filter(
    //     (trip) =>
    //       trip.bus_source.toLowerCase() === from.toLowerCase() &&
    //       trip.bus_destination.toLowerCase() === destination.toLowerCase() &&
    //       trip.day.toLowerCase() === day.toLowerCase()
    //   ).length
    // );

    const result = AppCtx.trips
      .filter(
        (trip) =>
          trip.bus_source.toLowerCase() === from.toLowerCase() &&
          trip.bus_destination.toLowerCase() === destination.toLowerCase() &&
          trip.day.toLowerCase() === day.toLowerCase()
      )
      .filter((trip) =>
        trip.day.toLowerCase() === day.toLowerCase() &&
        trip.bus_info.bookings_metadata.length === 0
          ? true
          : trip.bus_info.bookings_metadata.filter(
              (value) =>
                getDayName(new Date(value.trip_date).getDay()).toLowerCase() ===
                  day.toLowerCase() && +value.available_seats >= +passengers
            ).length > 0
      );

    /*
  POINT OF NOTE: there is no way tukawa na duplicates in our trips coz each trip is unique and it can contains 
  duplicates of "bookings" but the bookings are inner array found in it so here we resolve the all trips from 
  our api so there is no way to have filtered trips and be the same, and if we have the same trip of the same 
  bus then it will be of different time then no need to have logic to remove duplicates, THANK YOU GOD! 
*/
    console.log("RESULTS ", result);
    // console.log("ACTUAL DATA ", result[0].bus_info.bookings_metadata);
    // console.log("SECOND ONE ", result[1].bus_info.bookings_metadata);

    if (result.length === 0) {
      setIcon("error-outline");
      setMessage("No trip found");
      setTimeout(() => {
        setShowAnimation(false);
        setTimeout(() => {
          setFormSubmitLoader(false);
        }, 1500);
      }, 1500);
      return;
    }

    // lets re-arrange our we filtered by price from low to high
    const rearranged = [...result].sort((a, b) => a.bus_fare - b.bus_fare);

    // if we are here then we have a trip
    setIcon("check-circle-outline");
    setMessage("Trips found");
    const metadata = {
      from,
      destination,
      passengers,
      departureDate,
      founded_trips: rearranged,
    };
    AppCtx.updateUserTripMetadata(metadata);
    setTimeout(() => {
      setShowAnimation(false);
      setTimeout(() => {
        setFormSubmitLoader(false);
        navigation.navigate("RouteSearchDetails", {
          trips: rearranged,
        });
      }, 500);
    }, 500);
  };

  useEffect(() => {
    executeCoreLogics();
  }, []);

  if (AppCtx.stillFetchingTrips || AppCtx.stillFetchingAvatars) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <StatusBar style="light" />
      <View
        style={{
          flex: 1,
          position: "relative",
          backgroundColor: COLORS.background,
        }}
      >
        <View
          style={{
            display: formSubmitLoader ? "flex" : "none",
            position: "absolute",
            top: "40%",
            zIndex: 10000000000,
            alignSelf: "center",
            width: 150,
            height: 150,
            justifyContent: "center",
          }}
        >
          <TransparentPopUpIconMessage
            messageHeader={message}
            icon={icon}
            inProcess={showAnimation}
          />
        </View>

        <View
          pointerEvents={formSubmitLoader ? "none" : "auto"}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "25%",
            backgroundColor: COLORS.darkprimary,
          }}
        ></View>
        <ScrollView
          style={{ flex: 1 }}
          pointerEvents={formSubmitLoader ? "none" : "auto"}
        >
          <View
            style={{
              width: "85%",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "5%",
            }}
          >
            <View
              style={{
                marginTop: height * 0.125,
                backgroundColor: COLORS.light,
                borderRadius: 15,
                padding: 10,
                shadowColor: "black",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                elevation: 5,
                shadowOpacity: 0.5,
                shadowRadius: 3.84,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "overpass-reg",
                    color: "black",
                    marginTop: 10,
                    textAlign: "center",
                  }}
                >
                  Welcome, Pick route
                </Text>
                <View style={styles.formInput}>
                  {Platform.OS === "ios" ? (
                    <>
                      <Pressable
                        onPress={() => {
                          if (toggleFromIcon === "none") {
                            setToggleFromIcon("flex");
                            setFromIcon("chevron-up");
                            setToggleDestinationIcon("none");
                            setDestinationIcon("chevron-down");
                            Keyboard.dismiss();
                          } else {
                            setToggleFromIcon("none");
                            setFromIcon("chevron-down");
                          }
                        }}
                      >
                        <View pointerEvents="none">
                          <TextInput
                            mode="outlined"
                            editable={false}
                            // disabled
                            left={<TextInput.Icon icon="near-me" />}
                            right={<TextInput.Icon icon={fromIcon} />}
                            value={from}
                            label={"From"}
                          />
                        </View>
                      </Pressable>
                      <Picker
                        mode="dropdown"
                        selectedValue={from}
                        onValueChange={onChangeFrom}
                        style={[
                          styles.pickerStyling,
                          { display: toggleFromIcon },
                        ]}
                      >
                        {fromList.map((item, index) => {
                          return (
                            <Picker.Item
                              key={index}
                              label={item}
                              value={item}
                            />
                          );
                        })}
                      </Picker>
                    </>
                  ) : (
                    <>
                      <View style={{ marginTop: "2%" }}>
                        <Text style={{ marginLeft: "3%" }}>From:</Text>
                        <View
                          style={{
                            borderColor: "black",
                            // borderRadius: 5,
                            borderWidth: 1,
                          }}
                        >
                          <Picker
                            mode="dropdown"
                            style={{
                              backgroundColor: "white",
                            }}
                            selectedValue={from}
                            onValueChange={(text) => setFrom(text)}
                          >
                            {fromList.map((item, index) => {
                              return (
                                <Picker.Item
                                  key={index}
                                  label={item}
                                  value={item}
                                />
                              );
                            })}
                          </Picker>
                        </View>
                      </View>
                    </>
                  )}
                  {Platform.OS === "ios" && toggleFromIcon === "flex" && (
                    <Button
                      onPress={() => {
                        setToggleFromIcon("none");
                        setFromIcon("chevron-down");
                      }}
                      style={{
                        backgroundColor: "grey",
                      }}
                      labelStyle={{
                        fontFamily: "montserrat-17",
                        color: "white",
                      }}
                    >
                      Done
                    </Button>
                  )}
                </View>
                <View style={styles.formInput}>
                  {Platform.OS === "ios" ? (
                    <>
                      <Pressable
                        onPress={() => {
                          if (toggleDestinationIcon === "none") {
                            setToggleDestinationIcon("flex");
                            setDestinationIcon("chevron-up");
                            setToggleFromIcon("none");
                            setFromIcon("chevron-down");
                            Keyboard.dismiss();
                          } else {
                            setToggleDestinationIcon("none");
                            setDestinationIcon("chevron-down");
                          }
                        }}
                      >
                        <View pointerEvents="none">
                          <TextInput
                            mode="outlined"
                            editable={false}
                            left={<TextInput.Icon icon="map-marker" />}
                            right={<TextInput.Icon icon={destinationIcon} />}
                            value={destination}
                            label={"Destination"}
                          />
                        </View>
                      </Pressable>
                      <Picker
                        mode="dropdown"
                        selectedValue={destination}
                        onValueChange={(text) => setDestination(text)}
                        style={[
                          styles.pickerStyling,
                          { display: toggleDestinationIcon },
                        ]}
                      >
                        {destinationList.map((item, index) => {
                          return (
                            <Picker.Item
                              key={index}
                              label={item}
                              value={item}
                            />
                          );
                        })}
                      </Picker>
                    </>
                  ) : (
                    <>
                      <View style={{ marginTop: "2%" }}>
                        <Text style={{ marginLeft: "3%" }}>Destination:</Text>
                        <View
                          style={{
                            borderColor: "black",
                            // borderRadius: 5,
                            borderWidth: 1,
                          }}
                        >
                          <Picker
                            mode="dropdown"
                            style={{
                              backgroundColor: "white",
                            }}
                            selectedValue={destination}
                            onValueChange={(text) => setDestination(text)}
                          >
                            {destinationList.map((item, index) => {
                              return (
                                <Picker.Item
                                  key={index}
                                  label={item}
                                  value={item}
                                />
                              );
                            })}
                          </Picker>
                        </View>
                      </View>
                    </>
                  )}
                  {Platform.OS === "ios" &&
                    toggleDestinationIcon === "flex" && (
                      <Button
                        onPress={() => {
                          setToggleDestinationIcon("none");
                          setDestinationIcon("chevron-down");
                        }}
                        style={{
                          backgroundColor: "grey",
                        }}
                        labelStyle={{
                          fontFamily: "montserrat-17",
                          color: "white",
                        }}
                      >
                        Done
                      </Button>
                    )}
                </View>
                <View style={styles.formInput}>
                  <Pressable onPress={toggleDatePicker}>
                    <View pointerEvents="none">
                      <TextInput
                        mode="outlined"
                        editable={false}
                        left={<TextInput.Icon icon="calendar-range-outline" />}
                        value={departureDate.toDateString()}
                        label={"Departure"}
                      />
                    </View>
                  </Pressable>
                  {showPicker && (
                    <>
                      <DateTimePicker
                        testID="dateTimePicker"
                        mode="date"
                        minimumDate={new Date()}
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        value={date}
                        onChange={onChange}
                      />
                      {Platform.OS === "ios" && (
                        <Button
                          onPress={() => setShowPicker(false)}
                          style={{
                            backgroundColor: "grey",
                          }}
                          labelStyle={{
                            fontFamily: "montserrat-17",
                            color: "white",
                          }}
                        >
                          Done
                        </Button>
                      )}
                    </>
                  )}
                </View>
                <View style={styles.formInput}>
                  <TextInput
                    mode="outlined"
                    keyboardType="numeric"
                    left={<TextInput.Icon icon="account" />}
                    onChangeText={(text) => setPassengers(text)}
                    value={passengers}
                    label={"Passengers"}
                    activeOutlineColor="black"
                  />
                  {/* <RNPaper.HelperText
                    padding="none"
                    style={{
                      fontWeight: "bold",
                      color: COLORS.secondary,
                      fontStyle: "italic",
                    }}
                  >
                    ** Enter maximum 3 passengers
                  </RNPaper.HelperText> */}
                </View>
              </View>
              <View
                style={{
                  marginVertical: 15,
                }}
              >
                <Button
                  labelStyle={{ fontFamily: "montserrat-17", color: "white" }}
                  style={{
                    backgroundColor: COLORS.darkprimary,
                    borderRadius: 25,
                  }}
                  onPress={searchTripHandler}
                >
                  Search
                </Button>
              </View>
            </View>
          </View>
          <View
            style={{
              width: "85%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "overpass-reg",
                color: "black",
                marginTop: 10,
              }}
            >
              Latest Active Ticket
            </Text>
          </View>
          <View
            style={{
              width: "85%",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "2%",
              marginBottom: "5%",
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.light,
                borderRadius: 15,
                padding: 13,
                shadowColor: "black",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                elevation: 5,
                shadowOpacity: 0.5,
                shadowRadius: 3.84,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "overpass-reg",
                  }}
                >
                  Hiace #109
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "overpass-reg",
                    color: COLORS.darkprimary,
                  }}
                >
                  Ticket: #23
                </Text>
              </View>
              <View
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  // justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: "35%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "montserrat-17",
                      fontSize: 17,
                    }}
                    numberOfLines={1}
                  >
                    Dar es salaam
                  </Text>
                </View>

                <Image
                  source={require("../../../assets/images/icons/right-arrow.png")}
                  style={{
                    width: "30%",
                    height: 20,
                  }}
                />
                <View
                  style={{
                    width: "35%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "montserrat-17",
                      fontSize: 17,
                      textAlign: "right",
                    }}
                    numberOfLines={1}
                  >
                    Tunduma
                  </Text>
                </View>
              </View>
              <View
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TextInput
                  mode="outlined"
                  disabled={true}
                  left={<TextInput.Icon icon="calendar-range-outline" />}
                  value={departureDate.toDateString()}
                  label={"Departure"}
                />
                <TextInput
                  mode="outlined"
                  disabled
                  left={<TextInput.Icon icon="account" />}
                  onChangeText={(text) => setPassengers(text)}
                  value={"1"}
                  label={"Passengers"}
                  activeOutlineColor="black"
                />
              </View>
            </View>
          </View>
          <View
            style={{
              width: "85%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "overpass-reg",
                color: "black",
                marginTop: 10,
              }}
            >
              Popular Routes
            </Text>
          </View>
          <View
            style={{
              width: "85%",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "2%",
              marginBottom: "20%",
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.light,
                borderRadius: 15,
                padding: 13,
                shadowColor: "black",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                elevation: 5,
                shadowOpacity: 0.5,
                shadowRadius: 3.84,
              }}
            >
              <View
                style={{
                  marginVertical: 10,
                  flexDirection: "row",
                  // justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: "35%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "montserrat-17",
                      fontSize: 17,
                    }}
                    numberOfLines={1}
                  >
                    Dar es salaam
                  </Text>
                </View>
                <Image
                  source={require("../../../assets/images/icons/right-arrow.png")}
                  style={{
                    width: "30%",
                    height: 20,
                  }}
                />
                <View
                  style={{
                    width: "35%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "montserrat-17",
                      fontSize: 17,
                      textAlign: "right",
                    }}
                    numberOfLines={1}
                  >
                    Tunduma
                  </Text>
                </View>
              </View>
              <CustomLine />
              <View
                style={{
                  marginVertical: 10,
                  flexDirection: "row",
                  // justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: "35%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "montserrat-17",
                      fontSize: 17,
                    }}
                    numberOfLines={1}
                  >
                    Morogoro
                  </Text>
                </View>

                <Image
                  source={require("../../../assets/images/icons/right-arrow.png")}
                  style={{
                    width: "30%",
                    height: 20,
                  }}
                />
                <View
                  style={{
                    width: "35%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "montserrat-17",
                      fontSize: 17,
                      textAlign: "right",
                    }}
                    numberOfLines={1}
                  >
                    Dar es salaam
                  </Text>
                </View>
              </View>
              <CustomLine />
              <View
                style={{
                  marginVertical: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: "35%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "montserrat-17",
                      fontSize: 17,
                    }}
                    numberOfLines={1}
                  >
                    Mwanza
                  </Text>
                </View>

                <Image
                  source={require("../../../assets/images/icons/right-arrow.png")}
                  style={{
                    width: "30%",
                    height: 20,
                  }}
                />
                <View
                  style={{
                    width: "35%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "montserrat-17",
                      fontSize: 17,
                      textAlign: "right",
                    }}
                    numberOfLines={1}
                  >
                    Dodoma
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "96%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  innerContainer: {
    flex: 1,
  },
  scrollView: {
    marginTop: 12,
  },
  formInput: {
    marginTop: 15,
  },
});
