// @flow
import React from "react"

import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle
} from "@material-ui/core"

type Props = {
  show: boolean,
  title: string,
  content: string,
  onOK: () => void,
  onClose: () => void
}

const AlertDialog = (props: Props) => {
  return (
    <Dialog open={props.show} onClose={props.onClose}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>{props.content}</DialogContent>

      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button onClick={props.onOK}>OK</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AlertDialog
