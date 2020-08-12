// @flow
import React from "react"
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Tooltip,
  Typography
} from "@material-ui/core"

import { DeleteOutlined as DeleteIcon } from "@material-ui/icons"

import { formatRelative, parseJSON } from "date-fns"
import { Link } from "react-router-dom"
import { withSnackbar } from "notistack"
import { makeStyles } from "@material-ui/styles"

import UserModel from "../../shared/models/user"

import BackendContext from "../../shared/backendContext"
import UserBackend from "../../shared/backend/userBackend"

import AlertDialog from "../alertDialog"

import UserContext from "../utils/userContext"

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

  const { user, setUser } = React.useContext(UserContext)
  const [accountUsers, setAccountUsers] = React.useState(user.account.users)

  const userBackend = new UserBackend(
    user.token,
    React.useContext(BackendContext)
  )

  const [userToDelete, setUserToDelete] = React.useState(null)
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false)

  const onCloseDeleteAlert = () => {
    setUserToDelete(null)
    setShowDeleteAlert(false)
  }

  const onStartDeleteUser = (userToDelete: UserModel) => {
    setUserToDelete(userToDelete)
    setShowDeleteAlert(true)
  }

  const onDeleteUser = () => {
    userBackend.deleteUser(userToDelete).then(() => {
      props.enqueueSnackbar("User deleted.")
      onCloseDeleteAlert()

      userBackend.getUser().then(userData => {
        setUser(userData)
        setAccountUsers(userData.account.users)
      })
    })
  }

  const User = userProps => {
    let lastLoginAt = "Never"

    if (userProps.user.lastLoginAt) {
      lastLoginAt = formatRelative(
        parseJSON(userProps.user.lastLoginAt),
        new Date()
      )
    }

    const allowDelete = userProps.user.uuid !== user.uuid

    return (
      <TableRow>
        <TableCell>{userProps.user.name}</TableCell>
        <TableCell>{userProps.user.email}</TableCell>
        <TableCell>{userProps.user.isAccountAdmin ? "Yes" : "No"}</TableCell>
        <TableCell>{lastLoginAt}</TableCell>
        <TableCell>
          {allowDelete && (
            <Tooltip title="Delete this user">
              <IconButton
                onClick={() => onStartDeleteUser(new UserModel(userProps.user))}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
    )
  }

  return (
    <Paper elevation={2} className={classes.section}>
      <div className={classes.margined}>
        <Typography variant="h5">Account Users</Typography>

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
            {accountUsers.map((user, idx) => (
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

        <AlertDialog
          title="Delete user from account"
          content="Are you sure you want to delete this user? Their synced lists will also be deleted!"
          show={showDeleteAlert}
          onOK={onDeleteUser}
          onClose={onCloseDeleteAlert}
        />
      </div>
    </Paper>
  )
}

export default withSnackbar(Users)
