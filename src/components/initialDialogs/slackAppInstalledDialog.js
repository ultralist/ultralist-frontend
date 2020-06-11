// @flow
import React, { useState, useEffect } from "react"

import StorageContext from "../../shared/storageContext"
import UserStorage from "../../shared/storage/userStorage"

import AlertDialog from "../alertDialog"

import BackendContext from "../../shared/backendContext"
import SlackBackend from "../../shared/backend/slackBackend"

const CLIAuthCompleted = () => {
  const userStorage = new UserStorage(React.useContext(StorageContext))
  const backendContext = React.useContext(BackendContext)
  const user = userStorage.loadUser()

  const [
    showSlackAppInstalledDialog,
    setShowSlackAppInstalledDialog
  ] = React.useState(
    userStorage.getSlackAppInstalled() && !userStorage.getSignup()
  )

  if (!userStorage.getSlackAppInstalled()) return null

  const slackBackend = new SlackBackend(user ? user.token : "", backendContext)
  slackBackend.exchangeCodeForToken(userStorage.getSlackCode())

  const onClose = () => {
    userStorage.setSlackAppInstalled(false)
    setShowSlackAppInstalledDialog(false)
  }

  return (
    <AlertDialog
      show={showSlackAppInstalledDialog}
      onOK={onClose}
      title="Ultralist Slack App Installed"
      content="The Ultralist Slack App has successfully been installed.  Next, type '/ul login' from Slack to associate your slack user with Ultralist."
    />
  )
}

export default CLIAuthCompleted
