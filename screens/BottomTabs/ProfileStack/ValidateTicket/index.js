import React, { memo } from "react";
import { View, Text } from "react-native";

function ValidateTicket() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Im the validate ticket screen</Text>
    </View>
  );
}

export default memo(ValidateTicket);
