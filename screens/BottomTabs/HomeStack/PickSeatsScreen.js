import { StatusBar } from "expo-status-bar";
import React, { memo, useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { COLORS } from "../../../constants/colors";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as RNPaper from "react-native-paper";
import { HelperText } from "react-native-paper";
import { CustomLine } from "../../../components/ui";
import SeatsLayout from "@mindinventory/react-native-bus-seat-layout";
import { AppContext } from "../../../store/context";
import { computeTimeTo12Format } from "../../../utils";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { CreateBooking } from "../../../utils/requests";
import { TransparentPopUpIconMessage } from "../../../components/Messages";
import AsyncStorage from "@react-native-async-storage/async-storage";

function PickSeatsScreen({ route, navigation }) {
  const { metadata } = route.params;

  let booked_seats = [];
  metadata.bus_info.bookings_metadata.forEach((val) => {
    booked_seats = [...booked_seats, ...val.booked_seats_labels];
  });

  const AppCtx = useContext(AppContext);

  const [bookedSeat, setBookedSeat] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");
  const [favIcon, setFavIcon] = useState('hearto')

  const bookSeatsHandler = () => {
    if (!AppCtx.isAunthenticated) {
      AppCtx.manipulateAfterLoginNext("chooseseats");
      return Alert.alert(
        "Login Required!",
        "This action need you to have account, register or login here",
        [
          {
            text: "Cancel",
            onPress: () => {
              console.log("Hello world");
            },
          },
          {
            text: "Proceed",
            style: "destructive",
            onPress: () => {
              navigation.navigate("ProfileStack", {
                screen: "Login",
                params: {
                  next: "chooseseats",
                },
              });
            },
          },
        ]
      );
    }

    // lets create that booking...
    setShowAnimation(true);
    setFormSubmitLoader(true);
    let b_date = AppCtx.userTripMetadata.departureDate
      .toDateString()
      .split(" ");

    b_date.shift();
    b_date = b_date.join(" ");

    const formData = new FormData();
    formData.append("user_id", AppCtx.usermetadata.get_user_id);
    formData.append("bus_id", metadata.bus_info.id);
    formData.append(
      "seats",
      JSON.stringify(bookedSeat.map((mt) => mt.seatNo.toString()))
    );
    formData.append("bustrip", metadata.id);
    formData.append("booking_date", b_date);

    CreateBooking(formData)
      .then((result) => {
        console.log("Result ", result);
        setMessage("Success");
        setIcon("check");
        setShowAnimation(false);
        AppCtx.manipulatePickSeatScreenMetadata({
          booking_id: result.id,
        });
        setTimeout(() => {
          setFormSubmitLoader(false);
          navigation.navigate("FillPassengerInfo", {
            metadata,
            bookedSeats: bookedSeat,
            booking_id: result.id,
          });
        }, 1000);
      })
      .catch((err) => {
        console.log("ERROR ", err);
        setMessage("Failed");
        setIcon("close");

        setShowAnimation(false);
        setTimeout(() => {
          setFormSubmitLoader(false);
          if (
            err.toString().trim().toLowerCase().includes("the seat(s) of label")
          ) {
            Alert.alert(
              "Seat(s) Unavailable",
              `${err.toString()} by others. Choose other seats`,
              [
                {
                  text: "Okay",
                },
              ]
            );
          } else {
            Alert.alert("Something went wrong", `${err.message.toString()}`, [
              {
                text: "Okay",
              },
            ]);
          }
        }, 1000);
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

  return (
    <>
      <StatusBar style="light" />
      <View
        style={{
          flex: 1,
          position: "relative",
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
          style={styles.container}
          pointerEvents={formSubmitLoader ? "none" : "auto"}
        >
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
                        navigation.navigate("BusDetailsScreen", {
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
                paddingBottom: 80,
                //   flexDirection: "row",
                //   justifyContent: "space-between",
                //   alignItems: "flex-start",
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
                      Choose your seats
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
                      Tap available box to select seat.
                    </HelperText>
                    <HelperText
                      padding="none"
                      style={{
                        marginTop: 0,
                        paddingTop: 0,
                      }}
                    >
                      Tap chosen box to deselect.
                    </HelperText>
                  </View>
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-end",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "montserrat-17",
                          fontSize: 20,
                          color: COLORS.darkprimary,
                        }}
                      >
                        ${metadata.bus_fare}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: "overpass-reg",
                          color: COLORS.lightGrey,
                        }}
                      >
                        /seat
                      </Text>
                    </View>
                  </View>
                </View>
                <CustomLine
                  style={{
                    marginBottom: 0,
                    paddingBottom: 0,
                  }}
                />
                <View
                  style={{
                    marginTop: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          height: 18,
                          width: 18,
                          backgroundColor: "#ADB5BD",
                          borderRadius: 2,
                          // borderWidth: 2,
                          // borderColor: "grey",
                        }}
                      ></View>
                      <RNPaper.Text
                        style={{
                          marginLeft: 10,
                          fontSize: 15,
                          fontWeight: "bold",
                          color: COLORS.lightGrey,
                        }}
                      >
                        Available
                      </RNPaper.Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          height: 18,
                          width: 18,
                          backgroundColor: COLORS.secondary,
                          borderRadius: 2,
                        }}
                      ></View>
                      <RNPaper.Text
                        style={{
                          marginLeft: 10,
                          fontSize: 15,
                          fontWeight: "bold",
                          color: COLORS.lightGrey,
                        }}
                      >
                        Chosen ({bookedSeat.length})
                      </RNPaper.Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          height: 18,
                          width: 18,
                          backgroundColor: "#FF477E",
                          borderRadius: 2,
                        }}
                      ></View>
                      <RNPaper.Text
                        style={{
                          marginLeft: 10,
                          fontSize: 15,
                          fontWeight: "bold",
                          color: COLORS.lightGrey,
                        }}
                      >
                        Blocked
                      </RNPaper.Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    marginTop: 10,
                  }}
                >
                  <SeatsLayout
                    // maxSeatToSelect={3}
                    row={metadata.bus_info.seat_layout.rows}
                    layout={{ columnOne: 1, columnTwo: 2 }}
                    selectedSeats={[
                      ...booked_seats.map((val) => ({
                        seatNumber: +val,
                        seatType: "women",
                      })),
                    ]}
                    numberTextStyle={{ fontSize: 12 }}
                    getBookedSeats={(seats) => {
                      console.log("getBookedSeats :: ", seats);
                      setBookedSeat(seats);
                      AppCtx.manipulatePickSeatScreenMetadata({
                        pickedSeats: seats,
                      });
                    }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          <Animated.View
            exiting={FadeInDown}
            entering={FadeInUp}
            style={{
              width: "100%",
              position: "absolute",
              display: bookedSeat.length > 0 ? "flex" : "none",
              bottom: 0,
              left: 0,
              backgroundColor: "#E5E5E5",
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,
                paddingHorizontal: 20,
                borderTopColor: "grey",
                borderTopWidth: 0.5,
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
                    ${`${+metadata.bus_fare * bookedSeat.length}`}
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
                loading={formSubmitLoader}
                labelStyle={{
                  fontWeight: "bold",
                }}
                onPress={bookSeatsHandler}
              >
                Next
              </RNPaper.Button>
            </View>
          </Animated.View>
        </View>
      </View>
    </>
  );
}

export default memo(PickSeatsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
