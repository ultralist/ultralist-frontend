// @flow
import React from "react"
import { formatRelative, parseJSON } from "date-fns"

import { withSnackbar } from "notistack"

import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Tooltip,
  Typography,
  Button
} from "@material-ui/core"

import { Delete as DeleteIcon } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"

import StorageContext from "../../shared/storageContext"
import UserStorage from "../../shared/storage/userStorage"

import BackendContext from "../../shared/backendContext"
import ApiKeysBackend from "../../shared/backend/apiKeysBackend"
import ApiKeyModel from "../../shared/models/apiKey"
import AlertDialog from "../alertDialog"

import NewApiKey from "./newApiKey"

const useStyles = makeStyles({
  section: {
    marginTop: 15,
    marginBottom: 15
  },
  margined: {
    padding: 20
  },
  outerApiKey: {
    border: "1px solid #aaa",
    borderRadius: "3px",
    overflowX: "scroll"
  },
  apiKey: {
    padding: "5px",
    maxWidth: "250px",
    fontFamily: "monospace",
    whiteSpace: "nowrap"
  }
})

const ApiKeys = props => {
  const classes = useStyles()

  const userStorage = new UserStorage(React.useContext(StorageContext))
  const user = userStorage.loadUser()

  const backend = new ApiKeysBackend(
    user.token,
    React.useContext(BackendContext)
  )

  const [keys, setKeys] = React.useState(user.apiKeys)

  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false)
  const [keyToDelete, setKeyToDelete] = React.useState(null)

  const [showNewApiKeyModal, setShowNewApiKeyModal] = React.useState(false)

  const onAddNewApiKey = (key: ApiKeyModel) => {
    backend.createKey(key).then(data => {
      props.enqueueSnackbar("Api key created.")
      keys.push(data)
      setKeys(keys)
      setShowNewApiKeyModal(false)
    })
  }

  const onShowNewApiKeyModal = () => {
    setShowNewApiKeyModal(true)
  }

  const onCloseNewApiKeyModal = () => {
    setShowNewApiKeyModal(false)
  }

  const onStartDeleteApiKey = (key: ApiKeyModel) => {
    setKeyToDelete(key)
    setShowDeleteAlert(true)
  }

  const onDeleteApiKey = () => {
    backend.deleteKey(keyToDelete).then(() => {
      props.enqueueSnackbar("Api key deleted.")
      setKeys(keys.filter(k => k.name !== keyToDelete.name))
      onCloseDeleteAlert()
    })
  }

  const onCloseDeleteAlert = () => {
    setKeyToDelete(null)
    setShowDeleteAlert(false)
  }

  const ApiKey = props => {
    let lastUsedDate = "Never"

    if (props.api_key.last_used_at) {
      lastUsedDate = formatRelative(
        parseJSON(props.api_key.last_used_at),
        new Date()
      )
    }

    return (
      <TableRow>
        <TableCell>{props.api_key.name}</TableCell>
        <TableCell>
          <div className={classes.outerApiKey}>
            <div className={classes.apiKey}>{props.api_key.token}</div>
          </div>
        </TableCell>
        <TableCell>{props.api_key.active ? "True" : "False"}</TableCell>
        <TableCell>{lastUsedDate}</TableCell>
        <TableCell>
          <Tooltip title="Delete this api key">
            <IconButton
              onClick={() =>
                onStartDeleteApiKey(new ApiKeyModel(props.api_key))
              }
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <Paper elevation={2} className={classes.section}>
      <div className={classes.margined}>
        <Typography variant="h4">Your Api Keys</Typography>

        <Table className={classes.section}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Key</TableCell>
              <TableCell>Active?</TableCell>
              <TableCell>Last used</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {keys.map((key, idx) => (
              <ApiKey key={idx} api_key={key} />
            ))}
          </TableBody>
        </Table>

        <NewApiKey
          show={showNewApiKeyModal}
          onAdd={onAddNewApiKey}
          onClose={onCloseNewApiKeyModal}
        />

        <AlertDialog
          title="Delete API key"
          content="Are you sure you want to delete this API key?"
          show={showDeleteAlert}
          onOK={onDeleteApiKey}
          onClose={onCloseDeleteAlert}
        />

        <Button
          color="primary"
          variant="contained"
          onClick={onShowNewApiKeyModal}
        >
          New API Key
        </Button>
      </div>
    </Paper>
  )
}

export default withSnackbar(ApiKeys)
