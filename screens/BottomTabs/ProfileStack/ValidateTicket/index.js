import React, { memo } from "react";
import { View, Text, Dimensions } from "react-native";
import { Button, HelperText } from "react-native-paper";
import { COLORS } from "../../../../constants/colors";
import { Background, Animation, CustomLine } from "../../../../components/ui";

const { width } = Dimensions.get("window");

function ValidateTicket() {
  return (
    <Background>
      <View
        style={{
          flex: 1,
          // backgroundColor: "red",
          alignSelf: "center",
          position: "absolute",
          top: "25%%",
          zIndex: 10000,
        }}
      >
        <View
          style={{
            alignSelf: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            paddingHorizontal: 20,
            borderRadius: 15,
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "montserrat-17",
              color: "white",
              fontSize: 20,
              textAlign: "center",
              marginTop: "2%",
              color: COLORS.darkGray,
              marginBottom: "1%",
              paddingBottom: 0,
            }}
          >
            SCAN TICKET BARCODE
          </Text>
          <CustomLine
            style={{
              marginBottom: 0,
              paddingBottom: 0,
              borderBottomColor: "grey",
            }}
          />
          <View
            style={{
              width: width * 0.7,
            }}
          >
            <HelperText
              style={{
                fontFamily: "montserrat-17",
                marginBottom: 0,
                paddingBottom: 0,
                color: COLORS.darkGray,
              }}
            >
              {"To check if the ticket is valid, scan code."}
            </HelperText>
            <View>
              <Animation
                style={[
                  {
                    width: width * 0.7,
                    marginTop: 0,
                    alignSelf: "center",
                    paddingTop: 0,
                    aspectRatio: 1,
                  },
                ]}
                source={require("../../../../assets/LottieAnimations/Animation - 1701125795197.json")}
              />
            </View>
          </View>
          <Button
            labelStyle={{
              fontFamily: "montserrat-17",
            }}
            mode="contained"
            style={[
              {
                alignSelf: "center",
                backgroundColor: COLORS.danger,
                marginBottom: "2%",
                width: width * 0.7,
              },
            ]}
          >
            Scan now
          </Button>
        </View>
      </View>
    </Background>
  );
}

export default memo(ValidateTicket);
