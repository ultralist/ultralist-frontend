// @flow

import React from "react"
import { Router, Route, Redirect } from "react-router-dom"
import { createBrowserHistory } from "history"

import TodoList from "../pages/todoList"
import ChooseTodoList from "../pages/chooseTodoList"
import Auth from "../pages/auth"
import CLIAuth from "../pages/cliAuth"
import Profile from "../pages/profile"

import UserModel from "../shared/models/user"

const history = createBrowserHistory()

type Props = {
  user: ?UserModel
}

const loginUrl =
  process.env.NODE_ENV === "production"
    ? "https://auth.ultralist.io/login?client_id=6i2effu9ipnphtq123ijom1lej&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://api.ultralist.io/login"
    : "https://auth-dev.ultralist.io/login?client_id=34ctg4o0afurkoc02snn7e9gmu&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http://localhost:3000/login"

const Routes = (props: Props) => {
  return (
    <Router history={history}>
      {/* ----------- Routes that do not require a user ---------- */}

      <Route path="/auth" component={Auth} />
      <Route path="/cli_auth" component={CLIAuth} />

      {/* ----------- Routes that require a user ---------- */}

      <Route
        exact={true}
        path="/todolist"
        render={routeProps =>
          props.user ? (
            <ChooseTodoList {...routeProps} />
          ) : (
            (window.location.href = loginUrl)
          )
        }
      />
      <Route
        exact={true}
        path="/todolist/:id"
        render={routeProps =>
          props.user ? (
            <TodoList {...routeProps} />
          ) : (
            (window.location.href = loginUrl)
          )
        }
      />

      <Route
        exact={true}
        path="/profile"
        render={routeProps =>
          props.user ? (
            <Profile {...routeProps} />
          ) : (
            (window.location.href = loginUrl)
          )
        }
      />

      <Route
        exact={true}
        path="/"
        render={() =>
          props.user ? (
            <Redirect to="/todolist" />
          ) : (
            (window.location.href = loginUrl)
          )
        }
      />
    </Router>
  )
}

export default Routes
