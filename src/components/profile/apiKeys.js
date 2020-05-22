// @flow
import React from "react"
import { formatRelative, parseJSON } from "date-fns"

import { withSnackbar } from "notistack"

import {
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  Button
} from "@material-ui/core"

import { Delete as DeleteIcon } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"

import StorageContext from "../../shared/storageContext"
import UserStorage from "../../shared/storage/userStorage"

import BackendContext from "../../shared/backendContext"
import ApiKeysBackend from "../../shared/backend/apiKeysBackend"

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

  const [keys, setKeys] = React.useState([])
  console.log("keys = ", keys)

  const [showNewApiKeyModal, setShowNewApiKeyModal] = React.useState(false)

  React.useEffect(() => {
    backend.getKeys().then(keys => {
      setKeys(keys.api_keys)
    })
  }, [])

  const onAddNewApiKey = (key: ApiKey) => {
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
          <DeleteIcon />
        </TableCell>
      </TableRow>
    )
  }

  return (
    <Paper elevation={2} className={classes.section}>
      <div className={classes.margined}>
        <Typography variant="h4">Api Keys</Typography>

        <Table>
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
