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

const useStyles = makeStyles({
  middle: {
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
  const userStorage = new UserStorage(React.useContext(StorageContext))

  if (userStorage.isUserLoggedIn()) {
    props.history.push("/todolist")
    return null
  }

  const isSignup = props.location.pathname === "/signup"

  const SignupText = () => (
    <Typography className={classes.margined} marked="center" align="center">
      {/* Ultralist includes a full 14 day free trial. */}
      {/* <br /> */}
      Already have an account? <Link to="/login">Login here.</Link>
    </Typography>
  )

  const LoginText = () => (
    <Typography className={classes.margined} marked="center" align="center">
      Don't have an account yet? <Link to="/signup">Signup here!</Link>
    </Typography>
  )

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
            href={`${backendUrl()}/users/auth/google_oauth2`}
            className={classes.paperItem}
          >
            {isSignup ? "Sign up" : "Login"} with Google
          </Button>
          <Button
            variant="contained"
            color="default"
            href={`${backendUrl()}/users/auth/github`}
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
