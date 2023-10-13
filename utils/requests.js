import { BASE_URL } from "../constants/domain";

export const getOTP = async (phone_number) => {
  console.log("Full url ", `${BASE_URL}/api/sendotp/`);
  console.log("THIS IS PHONE NUMBER ", phone_number);
  return fetch(`${BASE_URL}/api/sendotp/`, {
    method: "POST",
    body: JSON.stringify({
      phone_number: phone_number,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      console.log("This is status code ", response.status);
      if (response.status === 200) {
        return response.json();
      } else {
        response.json().then((output) => {
          console.log("OUTPUT ", output);
          throw new Error(output);
        });
      }
    })
    .then((data) => Promise.resolve({ data }))
    .catch((error) => {
      return Promise.reject({ error });
    });
};

export const validateOTP = async (phone_number, otp) => {
  return fetch(`${BASE_URL}/api/validateotp/`, {
    method: "POST",
    body: JSON.stringify({
      phone_number,
      otp,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        response.json().then((output) => {
          throw new Error(output);
        });
      }
    })
    .then((data) => Promise.resolve({ data }))
    .catch((error) => Promise.reject({ error }));
};

export const registerUser = async (phone_number, usergroup, pin, deviceID) => {
  return fetch(`${BASE_URL}/api/register/`, {
    method: "POST",
    body: JSON.stringify({
      phone_number,
      usergroup,
      pin,
      deviceID,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 409) {
        // see in donSkip.txt why i avoid resolving
        // the message .json() found in..
        throw new Error("User already exist");
      } else {
        throw new Error("Failed try again.");
      }
    })
    .then((data) => Promise.resolve({ data }))
    .catch((error) => Promise.reject(error));
};

export const executeUserMetadata = async (uid) => {
  let user_id = uid ? uid : await AsyncStorage.getItem("user_id");
  return fetch(`${BASE_URL}/api/userdetails/`, {
    method: "POST",
    body: JSON.stringify({
      user_id: user_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.status !== 200) {
        if (res.status === 404) {
          throw new Error(`Unrecognized user group ${user_id}`);
        }
      }
      return res.json();
    })
    .then((resData) => {
      return Promise.resolve(resData);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

export const loginUser = async (phone, password) => {
  return fetch(`${BASE_URL}/api/login/`, {
    method: "POST",
    body: JSON.stringify({
      phone,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        if (response.status === 401) {
          throw new Error(`Unrecognized user group`);
        }
        throw new Error("Server error");
      }
    })
    .then((data) => Promise.resolve(data))
    .catch((error) => Promise.reject(error));
};

export const resetPIN = async (user_id, pin) => {
  return fetch(`${BASE_URL}/api/resetpin/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
      pin,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      console.log("This is status code ", response.status);
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Something went wrong");
      }
    })
    .then((data) => Promise.resolve({ data }))
    .catch((error) => {
      return Promise.reject({ error });
    });
};

export const isUserExist = async (phone_number) => {
  return fetch(`${BASE_URL}/api/isuserexist/`, {
    method: "POST",
    body: JSON.stringify({
      phone: phone_number,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Server error");
      }
    })
    .then((data) => Promise.resolve(data))
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const fetchTrips = async () => {
  return fetch(`${BASE_URL}/api/alltrips/`)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Server error");
      }
    })
    .then((data) => Promise.resolve(data))
    .catch((error) => Promise.reject(error));
};

export const fetchAvatars = async () => {
  return fetch(`${BASE_URL}/api/avatars/`)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Server error");
      }
    })
    .then((data) => Promise.resolve(data))
    .catch((error) => Promise.reject(error));
};

export const UpdateAvatar = async (user_id, avatar_id) => {
  return fetch(`${BASE_URL}/api/updateavatar/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
      avatar_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("ERROR IN UPDATING THE AVATAR IMAGE");
      }
    })
    .then((data) => Promise.resolve(data))
    .catch((error) => Promise.reject(error));
};
