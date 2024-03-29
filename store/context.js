import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "../constants/domain";
import { _cacheImages } from "../utils";
import { fetchAvatars, fetchTrips, userNotifications } from "../utils/requests";
import { removeDuplicatedTrips } from "../utils";

export const AppContext = createContext({
  isAunthenticated: false,
  usermetadata: {},
  favIcon: "heart-outline",
  toggleFavorite: false,
  lastLoginPhoneNumber: null,
  registermetadata: {},
  alreadyValidated: false,
  stillExecutingUserMetadata: true,
  resetPhoneNumber: {},
  avatars: [],
  finishedCachingAvatars: false,
  trips: [],
  stillFetchingTrips: true,
  stillFetchingAvatars: true,
  userTripMetadata: null,
  pickSeatScreenMetadata: {},
  afterLoginNext: null,
  favTrips: [],
  usernotifications: [],
  manipulateIsAunthenticated: (value) => {},
  manipulateUserMetadata: (metadata) => {},
  manipulateFavIcon: (icon) => {},
  manipulateToggleFavorite: (status) => {},
  manipulateLastLoginPhoneNumber: (phoneNumber) => {},
  addRegisterMetadata: (metadata) => {},
  clearRegisterMetadata: () => {},
  manipulateAlreadyValidated: (status) => {},
  manipulateResetPhoneNumber: (metadata) => {},
  logout: () => {},
  updateAvatars: (avatars) => {},
  updateTrips: (trips) => {},
  manipulateFinishedCachingAvatars: (status) => {},
  manipulateStillFetchingTrips: (status) => {},
  manipulateStillFetchingAvatars: (status) => {},
  updateUserTripMetadata: (metadata) => {},
  manipulatePickSeatScreenMetadata: (metadata) => {},
  manipulateAfterLoginNext: (next) => {},
  manipulateFavTrips: (mt) => {},
  updateFavTrips: (mt) => {},
  updateusernotifications: (notifications) => {},
  manipulateusernotification: (notification) => {},
  markNotificationAsRead: (notification_id) => {},
});

