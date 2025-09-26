// import { API_URL } from "../config";
import axios from "axios";
export default {
  login: (user) => {
    return axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, user)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log("err", err.response.data.message);
        return {
          isAuthenticated: false,
          user: { username: "", role: "", id: "", name: "", image: "" },
          error: err,
        };
      });
  },
  // login: async (user) => {
  //   console.log("user", user);
  //   try {
  //     console.log("res", `${process.env.NEXT_PUBLIC_API_URL}/users/login`);
  //     const res = await axios.post(
  //       `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
  //       user
  //     );
  //     return res.data;
  //   } catch (err) {
  //     return {
  //       isAuthenticated: false,
  //       user: { username: "", role: "", id: "", name: "", image: "" },
  //       error: err,
  //     };
  //   }
  // },
  championRegister: async (user) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/champion/register`,
        user
      );
      return res.data;
    } catch (err) {
      return {
        isAuthenticated: false,
        user: { username: "", role: "", id: "", name: "", image: "" },
        error: err,
      };
    }
  },
  // register: (user) => {
  //   return axios
  //     .post(`${API_URL}/users/register`, user)
  //     .then((res) => {
  //       return res.data;
  //     })
  //     .catch((err) => {
  //       return {
  //         error: err,
  //       };
  //     });
  // },
  register: async (user) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
        user
      );
      return res.data;
    } catch (err) {
      return {
        error: err,
      };
    }
  },
  // logout: () => {
  //   return axios
  //     .get(`${API_URL}/users/logout`)
  //     .then((res) => {
  //       return res.data;
  //     })
  //     .catch((err) => {
  //       return {
  //         error: err,
  //       };
  //     });
  // },
  logout: async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/logout`
      );
      return res.data;
    } catch (err) {
      return {
        error: err,
      };
    }
  },
  isAuthenticated: () => {
    return axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users/authenticated`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return {
          error: err,
          isAuthenticated: false,
          user: { username: "", role: "", id: "", name: "", image: "" },
        };
      });
  },
  // isAuthenticated: async () => {
  //   try {
  //     const res = await axios.get(
  //       `${process.env.NEXT_PUBLIC_API_URL}/users/authenticated`
  //     );
  //     return res.data;
  //   } catch (err) {
  //     return {
  //       error: err,
  //       isAuthenticated: false,
  //       user: { username: "", role: "", id: "", name: "", image: "" },
  //     };
  //   }
  // },
};
