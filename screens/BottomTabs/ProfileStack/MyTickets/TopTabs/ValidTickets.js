import React, { memo } from "react";
import { View, Text } from "react-native";

function ValidTickets() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Valid Tickets</Text>
    </View>
  );
}

export default memo(ValidTickets);
