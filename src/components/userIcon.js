// @flow
import React, { useState } from "react"

import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import IconButton from "@material-ui/core/IconButton"
import PersonIcon from "@material-ui/icons/Person"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/styles"
import { Redirect, Link } from "react-router-dom"

import StorageContext from "../shared/storageContext"
import UserStorage from "../shared/storage/userStorage"
import FeatureStorage from "../shared/storage/featureStorage"
import utils from "../utils"

const useStyles = makeStyles(theme => {
  return {
    icon: {
      color: "#fff !important" // TODO: make this use theme
    },
    link: {
      color: "rgba(0, 0, 0, 0.87)",
      textDecoration: "none"
    }
  }
})

const UserIcon = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const userStorage = new UserStorage(React.useContext(StorageContext))
  const featureStorage = new FeatureStorage(React.useContext(StorageContext))

  if (utils.getUrlParam("beta") === "true") {
    featureStorage.enableFeature("settings")
  }

  const user = userStorage.loadUser()
  const classes = useStyles()

  const toggleOpen = event => {
    setAnchorEl(event.currentTarget)
    setIsOpen(!isOpen)
  }

  const onLogout = () => {
    setIsOpen(!isOpen)
    userStorage.logoutUser()
  }

  if (!userStorage.isUserLoggedIn()) {
    return <Redirect to="/login" />
  }

  return (
    <React.Fragment>
      <IconButton className={classes.icon} onClick={toggleOpen}>
        <PersonIcon />
        <Typography className={classes.icon} variant="body1">
          {user.name}
        </Typography>
      </IconButton>
      <Menu anchorEl={anchorEl} open={isOpen} onClose={toggleOpen}>
        {featureStorage.isFeatureEnabled("settings") && (
          <MenuItem>
            <Link to="/profile" className={classes.link}>
              Settings
            </Link>
          </MenuItem>
        )}
        <MenuItem>
          <a
            className={classes.link}
            target="_blank"
            href="https://docs.ultralist.io"
          >
            Docs
          </a>
        </MenuItem>
        <MenuItem>
          <a
            className={classes.link}
            target="_blank"
            href="mailto:hello@ultralist.io"
          >
            {" "}
            Email support{" "}
          </a>
        </MenuItem>
        <MenuItem onClick={onLogout}>Logout</MenuItem>
      </Menu>
    </React.Fragment>
  )
}

export default UserIcon
