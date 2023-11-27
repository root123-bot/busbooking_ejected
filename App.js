import React, { useState, useEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  BackHandler,
  useWindowDimensions,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { COLORS } from "./constants/colors";
import NetInfo from "@react-native-community/netinfo";
import { _cacheResourcesAsync } from "./utils";
import { LoadingSpinner } from "./components/ui";
import IntroScreen from "./screens/IntroScreen";
import HomeScreen from "./screens/BottomTabs/HomeStack/HomeScreen";
import { Ionicons } from "@expo/vector-icons";
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

const Stack = createNativeStackNavigator();
const Stack1 = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function TabIcon({ focused, color, size, name }) {
  return <Ionicons color={focused ? color : "grey"} name={name} size={size} />;
}

function MyTabs() {
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

function NotificationStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Notificatons" component={Notification} />
    </Stack.Navigator>
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
  const [fontsLoaded] = useFonts({
    "overpass-reg": require("./assets/fonts/personalyzer/Overpass-Regular.ttf"),
    "montserrat-17": require("./assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
  });

  const [connectionStatus, setConnectionStatus] = useState(false);
  const [connectionType, setConnectionType] = useState(null);
  const [needupdate, setNeedUpdate] = useState(false);
  const [stillCheckingVersion, setStillCheckingVersion] = useState(true);
  const [updateMetadata, setUpdateMetadata] = useState();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      await _cacheResourcesAsync();
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

  // i think here is where we experience too much loading
  if (!appIsReady || !fontsLoaded) {
    console.log("IM CACHING NORMAL IMAGES RESOURCES FOR YOU");
    return <LoadingSpinner />;
  }

  return (
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
