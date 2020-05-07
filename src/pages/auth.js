// @flow
import React from "react"
import { Redirect } from "react-router-dom"

import utils from "../utils"
import UserModel from "../shared/models/user"

import StorageContext from "../shared/storageContext"
import UserStorage from "../shared/storage/userStorage"

const Auth = () => {
  const name = utils.getUrlParam("name")
  const uuid = utils.getUrlParam("uuid")
  const token = utils.getUrlParam("token")
  const email = utils.getUrlParam("email")
  const imageUrl = utils.getUrlParam("image_url")
  const userStorage = new UserStorage(React.useContext(StorageContext))

  const user = new UserModel({
    name,
    uuid,
    token,
    email,
    imageUrl
  })

  userStorage.loginUser(user)

  return <Redirect to="/loading" />
}

export default Auth
