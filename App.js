import React, { useState, useEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Font from "expo-font";
import { COLORS } from "./constants/colors";
import NetInfo from "@react-native-community/netinfo";
import { LoadingSpinner } from "./components/ui";
import IntroScreen from "./screens/IntroScreen";
import HomeScreen from "./screens/BottomTabs/HomeStack/HomeScreen";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DetailsScreen from "./screens/BottomTabs/HomeStack/DetailsScreen";
import BusDetailsScreen from "./screens/BottomTabs/HomeStack/BusDetailsScreen";
import PickSeatsScreen from "./screens/BottomTabs/HomeStack/PickSeatsScreen";
import Notification from "./screens/BottomTabs/NotificationStack";
import FillPassengerInfo from "./screens/BottomTabs/HomeStack/PassengerInfo";
import ProfileScreen from "./screens/BottomTabs/ProfileStack";
import AppContextProvider, { AppContext } from "./store/context";
import RegisterScreen from "./screens/BottomTabs/ProfileStack/Auth/RegisterScreen";
import LoginScreen from "./screens/BottomTabs/ProfileStack/Auth/LoginScreen";
import EnterOTPScreen from "./screens/BottomTabs/ProfileStack/Auth/EnterOTPScreen";
import SetPinScreen from "./screens/BottomTabs/ProfileStack/Auth/SetPinScreen";
import ForgotPassword from "./screens/BottomTabs/ProfileStack/Auth/ForgotPassword";
import PickAvatarScreen from "./screens/BottomTabs/ProfileStack/PickAvatar";
import Payment from "./screens/BottomTabs/HomeStack/Payment";
import MyTickets from "./screens/BottomTabs/ProfileStack/MyTickets";
import TicketDetails from "./screens/BottomTabs/ProfileStack/MyTickets/TicketDetails";
import ValidateTicket from "./screens/BottomTabs/ProfileStack/ValidateTicket";
import { _cacheResourcesAsync } from "./utils";
import { NativeBaseProvider } from "native-base";
import * as Notifications from "expo-notifications";
import ViewNotification from "./screens/BottomTabs/NotificationStack/view-notification";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

const Stack = createNativeStackNavigator();
const Stack1 = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function TabIcon({ focused, color, size, name }) {
  return <Ionicons color={focused ? color : "grey"} name={name} size={size} />;
}

function MyTabs() {
  const AppCtx = useContext(AppContext);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          alert("Allow this app to send you notifications");
          return;
        }
      }
    })();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        headerShown: false,
        lazy: true,
        tabBarActiveTintColor: COLORS.darkprimary,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        options={{
          title: "Home",
          tabBarIcon: ({ focused, size, color }) => (
            <TabIcon size={size} color={color} name="home" focused={focused} />
          ),
        }}
        name="HomeStack"
        component={HomeStack}
      />
      <Tab.Screen
        options={{
          title: "NotificationStack",
          tabBarBadge:
            AppCtx.usernotifications.filter((noti) => !noti.is_read).length < 1
              ? null
              : AppCtx.usernotifications.filter((noti) => !noti.is_read).length,
          tabBarIcon: ({ focused, size, color }) => (
            <TabIcon
              size={size}
              color={color}
              name="notifications"
              focused={focused}
            />
          ),
        }}
        name="NotificationStack"
        component={NotificationStack}
      />
      <Tab.Screen
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, size, color }) => (
            <TabIcon
              size={size}
              color={color}
              name="person"
              focused={focused}
            />
          ),
        }}
        name="ProfileStack"
        component={ProfileStack}
      />
    </Tab.Navigator>
  );
}

