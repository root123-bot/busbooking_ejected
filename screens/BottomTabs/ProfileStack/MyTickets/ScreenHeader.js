import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/colors";
import { useNavigation } from "@react-navigation/native";

export default function ScreenHeader({ title }) {
  const navigation = useNavigation();
  return (
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
                  {title}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
