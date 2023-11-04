import React, { memo } from "react";
import { View, Text } from "react-native";

function AllTickets() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>All Tickets</Text>
    </View>
  );
}

export default memo(AllTickets);
