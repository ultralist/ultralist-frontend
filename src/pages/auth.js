// @flow
import React from "react"
import { Redirect } from "react-router-dom"

import utils from "../shared/utils"
import UserModel from "../shared/models/user"

const Auth = () => {
  const name = utils.getUrlParam("name")
  const uuid = utils.getUrlParam("uuid")
  const token = utils.getUrlParam("token")
  const email = utils.getUrlParam("email")
  const imageUrl = utils.getUrlParam("image_url")

  const user = new UserModel({
    name,
    uuid,
    token,
    email,
    imageUrl
  })

  user.save()

  return <Redirect to="/loading" />
}

export default Auth
