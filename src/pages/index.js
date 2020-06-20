// @flow

import React from "react"
import CssBaseline from "@material-ui/core/CssBaseline"
import blueGrey from "@material-ui/core/colors/blueGrey"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import { SnackbarProvider } from "notistack"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

import Router from "../config/router"
import { WebsocketHandler } from "../config/websocket"

import StorageContext from "../shared/storageContext"
import BrowserStorage from "../shared/storage/browserStorage"

import BackendContext from "../shared/backendContext"
import ApiBackend from "../shared/backend/backends/apiBackend"

const theme = createMuiTheme({
  transitions: {
    duration: {
      shortest: 75,
      shorter: 100,
      short: 125,
      standard: 150,
      complex: 175,
      enteringScreen: 125,
      leavingScreen: 95
    }
  },
  palette: {
    primary: blueGrey,
    secondary: {
      main: "#f44336"
    }
  }
})

const key =
  process.env.NODE_ENV === "production"
    ? "pk_live_wckW32WrC7uGWJUuLpU8AJ1k"
    : "pk_test_fVIfLmG59tZ59sEKYuLqCCFM"

const stripePromise = loadStripe(key)

window.socket = new WebsocketHandler()

const storage = new BrowserStorage()
const backend = new ApiBackend()

const Index = () => {
  return (
    <BackendContext.Provider value={backend}>
      <StorageContext.Provider value={storage}>
        <Elements stripe={stripePromise}>
          <CssBaseline />
          <SnackbarProvider
            maxSnack={1}
            preventDuplicate
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <MuiThemeProvider theme={theme}>
              <Router />
            </MuiThemeProvider>
          </SnackbarProvider>
        </Elements>
      </StorageContext.Provider>
    </BackendContext.Provider>
  )
}

export default Index
