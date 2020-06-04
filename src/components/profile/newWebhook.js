// @flow
import React from "react"
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@material-ui/core"

import WebhookModel from "../../shared/models/webhook"

type Props = {
  show: boolean,
  onClose: () => void,
  onAdd: (webhook: WebhookModel) => void
}

const NewWebhook = (props: Props) => {
  const [name, setName] = React.useState("")
  const [url, setUrl] = React.useState("")

  const onSave = () => {
    props.onAdd(new WebhookModel({ name: name, enabled: true, url: url }))
  }

  const onChangeName = event => {
    setName(event.target.value)
  }

  const onChangeUrl = event => {
    setUrl(event.target.value)
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={props.show} onClose={props.onClose}>
      <DialogTitle>Add a new Webhook</DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          label="Name"
          fullWidth
          required
          value={name}
          onChange={onChangeName}
        />

        <TextField
          label="URL"
          fullWidth
          required
          value={url}
          onChange={onChangeUrl}
        />
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={onSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NewWebhook
