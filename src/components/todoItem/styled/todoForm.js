// @flow
import React, { useState } from "react"
import { DatePicker, MuiPickersUtilsProvider } from "material-ui-pickers"
import DateFnsUtils from "@date-io/date-fns"
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'

import TodoItemModel from "../../../models/todoItem"

type Props = {
  todoItem: TodoItemModel,
  classes: Object
}

const styles = theme => ({
  text: {
    width: "100%"
  }
})

const onChange = () => {
  console.log("on change")
}

const TodoForm = (props: Props) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <TextField className={props.classes.text} defaultValue={props.todoItem.subject} label="Description" />
      <FormControlLabel control={<Switch checked={props.todoItem.isPriority} />} label="Priority" />
      <FormControlLabel control={<Switch checked={props.todoItem.archived} />} label="Archived" />
        <DatePicker
          autoOk
          label="Due"
          clearable
          value={props.todoItem.dueDate()}
          onChange={onChange}
        />
    </MuiPickersUtilsProvider>
  )
}

export default withStyles(styles)(TodoForm)
