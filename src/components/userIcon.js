// @flow
import React from "react"

import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import IconButton from "@material-ui/core/IconButton"
import PersonIcon from "@material-ui/icons/Person"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/styles"
import { Link } from "react-router-dom"

import UserContext from "./utils/userContext"
import UserModel from "../shared/models/user"

const useStyles = makeStyles(theme => {
  return {
    icon: {
      color: "#fff !important" // TODO: make this use theme
    },
    link: {
      color: "rgba(0, 0, 0, 0.87)",
      textDecoration: "none"
    },
    userName: {
      [theme.breakpoints.down("xs")]: {
        display: "none"
      },
      [theme.breakpoints.up("sm")]: {
        display: "block"
      }
    }
  }
})

const UserIcon = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const { user, setUser } = React.useContext(UserContext)

  const classes = useStyles()

  const toggleOpen = event => {
    setAnchorEl(event.currentTarget)
    setIsOpen(!isOpen)
  }

  const onLogout = (setUserFn: (u: ?UserModel) => void) => {
    setIsOpen(!isOpen)
    setUser(null)
  }

  return (
    <React.Fragment>
      <IconButton className={classes.icon} onClick={toggleOpen}>
        <PersonIcon />
        <Typography className={classes.icon} variant="body1">
          <span className={classes.userName}>{user.name}</span>
        </Typography>
      </IconButton>
      <Menu anchorEl={anchorEl} open={isOpen} onClose={toggleOpen}>
        <MenuItem>
          <Link to="/profile" className={classes.link}>
            Settings
          </Link>
        </MenuItem>
        <MenuItem>
          <a
            className={classes.link}
            target="_blank"
            href="https://ultralist.io/docs/cli/quickstart/"
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
