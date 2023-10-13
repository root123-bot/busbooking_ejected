import React, { memo, useContext, useRef, useState } from "react";
import { View, Text, StyleSheet, Keyboard } from "react-native";
import { Background } from "../../../../components/ui";
import PhoneInput from "react-native-phone-number-input";
import { TextInput, Button, HelperText } from "react-native-paper";
import { AppContext } from "../../../../store/context";
import { COLORS } from "../../../../constants/colors";
import { getOTP } from "../../../../utils/requests";
import { TransparentPopUpIconMessage } from "../../../../components/Messages";

function RegisterScreen({ route, navigation }) {
  const AppCtx = useContext(AppContext);

  const phoneInput = useRef(null);
  const { ugroup } = route.params ? route.params : { ugroup: undefined };

  const [phone, setPhone] = useState({ value: "", isValid: false });
  const [formattedValue, setFormattedValue] = useState("+255"); // +258 is for mozambique, MZ is its code
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);

  const jisajiliHandler = () => {
    Keyboard.dismiss();
    setLoading(true);

    const phoneValid = phone.value.length === 9 && !phone.value.startsWith("0");

    const formattedValueValid = formattedValue.length === 13;

    if (!phoneValid || !formattedValueValid) {
      setLoading(false);
      alert("Please enter a valid phone number");
      return;
    }

    if (loading) {
      return;
    }

    setFormSubmitLoader(true);
    setShowAnimation(true);
    setLoading(true);
    const phone_number = `${formattedValue}`;
    getOTP(phone_number)
      .then((result) => {
        if (result.data) {
          const metadata = {
            phone_number,
            otp: result.data.OTP,
            usergroup: "passenger",
          };
          AppCtx.addRegisterMetadata(metadata);
          setLoading(false);
          setTimeout(() => {
            setFormSubmitLoader(false);
            navigation.navigate("VerifyOTPScreen");
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
  };

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
      }}
    >
      <Background>
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
              messageHeader="Okay"
              icon="check"
              inProcess={showAnimation}
            />
          </View>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>
              {ugroup ? "WEKA TAARIFA" : "CREATE ACCOUNT"}
            </Text>

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
            <HelperText
              style={{
                color: COLORS.light,
              }}
            >
              By continuing you confirm that you are authorized to use this
              phone number & agree to receive an SMS text.
            </HelperText>
            <Button
              buttonColor={COLORS.primary}
              textColor={COLORS.thirdary}
              labelStyle={{
                fontFamily: "montserrat-17",
              }}
              loading={loading}
              mode="contained"
              onPress={jisajiliHandler}
            >
              {ugroup ? "Continue" : "Next"}
            </Button>
          </View>
        </View>
      </Background>
    </View>
  );
}

export default memo(RegisterScreen);

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
    marginBottom: 10,
  },
  formInput: {
    marginVertical: "2%",
  },
});
