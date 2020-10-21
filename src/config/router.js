// @flow

import React from "react"
import { Router, Route, Redirect } from "react-router-dom"
import { createBrowserHistory } from "history"

import TodoList from "../pages/todoList"
import ChooseTodoList from "../pages/chooseTodoList"
import Login from "../pages/login"
import Logout from "../pages/logout"
import Auth from "../pages/auth"
import CLIAuth from "../pages/cliAuth"
import Profile from "../pages/profile"

import UserModel from "../shared/models/user"

const history = createBrowserHistory()

type Props = {
  user: ?UserModel
}

const Routes = (props: Props) => {
  return (
    <Router history={history}>
      {/* ----------- Routes that do not require a user ---------- */}

      <Route path="/login" component={Login} />
      <Route path="/auth" component={Auth} />
      <Route path="/signup" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route path="/cli_auth" component={CLIAuth} />

      {/* ----------- Routes that require a user ---------- */}

      <Route
        exact={true}
        path="/todolist"
        render={routeProps =>
          props.user ? (
            <ChooseTodoList {...routeProps} />
          ) : (
            <Redirect to="/login" />
          )
        }
      />
      <Route
        exact={true}
        path="/todolist/:id"
        render={routeProps =>
          props.user ? <TodoList {...routeProps} /> : <Redirect to="/login" />
        }
      />

      <Route
        exact={true}
        path="/profile"
        render={routeProps =>
          props.user ? <Profile {...routeProps} /> : <Redirect to="/login" />
        }
      />

      <Route
        exact={true}
        path="/"
        render={() =>
          props.user ? <Redirect to="/todolist" /> : <Redirect to="/login" />
        }
      />
    </Router>
  )
}

export default Routes
