// @flow
import React from "react"
import { formatRelative, parseJSON } from "date-fns"
import { Link } from "react-router-dom"

import { makeStyles } from "@material-ui/styles"

import StorageContext from "../../shared/storageContext"
import UserStorage from "../../shared/storage/userStorage"
import UserModel from "../../shared/models/user"

import {
  Divider,
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

const useStyles = makeStyles({
  section: {
    marginTop: 15,
    marginBottom: 15
  },
  margined: {
    padding: 20
  }
})

const Users = props => {
  const classes = useStyles()

  const userStorage = new UserStorage(React.useContext(StorageContext))
  const user = userStorage.loadUser()

  const onStartDeleteUser = (userToDelete: UserModel) => {}

  const User = userProps => {
    let lastLoginAt = "Never"

    if (userProps.user.lastLoginAt) {
      lastLoginAt = formatRelative(
        parseJSON(userProps.user.lastLoginAt),
        new Date()
      )
    }

    return (
      <TableRow>
        <TableCell>{userProps.user.name}</TableCell>
        <TableCell>{userProps.user.email}</TableCell>
        <TableCell>{userProps.user.isAccountAdmin ? "Yes" : "No"}</TableCell>
        <TableCell>{lastLoginAt}</TableCell>
        <TableCell>
          <Tooltip title="Delete this user">
            <IconButton
              onClick={() => onStartDeleteUser(new UserModel(userProps.user))}
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
        <Typography variant="h4">Account Users</Typography>

        <Table className={classes.section}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Admin?</TableCell>
              <TableCell>Last active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {user.account.users.map((user, idx) => (
              <User key={idx} user={user} />
            ))}
          </TableBody>
        </Table>

        <Typography>
          To add a user to your account,{" "}
          <Link
            to={`/signup?account_name=${encodeURIComponent(
              user.account.name
            )}&invite_code=${user.account.inviteCode}`}
          >
            Copy this link
          </Link>{" "}
          and send it to them.
        </Typography>
      </div>
    </Paper>
  )
}

export default Users
