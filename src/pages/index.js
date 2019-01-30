// @flow
import React from "react"
import CssBaseline from "@material-ui/core/CssBaseline"
import indigo from "@material-ui/core/colors/indigo"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"

import Router from "../config/router"
import { WebsocketHandler } from "../config/websocket"

const theme = createMuiTheme({
  palette: {
    primary: indigo,
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
      <MuiThemeProvider theme={theme}>
        <Router />
      </MuiThemeProvider>
    </React.Fragment>
  )
}

export default Index
