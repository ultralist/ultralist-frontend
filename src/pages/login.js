// @flow
import React from "react"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import Paper from "@material-ui/core/Paper"
import { makeStyles } from "@material-ui/styles"

import TopBar from "../components/topBar"

import { backendUrl } from "../backend/backend"
import { isUserLoggedIn } from "../models/user"

const useStyles = makeStyles({
  middle: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  loginPaper: {
    width: 400,
    padding: 40,
    display: "flex",
    flexDirection: "column"
  },
  paperItem: {
    margin: 20
  }
})

const Login = props => {
  const classes = useStyles()

  if (isUserLoggedIn()) {
    props.history.push("/todolist")
    return null
  }

  return (
    <React.Fragment>
      <TopBar />
      <div className={classes.middle}>
        <Paper className={classes.loginPaper}>
          <Typography variant="h4" marked="center" align="center">
            Sign In
          </Typography>
          <Button variant="contained" color="default" href={`${backendUrl()}/users/auth/google_oauth2`} className={classes.paperItem}>
            Login with Google
          </Button>
          <Button variant="contained" color="default" href={`${backendUrl()}/users/auth/github`} className={classes.paperItem}>
            Login with Github
          </Button>
        </Paper>
      </div>
    </React.Fragment>
  )
}

export default Login