function NotificationStack({ navigation }) {
  return (
    <Stack1.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.ModalPresentationIOS,
      }}
    >
      <Stack1.Screen name="Notifications" component={Notification} />
      <Stack1.Screen
        name="ViewNotification"
        options={{
          headerShown: true,
          headerTitle: "Notification",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: "montserrat-17",
            textTransform: "capitalize",
          },
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Notifications")}
            >
              <Text
                style={{
                  color: "#fff",
                  marginLeft: 10,
                  fontFamily: "montserrat-17",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: COLORS.darkprimary,
          },
        }}
        component={ViewNotification}
      />
    </Stack1.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="RouteSearchDetails" component={DetailsScreen} />
      <Stack.Screen name="BusDetailsScreen" component={BusDetailsScreen} />
      <Stack.Screen name="PickSeatsScreen" component={PickSeatsScreen} />
      <Stack.Screen name="FillPassengerInfo" component={FillPassengerInfo} />
      <Stack.Screen name="Payment" component={Payment} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  const AppCtx = useContext(AppContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="PickAvatarScreen" component={PickAvatarScreen} />
      <Stack.Screen name="MyTickets" component={MyTickets} />
      <Stack.Screen name="ValidateTicket" component={ValidateTicket} />
      <Stack.Screen name="TicketDetails" component={TicketDetails} />
      {!AppCtx.isAunthenticated && (
        <>
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="VerifyOTPScreen" component={EnterOTPScreen} />
          <Stack.Screen name="SetPinScreen" component={SetPinScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </>
      )}
    </Stack.Navigator>
  );
}

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* this will be rendered if user open the app for first time */}
        <Stack.Screen component={IntroScreen} name="IntroScreen" />
        {/* then we have this full app with bottom tabs and nested stack */}

        <Stack.Screen component={MyTabs} name="MyTabs" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const NetworkCheck = ({ status, type }) => {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.statusText}>
        Connection Status : {status ? "Connected" : "Disconnected"}
      </Text>
      <Text style={styles.statusText}>Connection Type : {type}</Text> */}
      <Animation
        style={{
          width: 220,
          alignSelf: "center",
          aspectRatio: 1,
        }}
        source={require("./assets/LottieAnimations/animation_lkffzc96.json")}
      />
    </View>
  );
};

export default function App() {
  const [fontsLoaded] = Font.useFonts({
    "overpass-reg": require("./assets/fonts/personalyzer/Overpass-Regular.ttf"),
    "montserrat-17": require("./assets/fonts/Montserrat/Montserrat-SemiBold.ttf"),
  });

  const [connectionStatus, setConnectionStatus] = useState(false);
  const [connectionType, setConnectionType] = useState(null);
  const [needupdate, setNeedUpdate] = useState(false);
  const [stillCheckingVersion, setStillCheckingVersion] = useState(true);
  const [updateMetadata, setUpdateMetadata] = useState();
  const [appIsReady, setAppIsReady] = useState(false);

  // lets load resources without waiting
  // it takes about 6seconds which is bad user experience, so what i did is i load these resources on App.js without waiting so if it will be
  // loaded before going to profile screen then its lucky to user, otherwise its will be ugly which i think this is best approach since its
  // 50% to 50%
  // most these resources are only used when user go to Profile stack so lets load them but we should not wait for them to load to show ui
  useEffect(() => {
    const loadResources = async () => {
      await _cacheResourcesAsync();
    };
    loadResources();
  }, []);

  useEffect(() => {
    const loadResources = async () => {
      await Font.loadAsync(Ionicons.font); // loads the Ionicons font which we have been used its icons on Bottom Tabs
      await Font.loadAsync(MaterialCommunityIcons.font); // this icons used by react native paper inputs
      setAppIsReady(true);
    };
    loadResources();
  }, []);

  useEffect(() => {
    const netInfoSubscription = NetInfo.addEventListener(handleNetworkChange);
    return () => {
      netInfoSubscription && netInfoSubscription();
    };
  }, []);

  const handleNetworkChange = (state) => {
    setConnectionStatus(state.isConnected);
    setConnectionType(state.type);
  };

  // i think here is where we experience too much loading, if we use AppIsReady is make the application slow in some seconds as this process
  // i measured it in my phone it take almost 3 to 5 seconds to be loaded which i think its bad use experience so initialy the conditon was
  // if (!appIsReady || !fontsLoaded) so i think there is no way the user can be faster to take out the into screen as it need user to toggle on
  // to proceed, our logic here of having the 'useEffect' to load these icons of Ionicons and MaterialCommunityIcons its okay but the logic of waiting
  // for them to complete loading i think in my case its not fine since it causes almost to wait for 4 to 5 seconds and as i told you in most case it
  // takes the user 3 to 5 seconds to move out of intro screen
  if (!fontsLoaded) {
    console.log("IM CACHING THE IMAGE");
    return <LoadingSpinner />;
  }

  return (
    <NativeBaseProvider>
      <GestureHandlerRootView
        style={{
          flex: 1,
        }}
      >
        <StatusBar style="light" />
        {connectionStatus ? (
          <AppContextProvider>
            <Navigation />
          </AppContextProvider>
        ) : (
          <NetworkCheck status={connectionStatus} type={connectionType} />
        )}
      </GestureHandlerRootView>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
