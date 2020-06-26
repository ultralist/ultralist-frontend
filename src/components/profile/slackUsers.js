// @flow
import React from "react"
import { withSnackbar } from "notistack"

import { makeStyles } from "@material-ui/styles"

import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@material-ui/core"

import { Edit as EditIcon } from "@material-ui/icons"

import StorageContext from "../../shared/storageContext"
import TodoListStorage from "../../shared/storage/todoListStorage"
import useUserStorage from "../utils/useUserStorage"

import BackendContext from "../../shared/backendContext"
import SlackUsersBackend from "../../shared/backend/slackUsersBackend"

import EditSlackUserDialog from "./editSlackUserDialog"

const useStyles = makeStyles({
  section: {
    marginTop: 15,
    marginBottom: 30
  },
  heading: {
    marginBottom: 15
  },
  margined: {
    padding: 20
  },
  editIcon: {
    padding: 0
  }
})

const SlackUsers = props => {
  const classes = useStyles()
  const [user, setUser] = useUserStorage()
  const todoListStorage = new TodoListStorage(React.useContext(StorageContext))
  const todoLists = todoListStorage.loadTodoLists()

  const backend = new SlackUsersBackend(
    user.token,
    React.useContext(BackendContext)
  )

  const [editSlackUser, setEditSlackUser] = React.useState(null)
  const [showEditSlackUserDialog, setShowEditSlackUserDialog] = React.useState(
    false
  )

  const onShowEditSlackUserDialog = (slackUser: SlackUserModel) => {
    setEditSlackUser(slackUser)
    setShowEditSlackUserDialog(true)
  }

  const onCloseEditSlackUserDialog = () => {
    setEditSlackUser(null)
    setShowEditSlackUserDialog(false)
  }

  const onSaveSlackUser = (slackUser: SlackUserModel) => {
    backend.updateSlackUser(slackUser).then(() => {
      const filteredSlackUsers = user.slackUsers.filter(
        su => su.id !== slackUser.id
      )
      filteredSlackUsers.push(slackUser)
      user.slackUsers = filteredSlackUsers
      setUser(user)
      props.enqueueSnackbar("Slack settings updated.")
      onCloseEditSlackUserDialog()
    })
  }

  const SlackUser = props => {
    const listName = todoLists.find(l => props.slackUser.todoListID === l.uuid)
    const receivesAgenda = props.slackUser.receivesAgenda ? "Yes" : "No"

    return (
      <TableRow>
        <TableCell>{props.slackUser.slackTeamDomain}</TableCell>
        <TableCell>{listName.name}</TableCell>
        <TableCell>{receivesAgenda}</TableCell>
        <TableCell>
          <Tooltip title="Change this integration">
            <IconButton
              onClick={() => onShowEditSlackUserDialog(props.slackUser)}
              className={classes.editIcon}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <Paper elevation={2} className={classes.section}>
      <div className={classes.margined}>
        <Typography variant="h5" className={classes.heading}>
          Slack Integrations
        </Typography>
        <Typography>
          Manage your integrations with Slack workspaces below.{" "}
          <a
            href="https://docs.ultralist.io/docs/pro/slack_integration"
            target="_blank"
          >
            Read instructions
          </a>{" "}
          on how to connect a Slack workspace with Ultralist.
        </Typography>

        <Table className={classes.section}>
          <TableHead>
            <TableRow>
              <TableCell>Team</TableCell>
              <TableCell>Primary List</TableCell>
              <TableCell>Receive 9am agenda?</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {user.slackUsers.map(slackUser => (
              <SlackUser key={slackUser.id} slackUser={slackUser} />
            ))}
          </TableBody>
        </Table>

        {editSlackUser && (
          <EditSlackUserDialog
            slackUser={editSlackUser}
            todoLists={todoLists}
            show={showEditSlackUserDialog}
            onClose={onCloseEditSlackUserDialog}
            onSave={onSaveSlackUser}
          />
        )}
      </div>
    </Paper>
  )
}

export default withSnackbar(SlackUsers)
