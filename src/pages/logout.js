// @flow
import React from "react"
import { Redirect } from "react-router-dom"

import UserContext from "../components/utils/userContext"

const Logout = () => {
  const { setUser } = React.useContext(UserContext)
  setUser(null)
  return <Redirect to="/login" />
}

export default Logout
