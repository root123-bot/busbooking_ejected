import React, { memo, useState, useContext, useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
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
import { COLORS } from "../../../../constants/colors";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import RouteCard from "../../../../components/RouteCard";
import { StyledRoutCard } from "../../HomeStack/HomeScreen";
import TicketOverview from "./TicketOverview";

function MyTickets() {
  const navigation = useNavigation();
  return (
    <View
      style={{
        position: "relative",
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <View style={[styles.container]}>
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
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      width: "60%",
                      alignItems: "center",
                    }}
                  >
                    <View>
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
                        My Tickets
                      </Text>
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
              padding: 15,
            }}
          >
            <View
              style={{
                marginBottom: 20,
              }}
            >
              <TicketOverview />
              <TicketOverview />
              <TicketOverview />
              <TicketOverview />
              <TicketOverview />
              <TicketOverview />
              <TicketOverview />
              <TicketOverview />
              <TicketOverview />
              <TicketOverview />
              <TicketOverview />
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

export default memo(MyTickets);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
