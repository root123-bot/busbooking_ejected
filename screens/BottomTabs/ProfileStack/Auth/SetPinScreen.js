import React, { memo, useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Keyboard } from "react-native";
import { TransparentPopUpIconMessage } from "../../../../components/Messages";
import { AppContext } from "../../../../store/context";
import { Background } from "../../../../components/ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../../../constants/colors";
import * as Device from "expo-device";
import { Button, HelperText } from "react-native-paper";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { BASE_URL } from "../../../../constants/domain";
import {
  executeUserMetadata,
  registerUser,
  resetPIN,
} from "../../../../utils/requests";

function SetPinScreen({ navigation, route }) {
  const AppCtx = useContext(AppContext);
  const { reset } = route.params ? route.params : { reset: false };

  const [PIN, setPIN] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");

  const savePinHandler = async () => {
    Keyboard.dismiss();
    if (PIN.length !== 4) {
      return;
    }
    setFormSubmitLoader(true);
    setShowAnimation(true);

    if (reset) {
      // usiwaze kuhusu jina hii "resetPhoneNumber" it holds full data phone, user_id etc
      const { user_id } = AppCtx.resetPhoneNumber;

      resetPIN(user_id, PIN);
      await AsyncStorage.setItem("user_id", user_id.toString());

      try {
        const metadata = await executeUserMetadata(user_id);
        AppCtx.manipulateUserMetadata(metadata);
      } catch (err) {
        if (
          err.message.toLowerCase().includes("Unrecognized user".toLowerCase())
        ) {
          const splitted = err.message.split(" ");
          const user_id = splitted[splitted.length - 1];
          fetch(`${BASE_URL}/api/delete_user/`, {
            method: "POST",
            body: JSON.stringify({
              user_id,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          // lets logout
          AppCtx.logout();
          alert("Your account have been deleted, register again.");
        } else {
          alert(err.message);
        }
        return;
      }

      setShowAnimation(false);
      setFormSubmitLoader(false);
      AppCtx.manipulateIsAunthenticated(true);

      navigation.navigate("ProfileScreen");
      return;
    }

    const uniqueDeviceId = Device.osBuildId;
    const phone_number = AppCtx.registermetadata.phone_number;
    const usergroup = AppCtx.registermetadata.usergroup || "passenger";

    registerUser(phone_number, usergroup, PIN, uniqueDeviceId)
      .then((result) => {
        console.log("THIS IS RESULT FOR YOU ", result);
        if (result.data.usergroup.toLowerCase() === "passenger") {
          setMessage("Success");
          setIcon("check");

          setTimeout(() => {
            setFormSubmitLoader(false);
            AppCtx.manipulateUserMetadata(result.data);
            AsyncStorage.setItem("user_id", result.data.get_user_id.toString());
            const phone = result.data.phone_number.toString();

            AsyncStorage.setItem("phone_number", phone);
            AppCtx.manipulateIsAunthenticated(true);
            if (
              AppCtx.afterLoginNext &&
              AppCtx.afterLoginNext === "chooseseats"
            ) {
              // lets first clear it and then navigate
              AppCtx.manipulateAfterLoginNext();
              navigation.navigate("HomeStack", {
                screen: "PickSeatScreen",
                params: {
                  metadata: AppCtx.pickSeatScreenMetadata.metadata,
                  pickedSeats: AppCtx.pickSeatScreenMetadata.pickedSeats,
                },
              });
            } else {
              navigation.navigate("ProfileScreen");
            }
          }, 1000);
          setShowAnimation(false);
        }
      })
      .catch((err) => {
        if (err.message === "User already exist") {
          setMessage("Phone exists");
        } else {
          setMessage("Failed");
        }
        setIcon("close");
        setTimeout(() => {
          setFormSubmitLoader(false);
        }, 1000);
        setShowAnimation(false);
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
            <Text style={styles.header}>Set Login PIN</Text>
            <HelperText style={styles.subheader}>
              You will use this pin to login to your account.
            </HelperText>

            <OTPInputView
              onCodeChanged={(msimbo) => setPIN(msimbo)}
              selectionColor={COLORS.light}
              style={{
                width: "80%",
                height: 100,
                color: "grey",
              }}
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              autoFocusOnLoad={false}
              pinCount={4}
            />
            <Button
              mode="contained"
              loading={formSubmitLoader}
              labelStyle={{
                fontFamily: "montserrat-17",
              }}
              style={{
                backgroundColor: COLORS.primary,
              }}
              onPress={savePinHandler}
            >
              Continue
            </Button>
          </View>
        </View>
      </View>
    </Background>
  );
}

export default SetPinScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "96%",
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "100%",
    padding: 15,
    backgroundColor: COLORS.darkprimary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  header: {
    fontSize: 20,
    fontFamily: "montserrat-17",
    color: COLORS.light,
  },
  subheader: {
    fontFamily: "overpass-reg",
    textAlign: "center",
    color: COLORS.light,
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
