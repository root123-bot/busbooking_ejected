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
  Alert,
} from "react-native";
import { COLORS } from "../../../constants/colors";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { HelperText, Button } from "react-native-paper";
import * as RNPaper from "react-native-paper";
import { CustomLine } from "../../../components/ui";
import PhoneInput from "react-native-phone-number-input";
import { AppContext } from "../../../store/context";
import { computeTimeTo12Format } from "../../../utils";

import { CustomizedLottieMessage } from "../../../components/Messages";
import { Animation } from "../../../components/ui";

function Payment({ route, navigation }) {
  const AppCtx = useContext(AppContext);

  const { metadata, bookedSeats, booking_id } = route.params;

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
});
