import { Asset } from "expo-asset";
import { CacheManager } from "react-native-expo-image-cache";
import { BASE_URL } from "../constants/domain";
import { useContext } from "react";
import * as FileSystem from "expo-file-system";
import moment from "moment";

export const _cacheResourcesAsync = async () => {
  const images = [
    require("../assets/images/background/1.jpg"),
    require("../assets/images/background/2.jpg"),
    require("../assets/images/background/3.jpg"),
    require("../assets/images/background/4.jpg"),
  ];

  const cacheImages = images.map((image) => {
    return Asset.fromModule(image).downloadAsync();
  });

  return Promise.all(cacheImages);
};

// Lets cache these images, in my case im trying to cache avatars
export const _cacheImages = (images, cb) => {
  // console.log("images ", images);
  images.forEach(async (image, index) => {
    const path = `${FileSystem.cacheDirectory}${image.get_image}`;
    let resource;
    try {
      resource = await FileSystem.getInfoAsync(path);
    } catch (error) {
      // if there is error we should end the execution since if resource does not exist
      // it should return "resource.exists" as false
      return cb({ status: "failed" });
    }
    if (resource.exists) {
      // then we're done caching
      if (index === images.length - 1) {
        cb({ status: "success" });
      }
    } else {
      // something can be wrong if we passed incorrect uri, there is
      // problem with downloadAsync here
      try {
        // Lets create directory
        await FileSystem.makeDirectoryAsync(path, { intermediates: true });
        await FileSystem.downloadAsync(`${BASE_URL}${image.get_image}`, path);
        // then we're done caching
        if (index === images.length - 1) {
          cb({ status: "success" });
        }
      } catch (error) {
        console.log("error ", error);
        // then we're done caching
        if (index === images.length - 1) {
          cb({ status: "failed" });
        }
      }
    }
  });
};

export const computeTimeTo12Format = (time) => {
  const splittedTime = time.split(":");
  const AmOrPm = splittedTime[0] >= 12 ? "PM" : "AM";
  const hours = splittedTime[0] % 12 || 12;
  const finalTime = hours + ":" + splittedTime[1] + " " + AmOrPm;

  return finalTime;
};

export const computeDifferenceBetweenTimes = (start, end) => {
  // i expect this time format "12:18 am"
  var startTime = moment(start, "HH:mm a");
  var endTime = moment(end, "HH:mm a");

  var duration = moment.duration(endTime.diff(startTime));

  // duration in hours
  var hours = parseInt(duration.asHours());

  // duration in minutes
  var minutes = parseInt(duration.asMinutes()) % 60;

  return `${hours}h ${minutes}m`;
};
