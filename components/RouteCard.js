import React, { memo, useContext } from "react";
import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import { TextInput } from "react-native-paper";
import { COLORS } from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { computeTimeTo12Format } from "../utils";
import { AppContext } from "../store/context";

function RouteCard({ metadata }) {
  const AppCtx = useContext(AppContext);
  const navigation = useNavigation();
  return (
    <Pressable
      style={{
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "2%",
        marginBottom: "5%",
      }}
      onPress={() => {
        // lets also save the metadata chosen by user
        AppCtx.manipulatePickSeatScreenMetadata({ metadata });

        navigation.navigate("BusDetailsScreen", {
          metadata,
        });
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
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "overpass-reg",
              textTransform: "capitalize",
            }}
          >
            {metadata.bus_info.bus_name}
          </Text>

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
                fontSize: 15,
                fontFamily: "overpass-reg",
                color: "#495057",
              }}
            >
              /seat
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
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
                textTransform: "capitalize",
              }}
              numberOfLines={1}
            >
              {metadata.bus_source}
            </Text>
          </View>

          <Image
            source={require("../assets/images/icons/right-arrow.png")}
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
                textTransform: "capitalize",
              }}
              numberOfLines={1}
            >
              {metadata.bus_destination}
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
            // disabled={true}
            editable={false}
            left={<TextInput.Icon icon="clock-fast" />}
            value={computeTimeTo12Format(metadata.source_arrival_time)}
            style={{
              width: "48%",
            }}
            label={"Arrival Time"}
          />
          <TextInput
            mode="outlined"
            editable={false}
            left={<TextInput.Icon icon="clock-fast" />}
            onChangeText={(text) => setPassengers(text)}
            value={computeTimeTo12Format(metadata.bus_departure_time)}
            label={"Departure Time"}
            style={{
              width: "48%",
            }}
            activeOutlineColor="black"
          />
        </View>
      </View>
    </Pressable>
  );
}

export default memo(RouteCard);
