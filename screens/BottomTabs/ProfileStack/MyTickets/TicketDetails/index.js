import React, { memo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
  Share,
} from "react-native";
import ScreenHeader from "../ScreenHeader";
import { COLORS } from "../../../../../constants/colors";
import { Button } from "react-native-paper";
import Details from "./Details";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { TransparentPopUpIconMessage } from "../../../../../components/Messages";

function TicketDetails({ route }) {
  const [status, requestPermission] = MediaLibrary.usePermissions();

  const [showAnimation, setShowAnimation] = useState(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");

  const ref = useRef();

  async function handleDownload() {
    console.log("hello world ", status);
    const output = await MediaLibrary.getPermissionsAsync();
    console.log("OUTPUT ", output);
    if (status.status === "undetermined" && status.canAskAgain) {
      return requestPermission();
    }

    if (status.status === "denied" && !status.canAskAgain) {
      // we can't ask for user permission for this we should show the
      // alert for the user to open settings and manually allow this..
      return Alert.alert(
        "Allow permission",
        "You should allow this app to save screenshot on photo library.",
        [
          {
            text: "Cancel",
          },
          {
            text: "Continue",
            style: "destructive",
            onPress: () => {
              return Linking.openURL("app-settings:");
            },
          },
        ]
      );
    }
    setFormSubmitLoader(true);
    setShowAnimation(true);
    ref.current
      .capture()
      .then(async (uri) => {
        await MediaLibrary.saveToLibraryAsync(uri);
        if (uri) {
          setIcon("check-circle-outline");
          setMessage("Screenshot saved");
          setTimeout(() => {
            setShowAnimation(false);
            setTimeout(async () => {
              setFormSubmitLoader(false);
              // lets invoke sharing of the screenshot..
              // ON IOS WE CAN REMOVE THE LOGIC TO SAVE THE SCREENSHOT ON THE DEVICE ABOVE AND ONLY DEPEND ON THE
              // THIS SHARE FUNCTIONALITY WHICH COME WITH ALL FEATURES LIKE SHARING ON APP AND SAVE TO PHOTOS AND SO
              // ON I THINK THIS WILL BE GOOD AS IT WILL DOES NOT REQUIRE US TO ASK FOR THE USER TO ALLOW PERMISSION
              // FOR OUR APP TO SAVE PHOTOS TO DEVICE STORAGE SINCE IF USER CLICK THE SAVE BUTTON ON SHARE IT MEANS
              // SHE ALLOWED THE PERMISSION I THINK THIS IS OKAY AND MORE SECURE SINCE IN IOS WE HAVE THE PROBLEM OF THE
              // 'ADD TO PHOTO LIBRARY' ONLY WHICH EVEN IF USER ALLOW THIS IT WILL STILL MAKE MEDIALIBRARY PERMISSION DENIED
              // we can update this later i think for now lets leave it alone,, but this share functionality have many
              // options like save to device, share to social media and so on which does not require us to check and ask for
              // permission
              try {
                await Share.share({
                  message: "Ticket Screenshot!",
                  url: uri,
                });
              } catch (error) {
                console.error("Error sharing the screenshot: ", error);
              }
            }, 1500);
          }, 1500);
        } else {
          setIcon("error-outline");
          setMessage("Failed");
          setTimeout(() => {
            setShowAnimation(false);
            setTimeout(() => {
              setFormSubmitLoader(false);
            }, 1500);
          }, 1500);
        }
      })
      .catch((err) => {
        setIcon("error-outline");
        setMessage("Failed");
        setTimeout(() => {
          setShowAnimation(false);
          setTimeout(() => {
            setFormSubmitLoader(false);
          }, 1500);
        }, 1500);
        console.log("this is error for you ", err);
      });
  }

  return (
    <View
      style={{
        position: "relative",
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <View
        style={{
          display: formSubmitLoader ? "flex" : "none",
          position: "absolute",
          top: "40%",
          zIndex: 10000000000,
          alignSelf: "center",
          width: 150,
          height: 150,
          justifyContent: "center",
        }}
      >
        <TransparentPopUpIconMessage
          messageHeader={message}
          icon={icon}
          inProcess={showAnimation}
        />
      </View>

      <View
        style={[styles.container]}
        pointerEvents={formSubmitLoader ? "none" : "auto"}
      >
        <ScreenHeader title={"Ticket Details"} />
        <ViewShot
          ref={ref}
          options={{
            fileName: "ticket-123", // screenshot image name
            format: "jpg", // image extention
            quality: 0.9, // image quality
          }}
          style={{
            flex: 1,
          }}
        >
          <ScrollView
            style={{
              padding: 15,
              paddingTop: 0,
              flex: 1,
            }}
            collapsable={false}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              marginBottom: 50, // this is width of lower download button so we make sure our scrollview does not take any space of button it should remain in available space, also it automatically does not take the space of top header so its look fine
            }}
          >
            <Details />
          </ScrollView>
        </ViewShot>
      </View>
      <View
        pointerEvents={formSubmitLoader ? "none" : "auto"}
        style={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          left: 0,
          backgroundColor: "#E5E5E5",
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
            paddingHorizontal: 20,
            borderTopColor: "grey",
            borderTopWidth: 0.5,
          }}
        >
          <Button
            mode="contained"
            style={{
              width: "100%",
              backgroundColor: COLORS.darkprimary,
              borderRadius: 20,
            }}
            loading={formSubmitLoader}
            onPress={handleDownload}
          >
            Download
          </Button>
        </View>
      </View>
    </View>
  );
}

export default memo(TicketDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
