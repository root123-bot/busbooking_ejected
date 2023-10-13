import { StatusBar } from "expo-status-bar";
import React, { memo, useContext, useState } from "react";
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
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as RNPaper from "react-native-paper";
import { HelperText } from "react-native-paper";
import { CustomLine } from "../../../components/ui";
import SeatsLayout from "@mindinventory/react-native-bus-seat-layout";
import { AppContext } from "../../../store/context";
import { computeTimeTo12Format } from "../../../utils";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

function PickSeatsScreen({ route, navigation }) {
  const { metadata } = route.params;
  const AppCtx = useContext(AppContext);

  // this make sense so as if user is not login to forward this metadata back
  // to this screen
  // AppCtx.manipulatePickSeatScreenMetadata({ metadata });

  const [bookedSeat, setBookedSeat] = useState([]);

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
    navigation.navigate("FillPassengerInfo", {
      metadata,
    });
  };
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
                  <TouchableOpacity>
                    <FontAwesome5 name="ellipsis-h" size={24} color="white" />
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
                  row={10}
                  layout={{ columnOne: 1, columnTwo: 2 }}
                  selectedSeats={[
                    { seatNumber: 11, seatType: "women" },
                    { seatNumber: 17, seatType: "women" },
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
