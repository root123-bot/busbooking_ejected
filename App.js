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
      screenOptions={{
        headerShown: false,
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
    "roboto-reg": require("./assets/fonts/personalyzer/Roboto-Regular.ttf"),
    "roboto-med": require("./assets/fonts/personalyzer/Roboto-MediumItalic.ttf"),
    "montserrat-1": require("./assets/fonts/Montserrat/Montserrat-Italic-VariableFont_wght.ttf"),
    "montserrat-2": require("./assets/fonts/Montserrat/Montserrat-VariableFont_wght.ttf"),
    "montserrat-3": require("./assets/fonts/Montserrat/static/Montserrat-Black.ttf"),
    "montserrat-4": require("./assets/fonts/Montserrat/static/Montserrat-BlackItalic.ttf"),
    "montserrat-5": require("./assets/fonts/Montserrat/static/Montserrat-Bold.ttf"),
    "montserrat-6": require("./assets/fonts/Montserrat/static/Montserrat-BoldItalic.ttf"),
    "montserrat-7": require("./assets/fonts/Montserrat/static/Montserrat-ExtraBold.ttf"),
    "montserrat-8": require("./assets/fonts/Montserrat/static/Montserrat-ExtraBoldItalic.ttf"),
    "montserrat-9": require("./assets/fonts/Montserrat/static/Montserrat-ExtraLight.ttf"),
    "montserrat-10": require("./assets/fonts/Montserrat/static/Montserrat-ExtraLightItalic.ttf"),
    "montserrat-11": require("./assets/fonts/Montserrat/static/Montserrat-Italic.ttf"),
    "montserrat-12": require("./assets/fonts/Montserrat/static/Montserrat-Light.ttf"),
    "montserrat-13": require("./assets/fonts/Montserrat/static/Montserrat-LightItalic.ttf"),
    "montserrat-14": require("./assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
    "montserrat-15": require("./assets/fonts/Montserrat/static/Montserrat-MediumItalic.ttf"),
    "montserrat-16": require("./assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
    "montserrat-17": require("./assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
    "montserrat-18": require("./assets/fonts/Montserrat/static/Montserrat-SemiBoldItalic.ttf"),
    "montserrat-19": require("./assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
    "montserrat-20": require("./assets/fonts/Montserrat/static/Montserrat-ThinItalic.ttf"),
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

  if (!appIsReady || !fontsLoaded) {
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
