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
  ] = React.useState(true)

  const onCloseCLIAuthCompleted = () => {
    userStorage.setCLIAuthCompleted(false)
    setShowCLIAuthCompletedDialog(false)
  }

  return (
    <AlertDialog
      show={showCLIAuthCompletedDialog}
      onOK={onCloseCLIAuthCompleted}
      title="CLI auth completed"
      content="CLI auth has completed successfully!"
    />
  )
}

export default CLIAuthCompleted
