import React from "react"

import UserModel from "../../shared/models/user"

const UserContext = React.createContext({
  user: {},
  setUser: (u: UserModel) => {}
})

export default UserContext
