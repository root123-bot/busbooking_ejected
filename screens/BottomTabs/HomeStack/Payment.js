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
  Pressable,
  Keyboard,
  Alert,
} from "react-native";
import { COLORS } from "../../../constants/colors";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { HelperText, Button, TextInput } from "react-native-paper";
import * as RNPaper from "react-native-paper";
import { CustomLine } from "../../../components/ui";
import PhoneInput from "react-native-phone-number-input";
import { AppContext } from "../../../store/context";
import { computeTimeTo12Format } from "../../../utils";
import { Picker } from "@react-native-picker/picker";

import { CustomizedLottieMessage } from "../../../components/Messages";
import { Animation } from "../../../components/ui";

function Payment({ route, navigation }) {
  const AppCtx = useContext(AppContext);

  const {
    metadata,
    bookedSeats,
    booking_id,
    name,
    firstFormattedPhoneNumber,
    secondFormattedPhoneNumber,
  } = route.params;

  const [phone, setPhone] = useState({
    value: "",
    isValid: true,
  });
  const [formattedValue, setFormattedValue] = useState("+255");

  const [togglePaymentIcon, setTogglePaymentIcon] = useState("none");
  const [paymentIcon, setPaymentIcon] = useState("chevron-down");
  const [paymentMethod, setPaymentMethod] = useState("M-PESA");

  function paymentHandler() {
    console.log("THIS IS PHONE NUMBER FOR YOU ", formattedValue, paymentMethod);

    const phoneValid =
      phone.value.trim().length === 9 && !phone.value.startsWith("0");

    const formattedValueValid = formattedValue.length === 13;

    if (!phoneValid) {
      setPhone((prevState) => ({
        ...prevState,
        isValid: phoneValid,
      }));

      alert("Incorrect phone provided");
      return;
    }
  }

  return (
    <>
      <StatusBar style="light" />
      <View
        style={{
          position: "relative",
          flex: 1,
        }}
      >
        <View style={styles.container}>
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
                          navigation.navigate("FillPassengerInfo", {
                            metadata,
                            bookedSeats: bookedSeats,
                            booking_id,
                            needrefresh: true,
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
                    Fill Payment Information
                  </RNPaper.Text>
                  <RNPaper.HelperText
                    padding="none"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    The phone number to pay ticket(s).
                  </RNPaper.HelperText>
                </View>
                <CustomLine />
                <View>
                  <View>
                    <View style={styles.formInput}>
                      {Platform.OS === "ios" ? (
                        <>
                          <Pressable
                            onPress={() => {
                              if (togglePaymentIcon === "none") {
                                setTogglePaymentIcon("flex");
                                setPaymentIcon("chevron-up");
                                Keyboard.dismiss();
                              } else {
                                setTogglePaymentIcon("none");
                                setPaymentIcon("chevron-down");
                              }
                            }}
                          >
                            <View pointerEvents="none">
                              <TextInput
                                mode="outlined"
                                editable={false}
                                // disabled
                                left={<TextInput.Icon icon="near-me" />}
                                right={<TextInput.Icon icon={paymentIcon} />}
                                value={paymentMethod}
                                label={"Payment Method"}
                              />
                            </View>
                          </Pressable>
                          <Picker
                            mode="dropdown"
                            selectedValue={paymentMethod}
                            onValueChange={(text) => setPaymentMethod(text)}
                            style={[
                              styles.pickerStyling,
                              { display: togglePaymentIcon },
                            ]}
                          >
                            <Picker.Item label={"M-PESA"} value={"M-PESA"} />
                            <Picker.Item
                              label={"AIRTEL MONEY"}
                              value={"AIRTEL MONEY"}
                            />
                            <Picker.Item
                              label={"TIGO PESA"}
                              value={"TIGO PESA"}
                            />
                            <Picker.Item label={"T-PESA"} value={"T-PESA"} />
                            <Picker.Item
                              label={"HALOPESA"}
                              value={"HALOPESA"}
                            />
                          </Picker>
                        </>
                      ) : (
                        <>
                          <View style={{ marginTop: "2%" }}>
                            <Text style={{ marginLeft: "3%" }}>
                              Payment Method:
                            </Text>
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
                                selectedValue={paymentMethod}
                                onValueChange={(text) => setPaymentMethod(text)}
                              >
                                <Picker.Item
                                  label={"M-PESA"}
                                  value={"M-PESA"}
                                />
                                <Picker.Item
                                  label={"AIRTEL MONEY"}
                                  value={"AIRTEL MONEY"}
                                />
                                <Picker.Item
                                  label={"TIGO PESA"}
                                  value={"TIGO PESA"}
                                />
                                <Picker.Item
                                  label={"T-PESA"}
                                  value={"T-PESA"}
                                />
                                <Picker.Item
                                  label={"HALOPESA"}
                                  value={"HALOPESA"}
                                />
                              </Picker>
                            </View>
                          </View>
                        </>
                      )}
                      {Platform.OS === "ios" &&
                        togglePaymentIcon === "flex" && (
                          <Button
                            onPress={() => {
                              setTogglePaymentIcon("none");
                              setPaymentIcon("chevron-down");
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
                    <PhoneInput
                      defaultValue={phone.value}
                      defaultCode="TZ"
                      layout="first"
                      onChangeText={(text) => {
                        setPhone({ value: text, isValid: true });
                      }}
                      onChangeFormattedText={(text) => {
                        setFormattedValue(text);
                      }}
                      containerStyle={{
                        width: "100%",
                        backgroundColor: COLORS.light,
                        borderColor: phone.isValid ? "grey" : "red",
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
                  </View>
                </View>
              </View>
            </ScrollView>
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
                Pay Now
              </RNPaper.Button>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

export default memo(Payment);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formInput: {
    marginTop: 15,
    marginBottom: 10,
  },
});
