import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import AuthProvider from "./components/auth/AuthProvider.jsx";
import { PresenceProvider } from "./context/PresenceContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <PresenceProvider>
          <App />
          </PresenceProvider>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);