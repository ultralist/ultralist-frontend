// @flow
import { withStyles } from "@material-ui/core/styles"
import red from "@material-ui/core/colors/red"
import blue from "@material-ui/core/colors/blue"

import DueDate from "../basic/dueDate"

const styles = () => ({
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
  },
  grey: {
    color: "#aaa"
  }
})

export default withStyles(styles)(DueDate)
