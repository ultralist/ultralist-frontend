// @flow

import React from "react"
import CssBaseline from "@material-ui/core/CssBaseline"
import blueGrey from "@material-ui/core/colors/blueGrey"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import { SnackbarProvider } from "notistack"

import Router from "../config/router"
import { WebsocketHandler } from "../config/websocket"

const theme = createMuiTheme({
  palette: {
    primary: blueGrey,
    secondary: {
      main: "#f44336"
    }
  }
})

window.socket = new WebsocketHandler()

const Index = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <SnackbarProvider maxSnack={1} preventDuplicate anchorOrigin={{ vertical: "top", horizontal: "left" }}>
        <MuiThemeProvider theme={theme}>
          <Router />
        </MuiThemeProvider>
      </SnackbarProvider>
    </React.Fragment>
  )
}

export default Index
