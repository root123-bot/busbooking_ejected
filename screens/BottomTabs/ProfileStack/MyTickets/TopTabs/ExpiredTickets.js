import React, { memo } from "react";
import { View, Text } from "react-native";

function ExpiredTickets() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Expired Tickets</Text>
    </View>
  );
}

export default memo(ExpiredTickets);