function AppContextProvider({ children }) {
  const [isAunthenticated, setIsAunthenticated] = useState(false);
  const [usermetadata, setUserMetadata] = useState({});
  const [favIcon, setFavIcon] = useState("heart-outline");
  const [toggleFavorite, setToggleFavorite] = useState(false);
  const [lastLoginPhoneNumber, setLastLoginPhoneNumber] = useState(null);
  const [registermetadata, setRegisterMetadata] = useState({});
  const [alreadyValidated, setAlreadyValidated] = useState(false);
  const [resetPhoneNumber, setResetPhoneNumber] = useState({});
  const [avatars, setAvatars] = useState([]);
  const [pickSeatScreenMetadata, setPickSeatScreenMetadata] = useState({});
  const [finishedCachingAvatars, setFinishedCachingAvatars] = useState(false);
  const [stillExecutingUserMetadata, setStillExecutingUserMetadata] =
    useState(true);
  const [usernotifications, setUserNotifications] = useState([]);
  const [favTrips, setFavTrips] = useState([]);
  const [trips, setTrips] = useState([]);
  const [afterLoginNext, setAfterLoginNext] = useState(null);
  const [userTripMetadata, setUserTripMetadata] = useState(null);
  const [stillFetchingTrips, setStillFetchingTrips] = useState(true);
  const [stillFetchingAvatars, setStillFetchingAvatars] = useState(true);
  const manipulateIsAunthenticated = (value) => {
    setIsAunthenticated(value);
  };

  function manipulateFavIcon(icon) {
    setFavIcon(icon);
  }

  function manipulateLastLoginPhoneNumber(phone_number) {
    setLastLoginPhoneNumber(phone_number);
  }

  function manipulateAfterLoginNext(next) {
    setAfterLoginNext(next);
  }

  function manipulateusernotification(notification) {
    setUserNotifications((prevState) => {
      const notifications = [...prevState];
      const target = notifications
        .filter((notification) => notification.is_read === false)
        .find((noti) => +noti.id === +notification.id);
      if (target) {
        const targetIndex = notifications.findIndex(
          (noti) => +noti.id === +notification.id
        );
        notifications.splice(targetIndex, 1);
        // i post my new notifcation to array
        notifications.push(notification);
      } else {
        notifications.push(notification);
      }

      return notifications;
    });
  }

  function markNotificationAsRead(notification_id) {
    setUserNotifications((prevState) => {
      const notifications = [...prevState];
      const target = notifications.find(
        (notification) => +notification.id === +notification_id
      );
      if (target) {
        target.is_read = true;
      }
      return notifications;
    });
  }

  function updateusernotifications(notifications) {
    setUserNotifications(notifications);
  }

  function updateTrips(trips) {
    setTrips(trips);
  }

  function manipulateStillFetchingTrips(status) {
    setStillFetchingTrips(status);
  }

  function updateFavTrips(mt) {
    setFavTrips(mt);
  }

  async function manipulateFavTrips(mt) {
    const { metadata, status } = mt;
    if (status === "add") {
      let isTripExist = false;
      for (let item of favTrips) {
        if (
          item.destination.toLowerCase() ===
            metadata.destination.toLowerCase() &&
          item.from.toLowerCase() === metadata.from.toLowerCase()
        ) {
          isTripExist = true;
          break;
        }
      }
      if (!isTripExist) {
        // we need to add that to favTrips
        setFavTrips((prevState) => [
          { from: metadata.from, destination: metadata.destination },
          ...prevState,
        ]);
      }
    }
    if (status === "remove") {
      // the logic behind here is to check the number of occurance in context if we have the
      // more than one data having the same destination and from then no need to delete the
      // favorite because there is many saved favorite but if there is only one then we can
      // delete it, we can adjust the number in context by user do and undo favorite on route
      let data = await AsyncStorage.getItem("favorite-trips");
      data = JSON.parse(data);
      data = data.map((val) => JSON.parse(val));

      const filtered = data.filter(
        (val, _) =>
          val.from.toLowerCase() === metadata.from.toLowerCase() &&
          val.destination.toLowerCase() === metadata.destination.toLowerCase()
      );

      // if filtered is greater than one then we know there is more than one trip has been added as favorite
      // so no need to remove it..
      if (filtered.length > 1) {
        return;
      }

      const existing = favTrips.find(
        (item) =>
          item.from === metadata.from &&
          item.destination === metadata.destination
      );

      if (existing) {
        // then we should remove it
        const ft = [...favTrips];
        ft.splice(
          ft.findIndex(
            (item) =>
              item.from === metadata.from &&
              item.destination === metadata.destination
          ),
          1
        );
        setFavTrips(ft);
      }
    }
  }

  function manipulatePickSeatScreenMetadata(metadata) {
    setPickSeatScreenMetadata((prevState) => {
      return { ...prevState, metadata };
    });
  }

  function manipulateStillFetchingAvatars(status) {
    setStillFetchingAvatars(status);
  }

  function updateAvatars(avatars) {
    setAvatars(avatars);
  }

  function updateUserTripMetadata(metadata) {
    setUserTripMetadata(metadata);
  }

  function manipulateResetPhoneNumber(metadata) {
    setResetPhoneNumber((prevState) => {
      return {
        ...prevState,
        ...metadata,
      };
    });
  }

  function manipulateFinishedCachingAvatars(status) {
    setFinishedCachingAvatars(status);
  }

  function manipulateAlreadyValidated(status) {
    setAlreadyValidated(status);
  }

  function manipulateToggleFavorite(status) {
    setToggleFavorite(status);
  }

  function addRegisterMetadata(metadata) {
    setRegisterMetadata((prevState) => {
      return {
        ...prevState,
        ...metadata,
      };
    });
  }

  function clearRegisterMetadata() {
    setRegisterMetadata({});
  }

  function logout() {
    setRegisterMetadata({});
    setAlreadyValidated(false);
    setIsAunthenticated(false);
    setUserMetadata({});
    setStillExecutingUserMetadata(true);
    setPickSeatScreenMetadata({});
    setResetPhoneNumber({});
    setUserTripMetadata(null);
    setAfterLoginNext(null);
    setUserNotifications([]);
    AsyncStorage.removeItem("user_id");
  }

  const manipulateUserMetadata = (metadata) => {
    setUserMetadata((prevState) => {
      return {
        ...prevState,
        ...metadata,
      };
    });
  };

  async function executeUserMetadata() {
    let user_id = await AsyncStorage.getItem("user_id");
    let phone_number = await AsyncStorage.getItem("phone_number");
    setLastLoginPhoneNumber(phone_number);
    console.log("USER ID ", user_id);
    if (user_id) {
      try {
        const notifications = await userNotifications(user_id);
        console.log("Notifications for you ", notifications);
        setUserNotifications(notifications);
      } catch (error) {
        // this means "pass" in python if there is an error no need to bother
        // as the notification is not the main concept here, so it will pass
        // and continue fetching the userdetails
      }

      setIsAunthenticated(true);
      fetch(`${BASE_URL}/api/userdetails/`, {
        method: "POST",
        body: JSON.stringify({
          user_id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status !== 200) {
            if (response.status === 404) {
              throw new Error(`Unrecognized user group ${user_id}`);
            }
            response.json().then((data) => {
              throw new Error(data.details);
            });
          }
          return response.json();
        })
        .then(async (data) => {
          setUserMetadata(data);

          if (data.usergroup.toLowerCase() === "passenger") {
            // fetch again the notifications etc
          }
        })
        .catch((err) => {
          if (
            err.message
              .toLowerCase()
              .includes("Unrecognized user".toLowerCase())
          ) {
            // delete that user... i don't care about the result...

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
            })
              .then((response) => response.json())
              .then((data) => console.log("THIS IS RESOLVED RESPONSE ", data))
              .catch((err) =>
                console.log("THIS IS ERROR MESSAGE ", err.message)
              );
            console.log("I SHOULD LOGOUT THE USER");
            logout();
            setStillExecutingUserMetadata(false);
          } else {
            console.log("Whats happened ", err.message);

            logout();

            setStillExecutingUserMetadata(false);
          }
        });
    } else {
      setStillExecutingUserMetadata(false);
      // also you
    }
  }

  // Avatars is not our main concert so no need to avoid app being displayed
  // if the avatars didn't get loaded, its okay with trip and usermetadata to
  // have loading spinner until it full executed successful, but i think for
  // good user experience we should also have the loading for these avatars...
  // ITS OKAY TO HAVE THE LOADING FOR AVATARS
  async function getAvatars() {
    try {
      const data = await fetchAvatars();
      setAvatars(data);
      setStillFetchingAvatars(false);
    } catch (err) {
      console.log("Error fetching avatars ", err.message);
      alert(err.message);
      // its okay to continue showing spinner if there is problem
    }
  }

  // issue ipo hapa kwenye ku-get trips ndo ambapo inapita even if we have empty trips
  async function getTrips() {
    try {
      const data = await fetchTrips();
      // console.log("fetched data ", data);
      setTrips(data);
      setStillFetchingTrips(false);
    } catch (err) {
      console.log("Error fetching trips ", err.message);
      alert(err.message);
      // its okay to continue showing spinner if there is problem
    }
  }

  useEffect(() => {
    if (avatars.length > 0) {
      _cacheImages(avatars, ({ status }) => {
        console.log("Done caching avatars status: ", status);
        setFinishedCachingAvatars(true);
      });
    }
  }, [avatars.length]);

  useEffect(() => {
    if (usermetadata) {
      setStillExecutingUserMetadata(false);
    }
  }, [usermetadata]);

  useEffect(() => {
    executeUserMetadata();
    getAvatars();
    getTrips();
  }, []);

  useEffect(() => {
    const getFavTrips = async () => {
      let favtrips = await AsyncStorage.getItem("favorite-trips");
      if (favtrips) {
        const result = removeDuplicatedTrips(JSON.parse(favtrips));
        console.log("this is results for you ", result.reverse());
        setFavTrips(result);
      }
    };
    getFavTrips();
  }, []);

  const value = {
    isAunthenticated,
    usermetadata,
    favIcon,
    toggleFavorite,
    lastLoginPhoneNumber,
    registermetadata,
    alreadyValidated,
    stillExecutingUserMetadata,
    resetPhoneNumber,
    avatars,
    trips,
    finishedCachingAvatars,
    stillFetchingTrips,
    stillFetchingAvatars,
    userTripMetadata,
    pickSeatScreenMetadata,
    afterLoginNext,
    favTrips,
    usernotifications,
    manipulateIsAunthenticated,
    manipulateUserMetadata,
    manipulateFavIcon,
    manipulateToggleFavorite,
    manipulateLastLoginPhoneNumber,
    addRegisterMetadata,
    clearRegisterMetadata,
    manipulateAlreadyValidated,
    logout,
    manipulateResetPhoneNumber,
    updateAvatars,
    manipulateFinishedCachingAvatars,
    updateTrips,
    manipulateStillFetchingTrips,
    manipulateStillFetchingAvatars,
    updateUserTripMetadata,
    manipulatePickSeatScreenMetadata,
    manipulateAfterLoginNext,
    updateFavTrips,
    manipulateFavTrips,
    manipulateusernotification,
    updateusernotifications,
    markNotificationAsRead,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContextProvider;
