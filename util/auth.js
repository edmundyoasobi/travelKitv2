import axios from "axios";

const API_KEY = "AIzaSyCzT3GSf8zzk6YLfIQQwgH2Tq9-tGtdrug";

export async function createUser(email, password) {

  try {
    const response = await axios.post(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
        API_KEY,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );

    const token = response.data.idToken;
    return [token, response.data.localId];
  } catch (error) {
    console.log(error);
  }
}

export async function loginUser(email, password) {
  console.log(email)
  try {
    const response = await axios.post(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
        API_KEY,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );


    const token = response.data.idToken;
    return [token, response.data.localId];
  } catch (error) {
    console.log(error);
    throw new Error("Login failed");
  }
}
