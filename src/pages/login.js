// @flow
import React from "react"
import { Link } from "react-router-dom"

import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import Paper from "@material-ui/core/Paper"
import { makeStyles } from "@material-ui/styles"

import TopBar from "../components/topBar"

import { backendUrl } from "../constants"

import StorageContext from "../shared/storageContext"
import UserStorage from "../shared/storage/userStorage"
import SlackStorage from "../shared/storage/slackStorage"

import utils from "../utils"

const useStyles = makeStyles({
  middle: {
    backgroundColor: "#f5f5f5",
    paddingTop: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  loginPaper: {
    width: 500,
    padding: 40,
    display: "flex",
    flexDirection: "column"
  },
  paperItem: {
    margin: 20
  },
  margined: {
    margin: 20
  }
})

const Login = props => {
  const classes = useStyles()
  const storageContext = React.useContext(StorageContext)
  const userStorage = new UserStorage(storageContext)

  userStorage.setCLIAuth(utils.getUrlParam("cli_auth") === "true")

  userStorage.setSlackAppInstalled(
    utils.getUrlParam("slack_app_installed") === "true"
  )

  if (utils.getUrlParam("slack_user_auth") === "true") {
    const slackStorage = new SlackStorage(storageContext)
    slackStorage.setSlackAuthParams()
  }

  userStorage.setSlackAppInstalled(
    utils.getUrlParam("slack_app_installed") === "true"
  )

  if (userStorage.getSlackAppInstalled()) {
    userStorage.setSlackCode(utils.getUrlParam("code"))
  }

  if (userStorage.isUserLoggedIn()) {
    if (userStorage.getCLIAuth()) {
      props.history.push("/cli_auth")
    } else {
      props.history.push("/todolist")
    }
    return null
  }

  const isSignup = props.location.pathname.startsWith("/signup")
  userStorage.setSignup(isSignup)

  const inviteAccountName = utils.getUrlParam("account_name")
  const inviteCode = utils.getUrlParam("invite_code")

  const params = () => {
    const ret = []
    if (utils.getUrlParam("cli_auth")) {
      ret.push(`cli_auth=${utils.getUrlParam("cli_auth")}`)
    }
    if (utils.getUrlParam("signup")) {
      ret.push(`signup=${utils.getUrlParam("signup")}`)
    }
    return ret.join("&")
  }

  const SignupText = () => {
    if (inviteAccountName) {
      return (
        <Typography className={classes.margined} marked="center" align="center">
          {/* Ultralist includes a full 14 day free trial. */}
          {/* <br /> */}
          You'll be added to the {inviteAccountName} account.
        </Typography>
      )
    } else {
      return (
        <Typography className={classes.margined} marked="center" align="center">
          {/* Ultralist includes a full 14 day free trial. */}
          {/* <br /> */}
          Already have an account?
          <Link to={`/login?${params()}`}>Login here.</Link>
        </Typography>
      )
    }
  }

  const LoginText = () => (
    <Typography className={classes.margined} marked="center" align="center">
      Don't have an account yet?
      <Link to={`/signup?${params()}`}>Signup here!</Link>
    </Typography>
  )

  const fullBackendUrl = path => {
    let url = `${backendUrl()}${path}`
    if (inviteCode) url += `?invite_code=${inviteCode}`
    return url
  }

  return (
    <React.Fragment>
      <TopBar />
      <div className={classes.middle}>
        <Paper className={classes.loginPaper}>
          <Typography variant="h4" marked="center" align="center">
            {isSignup ? "Sign up for Ultralist" : "Welcome back!"}
          </Typography>

          {isSignup && <SignupText />}
          {!isSignup && <LoginText />}

          <Button
            variant="contained"
            color="default"
            href={fullBackendUrl("/users/auth/google_oauth2")}
            className={classes.paperItem}
          >
            {isSignup ? "Sign up" : "Login"} with Google
          </Button>
          <Button
            variant="contained"
            color="default"
            href={fullBackendUrl("/users/auth/github")}
            className={classes.paperItem}
          >
            {isSignup ? "Sign up" : "Login"} with Github
          </Button>
        </Paper>
      </div>
    </React.Fragment>
  )
}

export default Login
