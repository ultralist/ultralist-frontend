// @flow
import React, { useState } from "react"

import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import IconButton from "@material-ui/core/IconButton"
import PersonIcon from "@material-ui/icons/Person"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/styles"
import { Redirect } from "react-router-dom"

import { loadUser, logoutUser, isUserLoggedIn } from "../models/user"

const useStyles = makeStyles(theme => {
  return {
    icon: {
      color: "#fff !important" // TODO: make this use theme
    }
  }
})

const UserIcon = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const user = loadUser()
  const classes = useStyles()

  const toggleOpen = event => {
    setAnchorEl(event.currentTarget)
    setIsOpen(!isOpen)
  }

  const onLogout = () => {
    setIsOpen(!isOpen)
    logoutUser()
  }

  if (!isUserLoggedIn()) {
    return <Redirect to="/login" />
  }

  return (
    <React.Fragment>
      <IconButton className={classes.icon} onClick={toggleOpen}>
        <PersonIcon />
        <Typography className={classes.icon} variant="subheading">
          {user.name}
        </Typography>
      </IconButton>
      <Menu anchorEl={anchorEl} open={isOpen} onClose={toggleOpen}>
        <MenuItem onClick={onLogout}>Logout</MenuItem>
      </Menu>
    </React.Fragment>
  )
}

export default UserIcon
