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

const theme = createMuiTheme({
  palette: {
    primary: blueGrey,
    secondary: {
      main: "#f44336"
    }
  }
})

const stripePromise = loadStripe("pk_test_fVIfLmG59tZ59sEKYuLqCCFM")

window.socket = new WebsocketHandler()

const storage = new BrowserStorage()

const Index = () => {
  return (
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
  )
}

export default Index
