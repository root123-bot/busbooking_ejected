import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";
import * as RNPaper from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { AppContext } from "../../../store/context";
import { CustomImageCache } from "../../../components/ui";
import { UpdateAvatar } from "../../../utils/requests";

function PickAvatarScreen({ navigation }) {
  const AppCtx = useContext(AppContext);

  const saveAvatarHandler = () => {
    AppCtx.manipulateUserMetadata({
      ...AppCtx.usermetadata,
      get_avatar: selectedAvatar.get_image,
    });

    navigation.navigate("ProfileScreen");

    // lets now upload image to the backend
    UpdateAvatar(AppCtx.usermetadata.get_user_id, selectedAvatar.id);
  };

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
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
                  <TouchableOpacity
                    onPress={() => navigation.navigate("ProfileScreen")}
                  >
                    <Ionicons name="arrow-back" size={24} color="white" />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: "60%",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  ></View>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <RNPaper.Text
                      style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: "bold",
                      }}
                    >
                      Pick avatar
                    </RNPaper.Text>
                    <RNPaper.Text
                      style={{
                        color: "white",
                        fontSize: 12,
                        fontFamily: "overpass-reg",
                      }}
                    >
                      Tap any avatar to select{" "}
                    </RNPaper.Text>
                  </View>
                </View>
                <View
                  style={{
                    width: "20%",
                    alignItems: "flex-end",
                  }}
                >
                  <TouchableOpacity onPress={saveAvatarHandler}>
                    <RNPaper.Text style={styles.save}>Save</RNPaper.Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
        <ScrollView>
          <View
            style={{
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
              paddingVertical: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {AppCtx.avatars.map((avatar, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    marginBottom: 15,
                    width: 100,
                    height: 100,
                  }}
                  onPress={() => setSelectedAvatar(avatar)}
                >
                  <CustomImageCache
                    uri={avatar.get_image}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 100 / 2,
                    }}
                  />
                  {selectedAvatar && selectedAvatar.id === avatar.id && (
                    <View
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                      }}
                    >
                      <Image
                        style={{
                          width: 30,
                          height: 30,
                        }}
                        source={require("../../../assets/images/icons/check.png")}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

export default PickAvatarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  save: {
    color: "white",
    fontSize: 15,
  },
});
