// @flow
import React from "react"
import { withStyles } from "@material-ui/core/styles"
import red from "@material-ui/core/colors/red"
import blue from "@material-ui/core/colors/blue"

import DueDate from "../basic/dueDate"

const styles = theme => ({
  past: {
    color: red[700]
  },
  today: {
    color: blue[500]
  },
  tomorrow: {
    color: blue[400]
  },
  future: {
    color: blue[300]
  }
})

export default withStyles(styles)(DueDate)
