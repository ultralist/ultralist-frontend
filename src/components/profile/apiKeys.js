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

import {
  DeleteOutlined as DeleteIcon,
  PowerOutlined as EnableIcon,
  PowerOffOutlined as DisableIcon
} from "@material-ui/icons"
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
    borderRadius: "3px"
  },
  apiKey: {
    padding: "5px",
    width: "100%",
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
  const [showDisableAlert, setShowDisableAlert] = React.useState(false)
  const [showEnableAlert, setShowEnableAlert] = React.useState(false)

  const [keyToDelete, setKeyToDelete] = React.useState(null)
  const [keyToDisable, setKeyToDisable] = React.useState(null)
  const [keyToEnable, setKeyToEnable] = React.useState(null)

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

  const onStartDisableApiKey = (key: ApiKeyModel) => {
    setKeyToDisable(key)
    setShowDisableAlert(true)
  }

  const onStartEnableApiKey = (key: ApiKeyModel) => {
    setKeyToEnable(key)
    setShowEnableAlert(true)
  }

  const onDisableApiKey = () => {
    keyToDisable.active = false
    backend.updateKey(keyToDisable).then(() => {
      const key = keys.find(h => h.id === keyToDisable.id)
      key.active = false
      setKeys(keys)
      props.enqueueSnackbar("API key disabled!")
      setShowDisableAlert(false)
    })
  }

  const onEnableApiKey = () => {
    keyToEnable.active = true
    backend.updateKey(keyToEnable).then(() => {
      const key = keys.find(h => h.id === keyToEnable.id)
      key.active = true
      setKeys(keys)
      props.enqueueSnackbar("API key enabled!")
      setShowEnableAlert(false)
    })
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

  const DeleteApiKey = props => {
    if (props.api_key.token === user.token) return null

    return (
      <Tooltip title="Delete this api key">
        <IconButton
          onClick={() => onStartDeleteApiKey(new ApiKeyModel(props.api_key))}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    )
  }

  const DisableApiKey = props => {
    if (props.api_key.token === user.token) return null

    return (
      <Tooltip title="Disable this API key">
        <IconButton
          onClick={() => onStartDisableApiKey(new ApiKeyModel(props.api_key))}
        >
          <DisableIcon />
        </IconButton>
      </Tooltip>
    )
  }

  const EnableApiKey = props => (
    <Tooltip title="Disable this API key">
      <IconButton
        onClick={() => onStartEnableApiKey(new ApiKeyModel(props.api_key))}
      >
        <EnableIcon />
      </IconButton>
    </Tooltip>
  )

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
            <input
              readOnly
              className={classes.apiKey}
              value={props.api_key.token}
              onFocus={event => event.target.select()}
            />
          </div>
        </TableCell>

        <TableCell>{props.api_key.active ? "True" : "False"}</TableCell>
        <TableCell>{lastUsedDate}</TableCell>
        <TableCell>
          {props.api_key.active ? (
            <DisableApiKey {...props} />
          ) : (
            <EnableApiKey {...props} />
          )}
          <DeleteApiKey {...props} />
        </TableCell>
      </TableRow>
    )
  }

  return (
    <Paper elevation={2} className={classes.section}>
      <div className={classes.margined}>
        <Typography variant="h4">Your Api Keys</Typography>
        <Typography className={classes.section}>
          Check out our sweet{" "}
          <a target="_blank" href="https://api-docs.ultralist.io">
            API docs
          </a>{" "}
          to get started using our API.
        </Typography>

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

        <AlertDialog
          title="Disable Api Key"
          content="Are you sure you wish to disable this API key?"
          show={showDisableAlert}
          onOK={onDisableApiKey}
          onClose={() => {
            setShowDisableAlert(false)
          }}
        />

        <AlertDialog
          title="Enable API Key"
          content="Are you sure you wish to enable this API key?"
          show={showEnableAlert}
          onOK={onEnableApiKey}
          onClose={() => {
            setShowEnableAlert(false)
          }}
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
