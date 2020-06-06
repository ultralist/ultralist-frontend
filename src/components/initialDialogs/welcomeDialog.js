// @flow
import React, { useState, useEffect } from "react"

import StorageContext from "../../shared/storageContext"
import UserStorage from "../../shared/storage/userStorage"

import AlertDialog from "../alertDialog"

const CLIAuthCompleted = () => {
  const userStorage = new UserStorage(React.useContext(StorageContext))

  const [
    showCLIAuthCompletedDialog,
    setShowCLIAuthCompletedDialog
  ] = React.useState(userStorage.getSignup())

  const onCloseCLIAuthCompleted = () => {
    userStorage.setSignup(false)
    userStorage.setCLIAuthCompleted(false)
    setShowCLIAuthCompletedDialog(false)
  }

  return (
    <AlertDialog
      show={showCLIAuthCompletedDialog}
      onOK={onCloseCLIAuthCompleted}
      title="Welcome to Ultralist!"
      content="Ultralist purpose-built for tech folks.  Check out our CLI, powerful API, and integrations!"
    />
  )
}

export default CLIAuthCompleted
