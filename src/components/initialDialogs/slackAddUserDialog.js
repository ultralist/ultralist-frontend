// @flow

import React from "react"

import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from "@material-ui/core"

import { makeStyles } from "@material-ui/styles"

import StorageContext from "../../shared/storageContext"
import SlackStorage from "../../shared/storage/slackStorage"
import TodoListStorage from "../../shared/storage/todoListStorage"
import UserStorage from "../../shared/storage/userStorage"

import BackendContext from "../../shared/backendContext"
import SlackUsersBackend from "../../shared/backend/slackUsersBackend"
import SlackUserModel from "../../shared/models/slackUser"

import AlertDialog from "../alertDialog"

const useStyles = makeStyles({
  section: {
    paddingBottom: 20
  },
  selectBox: {
    width: "100%"
  }
})

const SlackAddLoginDialog = () => {
  const storageContext = React.useContext(StorageContext)
  const slackStorage = new SlackStorage(storageContext)
  const todoListStorage = new TodoListStorage(storageContext)
  const userStorage = new UserStorage(storageContext)
  const user = userStorage.loadUser()

  const backendContext = React.useContext(BackendContext)
  const slackUsersBackend = new SlackUsersBackend(user.token, backendContext)

  const slackAuthParams = slackStorage.getSlackAuthParams()
  const todoLists = todoListStorage.loadTodoLists()
  const classes = useStyles()

  const [showDialog, setShowDialog] = React.useState(
    slackAuthParams.userAuth === true
  )
  const [showCompletedDialog, setShowCompletedDialog] = React.useState(false)
  const [todoListId, setTodoListId] = React.useState(null)

  const onClose = () => {
    setShowDialog(false)
  }

  const onCancel = () => {
    slackStorage.clearSlackAuthParams()
    setShowDialog(false)
  }

  const onSave = () => {
    const slackUser = new SlackUserModel({
      slackUserId: slackAuthParams.user_id,
      slackUserName: slackAuthParams.user_name,
      slackTeamId: slackAuthParams.team_id,
      slackTeamDomain: slackAuthParams.team_domain,
      todoListUUID: todoListId
    })

    slackUsersBackend.createSlackUser(slackUser).then(() => {
      setShowDialog(false)
      setShowCompletedDialog(true)
      slackStorage.clearSlackAuthParams()
    })
  }

  const onChangeTodoListId = event => {
    setTodoListId(event.target.value)
  }

  return (
    <React.Fragment>
      <Dialog open={showDialog} onClose={onClose}>
        <DialogTitle>Add Slack user?</DialogTitle>
        <DialogContent>
          <Typography className={classes.section}>
            When you connect your Slack user with Ultralist, you can then use
            the <code>/ul</code> bot command + view and manipulate your list
            from Slack!
          </Typography>
          <Typography className={classes.section}>
            We'll be integrating <strong>{slackAuthParams.user_name}</strong>{" "}
            from the <strong>{slackAuthParams.team_domain}</strong> workspace.
          </Typography>
          <Typography className={classes.section}>
            In order to work seamlessly in Slack, you'll need to choose a todo
            list you'd like to use below. You can change this later by going to
            the Ultralist settings page.
          </Typography>

          <FormControl className={classes.selectBox}>
            <InputLabel>Todo list name</InputLabel>
            <Select
              className={classes.selectBox}
              value={todoListId}
              onChange={onChangeTodoListId}
            >
              {todoLists.map((list, idx) => (
                <MenuItem key={idx} value={list.uuid}>
                  {list.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button disabled={todoListId === null} onClick={onSave}>
            Add Slack User
          </Button>
        </DialogActions>
      </Dialog>
      <AlertDialog
        show={showCompletedDialog}
        onOK={() => setShowCompletedDialog(false)}
        title="Slack User Added"
        content="Slack user has been added successfully.  Enjoy using the slack integration!"
      />
    </React.Fragment>
  )
}

export default SlackAddLoginDialog
