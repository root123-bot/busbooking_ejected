/* eslint-disable react-native/no-inline-styles */
import React, { memo, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Keyboard,
  Platform,
} from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { Background } from "../../../../components/ui";
import { TransparentPopUpIconMessage } from "../../../../components/Messages";
import { COLORS } from "../../../../constants/colors";
import { getOTP, isUserExist } from "../../../../utils/requests";
import { AppContext } from "../../../../store/context";
import PhoneInput from "react-native-phone-number-input";

function ForgotPassword({ color, navigation, route }) {
  const AppCtx = useContext(AppContext);
  const phoneInput = useRef(null);

  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [phone, setPhone] = useState({
    value: "",
    isValid: true,
  });
  const [formattedValue, setFormattedValue] = useState(
    AppCtx.lastLoginPhoneNumber ? AppCtx.lastLoginPhoneNumber : "+255"
  );

  async function resetHandler() {
    Keyboard.dismiss();

    const phoneValid = phone.value.length === 9 && !phone.value.startsWith("0");
    const formattedValueValid = formattedValue.length === 13;

    if (!phoneValid) {
      setPhone({ ...phone, isValid: phoneValid });
      alert("Invalid phone number");
      return;
    }

    // everthing is good
    setFormSubmitLoader(true);
    setShowAnimation(true);
    const phone_number = `${formattedValue}`;

    // before validate if there is a user of that phone number...
    const data = await isUserExist(phone_number);

    if (data.message === "User does not exist") {
      alert("User does not exist");
      setFormSubmitLoader(false);
      setShowAnimation(false);
      return;
    }

    const user_id = data.user_id;
    const user_group = data.user_group;
    AppCtx.manipulateResetPhoneNumber({ user_id, user_group });

    getOTP(phone_number)
      .then((result) => {
        if (result.data) {
          const metadata = {
            phone_number,
            otp: result.data.OTP,
          };

          AppCtx.manipulateResetPhoneNumber(metadata);
          setTimeout(() => {
            setFormSubmitLoader(false);
            navigation.navigate("VerifyOTPScreen", {
              reset: true,
            });
          }, 1000);
          setShowAnimation(false);
        }
      })
      .catch((error) => {
        console.log("THIS IS ERROR ", error);
        setFormSubmitLoader(false);
        setShowAnimation(false);
        setLoading(false);
        alert(error.error.message);
      });
  }

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
      }}
    >
      <StatusBar style="dark" />
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
          messageHeader="Okay"
          icon="check"
          inProcess={showAnimation}
        />
      </View>

      <Background>
        <View
          style={styles.container}
          pointerEvents={formSubmitLoader ? "none" : "auto"}
        >
          <View style={styles.innerContainer}>
            <Text style={styles.title}>{"FILL PHONE NUMBER"}</Text>
            <HelperText style={styles.subheader}>
              The one you used in registration.
            </HelperText>
            <View style={styles.formInput}>
              <PhoneInput
                ref={phoneInput}
                defaultValue={phone.value}
                defaultCode="TZ"
                layout="first"
                onChangeText={(text) => {
                  setPhone({ value: text, isValid: true });
                }}
                onChangeFormattedText={(text) => {
                  setFormattedValue(text);
                }}
                containerStyle={{
                  width: "100%",
                  backgroundColor: COLORS.light,
                }}
                textContainerStyle={{
                  backgroundColor: COLORS.light,
                }}
                withDarkTheme={false}
                withShadow
                autoFocus={false}
              />
            </View>
            <Button
              loading={formSubmitLoader}
              buttonColor={"grey"}
              textColor={COLORS.light}
              labelStyle={{
                fontFamily: "montserrat-17",
              }}
              style={{
                backgroundColor: COLORS.primary,
                marginTop: 15,
              }}
              mode="contained"
              onPress={resetHandler}
            >
              {"Continue"}
            </Button>
          </View>
        </View>
      </Background>
    </View>
  );
}

export default memo(ForgotPassword);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "96%",
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: COLORS.darkprimary,
    borderRadius: 10,
    padding: 15,
  },
  title: {
    fontFamily: "montserrat-17",
    color: COLORS.light,
    fontSize: 20,
    textAlign: "center",
  },
  formInput: {
    marginVertical: "2%",
  },
  subheader: {
    fontFamily: "overpass-reg",
    textAlign: "center",
    color: COLORS.light,
    marginTop: 0,
    paddingTop: 0,
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
