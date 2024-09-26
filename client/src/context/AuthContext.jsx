import { createContext, useEffect, useReducer } from "react";

const initialState = {
  user: localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null,
  token: localStorage.getItem("token"),
  activationToken: localStorage.getItem("activationToken"),
  activation_Code: localStorage.getItem("activation_Code")
};

export const authContext = createContext(initialState);

const authReducer = (state, action) =>
{
  switch (action.type)
  {
    case "ACTIVATE_USER":
      return {
        activationToken: action.payload.activationToken,
        activation_Code: action.payload.activation_Code,
        user: null,
        token: null
      }

    case "VERIFY_OTP":
      return {
        activationToken: null,
        activation_Code: null,
      }

    case "LOGIN_START":
      return {
        user: null,
        token: null,
      };

    case "LOGIN_SUCCESS":
      return {
        user: action.payload.user,
        token: action.payload.accessToken,
        activationToken: null,
        activation_Code: null
      };

    case "LOGOUT":
      return {
        user: null,
        token: null,
        activationToken: null,
        activation_Code: null,
      };

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) =>
{
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() =>
  {
    localStorage.setItem("user", JSON.stringify(state.user))
    localStorage.setItem("token", state.token);
    localStorage.setItem("activationToken", state.activationToken);
    localStorage.setItem("activation_Code", state.activation_Code);
  }, [state])

  return (
    <authContext.Provider
      value={{
        user: state.user,
        token: state.token,
        activationToken: state.activationToken,
        activation_Code: state.activation_Code,
        dispatch,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
