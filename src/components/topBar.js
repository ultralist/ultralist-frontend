// @flow
import React from "react"

import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/styles"
import { Link } from "react-router-dom"

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    paddingBottom: 70
  },
  grow: {
    flexGrow: 1
  },
  link: {
    color: "#fff",
    textDecoration: "none"
  }
})

const TopBar = props => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" color="inherit">
            <Link to="/" className={classes.link}>
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
