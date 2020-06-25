// @flow
import React from "react"

import { makeStyles } from "@material-ui/styles"

import {
  Button,
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
  }
})

const SlackUsers = props => {
  const classes = useStyles()
  const user = props.user
  const todoListStorage = new TodoListStorage(React.useContext(StorageContext))
  const todoLists = todoListStorage.loadTodoLists()

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
            <IconButton>
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
          Manage your integrations with Slack workspaces below.
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
        <Button
          target="_blank"
          href="https://slack.com/oauth/v2/authorize?client_id=1140265225543.1176926993365&scope=chat:write,commands,im:write&user_scope="
          variant="contained"
        >
          Connect to a new Slack Workspace
        </Button>
      </div>
    </Paper>
  )
}

export default SlackUsers
