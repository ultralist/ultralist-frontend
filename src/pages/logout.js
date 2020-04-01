// @flow
import React from "react"
import { logoutUser } from "../shared/models/user"
import { Redirect } from "react-router-dom"

const Logout = () => {
  logoutUser()
  return <Redirect to="/login" />
}

export default Logout
