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

import UserModel from "../shared/models/user"

const history = createBrowserHistory()

type Props = {
  user: ?UserModel
}

const Routes = (props: Props) => (
  <Router history={history}>
    {!props.user && <Redirect to="/login" />}

    <Route path="/login" component={Login} />
    <Route path="/auth" component={Auth} />
    <Route path="/signup" component={Login} />
    <Route path="/cli_auth" component={CLIAuth} />

    <Route exact={true} path="/todolist" component={TodoList} />
    <Route exact={true} path="/todolist/:id" component={TodoList} />

    <Route path="/logout" component={Logout} />
    <Route path="/profile" component={Profile} />

    <Route exact={true} path="/" render={() => <Redirect to="/login" />} />
  </Router>
)

export default Routes
