import React, { memo } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { COLORS } from "../../../../constants/colors";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import TicketOverview from "./TicketOverview/TicketOverview";
import ScreenHeader from "./ScreenHeader";

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
          <ScreenHeader title={"My Tickets"} />
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
              <TicketOverview expired />
              <TicketOverview />
              <TicketOverview expired />
              <TicketOverview />
              <TicketOverview />
              <TicketOverview expired />
              <TicketOverview expired />
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
