// @flow

import React from "react"
import { Router, Route, Redirect } from "react-router-dom"
import { createBrowserHistory } from "history"

import TodoList from "../pages/todoList"
import Login from "../pages/login"
import Logout from "../pages/logout"
import Auth from "../pages/auth"
import CLIAuth from "../pages/cliAuth"
import Profile from "../pages/profile"

const history = createBrowserHistory()

const Routes = () => (
  <Router history={history}>
    <React.Fragment>
      <Route exact={true} path="/todolist" component={TodoList} />
      <Route exact={true} path="/todolist/:id" component={TodoList} />

      <Route path="/login" component={Login} />
      <Route path="/signup" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route path="/auth" component={Auth} />
      <Route path="/cli_auth" component={CLIAuth} />
      <Route path="/profile" component={Profile} />

      <Route exact={true} path="/" render={() => <Redirect to="/login" />} />
    </React.Fragment>
  </Router>
)

export default Routes
