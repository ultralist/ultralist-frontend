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
  Telegram as TelegramIcon,
  PowerOutlined as EnableIcon,
  PowerOffOutlined as DisableIcon
} from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"

import StorageContext from "../../shared/storageContext"
import UserStorage from "../../shared/storage/userStorage"

import BackendContext from "../../shared/backendContext"
import WebhooksBackend from "../../shared/backend/webhooksBackend"
import WebhookModel from "../../shared/models/webhook"
import AlertDialog from "../alertDialog"

import NewWebhook from "./newWebhook"

const useStyles = makeStyles({
  section: {
    marginTop: 15,
    marginBottom: 15
  },
  margined: {
    padding: 20
  },
  outerWebhook: {
    border: "1px solid #aaa",
    borderRadius: "3px",
    overflowX: "scroll"
  },
  webhook: {
    padding: "5px",
    maxWidth: "250px",
    fontFamily: "monospace",
    whiteSpace: "nowrap"
  }
})

const Webhooks = props => {
  const classes = useStyles()

  const userStorage = new UserStorage(React.useContext(StorageContext))
  const user = userStorage.loadUser()

  const backend = new WebhooksBackend(
    user.token,
    React.useContext(BackendContext)
  )

  const [webhooks, setWebhooks] = React.useState(user.webhooks)

  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false)
  const [showTestAlert, setShowTestAlert] = React.useState(false)
  const [showDisableAlert, setShowDisableAlert] = React.useState(false)
  const [showEnableAlert, setShowEnableAlert] = React.useState(false)

  const [webhookToDelete, setWebhookToDelete] = React.useState(null)
  const [webhookToTest, setWebhookToTest] = React.useState(null)
  const [webhookToDisable, setWebhookToDisable] = React.useState(null)
  const [webhookToEnable, setWebhookToEnable] = React.useState(null)

  const [showNewWebhookModal, setShowNewWebhookModal] = React.useState(false)

  const onAddNewWebhook = (webhook: WebhookModel) => {
    backend.createWebhook(webhook).then(data => {
      props.enqueueSnackbar("Webhook created.")
      webhooks.push(data)
      setWebhooks(webhooks)
      setShowNewWebhookModal(false)
    })
  }

  const onShowNewWebhookModal = () => {
    setShowNewWebhookModal(true)
  }

  const onCloseNewWebhookModal = () => {
    setShowNewWebhookModal(false)
  }

  const onStartDeleteWebhook = (webhook: WebhookModel) => {
    setWebhookToDelete(webhook)
    setShowDeleteAlert(true)
  }

  const onStartTestWebhook = (webhook: WebhookModel) => {
    setWebhookToTest(webhook)
    setShowTestAlert(true)
  }

  const onStartEnableWebhook = (webhook: WebhookModel) => {
    setWebhookToEnable(webhook)
    setShowEnableAlert(true)
  }

  const onStartDisableWebhook = (webhook: WebhookModel) => {
    console.log("disable webhook")
    setWebhookToDisable(webhook)
    setShowDisableAlert(true)
  }

  const onDeleteWebhook = () => {
    backend.deleteWebhook(webhookToDelete).then(() => {
      props.enqueueSnackbar("Webhook deleted.")
      setWebhooks(webhooks.filter(k => k.name !== webhookToDelete.name))
      onCloseDeleteAlert()
    })
  }

  const onTestWebhook = () => {
    backend.testWebhook(webhookToTest).then(() => {
      props.enqueueSnackbar("Webhook request sent!")
      setShowTestAlert(false)
    })
  }

  const onDisableWebhook = () => {
    backend.updateWebhook(webhookToDisable).then(() => {
      const hook = webhooks.find(h => h.id === webhookToDisable.id)
      hook.enabled = false
      setWebhooks(webhooks)
      props.enqueueSnackbar("Webhook disabled!")
      setShowDisableAlert(false)
    })
  }

  const onEnableWebhook = () => {
    backend.updateWebhook(webhookToEnable).then(() => {
      const hook = webhooks.find(h => h.id === webhookToEnable.id)
      hook.enabled = true
      setWebhooks(webhooks)
      props.enqueueSnackbar("Webhook enabled!")
      setShowEnableAlert(false)
    })
  }

  const onCloseDeleteAlert = () => {
    setWebhookToDelete(null)
    setShowDeleteAlert(false)
  }

  const DisableWebhook = props => (
    <Tooltip title="Disable this webhook">
      <IconButton
        onClick={() => onStartDisableWebhook(new WebhookModel(props.webhook))}
      >
        <DisableIcon />
      </IconButton>
    </Tooltip>
  )

  const EnableWebhook = props => (
    <Tooltip title="Enable this webhook">
      <IconButton
        onClick={() => onStartEnableWebhook(new WebhookModel(props.webhook))}
      >
        <EnableIcon />
      </IconButton>
    </Tooltip>
  )

  const Webhook = props => {
    return (
      <TableRow>
        <TableCell>{props.webhook.name}</TableCell>
        <TableCell>
          <div className={classes.webhookUrl}>{props.webhook.url}</div>
        </TableCell>
        <TableCell>{props.webhook.enabled ? "True" : "False"}</TableCell>
        <TableCell>
          {props.webhook.enabled ? (
            <DisableWebhook {...props} />
          ) : (
            <EnableWebhook {...props} />
          )}

          <Tooltip title="Test this webhook">
            <IconButton
              onClick={() =>
                onStartTestWebhook(new WebhookModel(props.webhook))
              }
            >
              <TelegramIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete this webhook">
            <IconButton
              onClick={() =>
                onStartDeleteWebhook(new WebhookModel(props.webhook))
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
        <Typography variant="h4">Your Webhooks</Typography>
        <Typography>
          You can set up webhooks to alert other systems of when something in
          your Ultralist account changes.
        </Typography>

        <Table className={classes.section}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Url</TableCell>
              <TableCell>Enabled?</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {webhooks.map((webhook, idx) => (
              <Webhook key={idx} webhook={webhook} />
            ))}
          </TableBody>
        </Table>

        <NewWebhook
          show={showNewWebhookModal}
          onAdd={onAddNewWebhook}
          onClose={onCloseNewWebhookModal}
        />

        <AlertDialog
          title="Delete Webhook"
          content="Are you sure you want to delete this webhook?"
          show={showDeleteAlert}
          onOK={onDeleteWebhook}
          onClose={onCloseDeleteAlert}
        />

        <AlertDialog
          title="Test Webhook"
          content="We'll send a POST request to your webhook's URL to test it."
          show={showTestAlert}
          onOK={onTestWebhook}
          onClose={() => {
            setShowTestAlert(false)
          }}
        />

        <AlertDialog
          title="Disable Webhook"
          content="Are you sure you wish to disable this webhook?"
          show={showDisableAlert}
          onOK={onDisableWebhook}
          onClose={() => {
            setShowDisableAlert(false)
          }}
        />

        <AlertDialog
          title="Enable Webhook"
          content="Are you sure you wish to enable this webhook?"
          show={showEnableAlert}
          onOK={onEnableWebhook}
          onClose={() => {
            setShowEnableAlert(false)
          }}
        />

        <Button
          color="primary"
          variant="contained"
          onClick={onShowNewWebhookModal}
        >
          New Webhook
        </Button>
      </div>
    </Paper>
  )
}

export default withSnackbar(Webhooks)
