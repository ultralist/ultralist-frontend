// @flow
import React from "react"
import { withStyles } from "@material-ui/core/styles"

import TodoText from "../../components/todoItem/todoText"

const styles = theme => ({
  project: {
    color: "red"
  },
  context: {
    color: "blue"
  }
})

export default withStyles(styles)(TodoText)
