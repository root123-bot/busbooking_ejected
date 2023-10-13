import React, { memo, useContext, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PhoneInput from "react-native-phone-number-input";
import { Background } from "../../../../components/ui";
import { COLORS } from "../../../../constants/colors";
import { AppContext } from "../../../../store/context";
import { TransparentPopUpIconMessage } from "../../../../components/Messages";
import { TextInput, Button } from "react-native-paper";
import { loginUser } from "../../../../utils/requests";

function LoginScreen({ route, navigation }) {
  const AppCtx = useContext(AppContext);
  const { next } = route.params?.next ? route.params : { next: "Profile" };

  const phoneInput = useRef(null);

  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [formattedValue, setFormattedValue] = useState(
    AppCtx.lastLoginPhoneNumber ? AppCtx.lastLoginPhoneNumber : "+255"
  );
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");
  const [phone, setPhone] = useState({
    value: AppCtx.lastLoginPhoneNumber
      ? AppCtx.lastLoginPhoneNumber.substr(
          4,
          AppCtx.lastLoginPhoneNumber.length
        )
      : "",
    isValid: true,
  });
  const [nywila, setNywila] = useState({
    value: "",
    isValid: true,
  });

  async function loginHandler() {
    Keyboard.dismiss();

    const phoneValid = phone.value.length === 9 && !phone.value.startsWith("0");

    const formattedValueValid = formattedValue.length === 13;

    const nywilaValid = nywila.value.trim().length === 4;

    if (!phoneValid || !nywilaValid) {
      setPhone({ ...phone, isValid: phoneValid });
      setNywila({ ...nywila, isValid: nywilaValid });
      alert("Invalid phone number or password; check your input");
      return;
    }

    setFormSubmitLoader(true);
    setShowAnimation(true);
    const phone_number = `${formattedValue}`;
    const password = nywila.value;

    loginUser(phone_number, password)
      .then(async (result) => {
        if (result.data) {
          setMessage("Login successful");
          setIcon("check");

          AsyncStorage.setItem("user_id", result.data.get_user_id.toString());
          AsyncStorage.setItem("phone_number", formattedValue.toString());

          AppCtx.manipulateLastLoginPhoneNumber(formattedValue.toString());

          AppCtx.manipulateUserMetadata(result.data);

          const user_id = result.data.get_user_id;

          setShowAnimation(false);
          setTimeout(() => {
            setFormSubmitLoader(false);
            AppCtx.manipulateIsAunthenticated(true);
            if (next === "Profile") {
              navigation.navigate("ProfileScreen");
            } else if (next === "Home") {
              navigation.navigate("HomeScreen");
            } else if (next === "chooseseats") {
              navigation.navigate("HomeStack", {
                screen: "PickSeatScreen",
                params: {
                  metadata: AppCtx.pickSeatScreenMetadata.metadata,
                  pickedSeats: AppCtx.pickSeatScreenMetadata.pickedSeats,
                },
              });
            }
          }, 1000);
        } else {
          setMessage("Invalid credentials");
          setIcon("close");
          setShowAnimation(false);
          setTimeout(() => {
            setFormSubmitLoader(false);
          }, 1000);
        }
      })
      .catch((err) => {
        let message = "Request failed";
        if (
          err.message.toLowerCase().includes("Unrecognized user".toLowerCase())
        ) {
          message = "Invalid credentials";
        }
        setMessage(message);
        setIcon("close");
        setShowAnimation(false);
        setTimeout(() => {
          setFormSubmitLoader(false);
        }, 1000);
      });
  }
  return (
    <Background>
      <View
        style={[
          styles.container,
          {
            position: "relative",
          },
        ]}
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
          <Text style={styles.title}>Login to Your Account</Text>

          <View style={styles.formInput}>
            {/* <TextInput
              label="Phone number"
              maxLength={10}
              placeholder="07XXXXXXXX"
              mode="outlined"
              value={phone.value}
              onChangeText={(text) => setPhone({ value: text, isValid: true })}
              keyboardType="numeric"
              style={styles.formInput}
              activeOutlineColor={phone.isValid ? "#495057" : "red"}
              outlineColor={phone.isValid ? "grey" : "red"}
            /> */}
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
                borderColor: "grey",
                borderWidth: 1,
              }}
              textContainerStyle={{
                backgroundColor: COLORS.light,
              }}
              withDarkTheme={false}
              withShadow
              autoFocus={false}
            />
          </View>
          <View style={styles.formInput}>
            <TextInput
              label="Enter PIN"
              maxLength={4}
              mode="outlined"
              value={nywila.value}
              onChangeText={(text) => setNywila({ value: text, isValid: true })}
              keyboardType="numeric"
              style={styles.formInput}
              activeOutlineColor={nywila.isValid ? "#495057" : "red"}
              outlineColor={nywila.isValid ? "grey" : "red"}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Register", {
                  ugroup: undefined,
                })
              }
              style={{
                alignSelf: "flex-end",
                marginVertical: 15,
                marginHorizontal: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "overpass-reg",
                  textDecorationColor: COLORS.danger,
                  textDecorationLine: "underline",
                  color: COLORS.light,
                }}
              >
                Register here
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
              style={{
                alignSelf: "flex-end",
                marginVertical: 15,
                marginHorizontal: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "overpass-reg",
                  textDecorationColor: COLORS.light,
                  textDecorationLine: "underline",
                  color: COLORS.light,
                }}
              >
                Forgot PIN?
              </Text>
            </TouchableOpacity>
          </View>
          <Button
            buttonColor={"grey"}
            textColor={COLORS.thirdary}
            labelStyle={{
              fontFamily: "montserrat-17",
            }}
            mode="contained"
            style={{
              backgroundColor: COLORS.primary,
            }}
            onPress={loginHandler}
          >
            Continue
          </Button>
        </View>
      </View>
    </Background>
  );
}

export default memo(LoginScreen);

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
    fontFamily: "overpass-reg",
    color: COLORS.light,
    textAlign: "center",
    fontSize: 20,
  },
  formInput: {
    marginVertical: "2%",
  },
});
