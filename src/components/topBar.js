// @flow
import React from "react"

import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/styles"
import { Link } from "react-router-dom"

import Analytics from "./analytics"

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    paddingTop: 70
  },
  grow: {
    flexGrow: 1
  },
  logo: {
    fontFamily: "Oxanium",
    fontSize: 36,
    color: "#fff",
    textDecoration: "none"
  }
})

const TopBar = props => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Analytics />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h4" color="inherit">
            <Link to="/" className={classes.logo}>
              Ultralist
            </Link>
          </Typography>

          <div className={classes.grow} />
          <div>{props.children}</div>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default TopBar
