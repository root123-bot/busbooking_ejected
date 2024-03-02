import React, { memo, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Keyboard } from "react-native";
import { Background } from "../../../../components/ui";
import { TransparentPopUpIconMessage } from "../../../../components/Messages";
import { AppContext } from "../../../../store/context";
import { COLORS } from "../../../../constants/colors";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { HelperText, Button, TextInput } from "react-native-paper";
import { validateOTP } from "../../../../utils/requests";

function EnterOTPScreen({ navigation, route }) {
  const AppCtx = useContext(AppContext);
  const { reset } = route.params ? route.params : { reset: false };

  const [code, setCode] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");

  const verifyOTPHandler = () => {
    Keyboard.dismiss();
    if (code.length !== 4) {
      return;
    }

    setFormSubmitLoader(true);
    setShowAnimation(true);
    let phone = reset
      ? AppCtx.resetPhoneNumber.phone_number
      : AppCtx.registermetadata.phone_number;
    console.log("THIS IS THE USER PHONE NUMBER ", AppCtx.registermetadata);
    validateOTP(phone, code).then((result) => {
      if (result.data) {
        if (result.data.message === "OTP validated successfully") {
          setMessage("Okay");
          setIcon("check");
          setTimeout(() => {
            AppCtx.manipulateAlreadyValidated(true);
            setFormSubmitLoader(false);
            reset
              ? navigation.navigate("SetPinScreen", {
                  reset: true,
                })
              : navigation.navigate("SetPinScreen");
          }, 1000);
          setShowAnimation(false);
        } else {
          setMessage("OTP is not valid");
          setIcon("close");
          setTimeout(() => {
            setFormSubmitLoader(false);
          }, 1000);
          setShowAnimation(false);
        }
      }
    });
  };

  return (
    <Background>
      <View
        style={{
          flex: 1,
          position: "relative",
        }}
      >
        <View
          style={styles.container}
          pointerEvents={formSubmitLoader ? "none" : "auto"}
        >
          <View
            style={{
              flex: 1,
              display: formSubmitLoader ? "flex" : "none",
              height: 150,
              width: 150,
              alignSelf: "center",
              position: "absolute",
              top: "40%",
              zIndex: 10,
            }}
          >
            <TransparentPopUpIconMessage
              messageHeader={message}
              icon={icon}
              inProcess={showAnimation}
            />
          </View>

          <View style={styles.innerContainer}>
            <Text style={styles.head}>Confirm your OTP Code</Text>
            <HelperText style={styles.subheader}>
              Please check your OTP on mobile.
            </HelperText>
            <View
              style={{
                alignItems: "center",
              }}
            >
              <OTPInputView
                onCodeChanged={(msimbo) => setCode(msimbo)}
                selectionColor={COLORS.light}
                // autoFocusOnLoad={Platform.OS === "ios" ? true : false}
                autoFocusOnLoad={false}
                style={{
                  width: "80%",
                  height: 100,
                  color: "grey",
                }}
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                pinCount={4}
              />
            </View>
            <Button
              mode="contained"
              loading={formSubmitLoader}
              labelStyle={{
                fontFamily: "montserrat-17",
                color: COLORS.light,
              }}
              style={{
                backgroundColor: COLORS.primary,
              }}
              onPress={verifyOTPHandler}
            >
              Continue
            </Button>
          </View>
        </View>
      </View>
    </Background>
  );
}

export default EnterOTPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    backgroundColor: COLORS.darkprimary,
    borderRadius: 10,
    padding: 20,
  },
  head: {
    fontSize: 20,
    fontFamily: "montserrat-17",
    color: COLORS.light,
    textAlign: "center",
  },
  subheader: {
    fontFamily: "overpass-reg",
    textAlign: "center",
    color: COLORS.light,
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: "black",
  },
  underlineStyleBase: {
    width: 50,
    height: 55,
    borderColor: COLORS.light,
    color: COLORS.light,
    borderWidth: 2,
  },
  underlineStyleHighLighted: {
    borderColor: COLORS.light,
  },
});
