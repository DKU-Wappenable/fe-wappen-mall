import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AutoLogoutManager from "./components/AutoLogoutManager";
import { UserProvider } from "./components/UserContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <AutoLogoutManager />
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
