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

import ApiKeyModel from "../../shared/models/apiKey"

type Props = {
  show: boolean,
  onClose: () => void,
  onAdd: (apiKey: ApiKeyModel) => void
}

const NewApiKey = (props: Props) => {
  const [name, setName] = React.useState("")

  const onSave = () => {
    props.onAdd(new ApiKeyModel({ name: name, active: true }))
  }

  const onChangeName = event => {
    setName(event.target.value)
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={props.show} onClose={props.onClose}>
      <DialogTitle>Add a new API key</DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          label="Name"
          required
          value={name}
          onChange={onChangeName}
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

export default NewApiKey
