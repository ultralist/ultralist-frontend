// @flow

import React from "react"
import { Router, Route, Redirect } from "react-router-dom"
import createBrowserHistory from "history/createBrowserHistory"

import TodoList from "../pages/todoList"
import Login from "../pages/login"

const history = createBrowserHistory()

const Routes = () => (
  <Router history={history}>
    <React.Fragment>
      <Route path="/todolist/:id" component={TodoList} />

      <Route path="/login" component={Login} />
      <Route path="/" render={() => <Redirect to="/login" />} />
    </React.Fragment>
  </Router>
)

export default Routes
