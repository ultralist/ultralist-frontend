// @flow
import React, { useState } from "react"
import Button from "@material-ui/core/Button"
import { DatePicker, MuiPickersUtilsProvider } from "material-ui-pickers"
import DateFnsUtils from "@date-io/date-fns"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
import TextField from "@material-ui/core/TextField"
import { makeStyles } from "@material-ui/styles"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"

import KeyboardIcon from "@material-ui/icons/Keyboard"
import LeftArrowIcon from "@material-ui/icons/ArrowLeft"
import RightArrowIcon from "@material-ui/icons/ArrowRight"

import TodoItemModel from "../../../models/todoItem"

type Props = {
  todoItem: TodoItemModel,
  title: string,
  onChange: (todoItem: TodoItemModel) => void
}

const useStyles = makeStyles({
  text: {
    width: "100%",
    maxWidth: "500px"
  },
  withMargin: {
    marginTop: 20,
    marginBottom: 20
  }
})

const Margin = props => {
  const classes = useStyles()
  return <div className={classes.withMargin}>{props.children}</div>
}

const TodoForm = (props: Props) => {
  const classes = useStyles()
  const [todoItem, setTodoItem] = useState(props.todoItem)

  const setTodoText = (ev: SyntheticEvent<HTMLButtonElement>) => {
    todoItem.setSubject(ev.currentTarget.value)
    setTodoItem(todoItem)
  }

  const setTodoDate = (date: Date) => {
    todoItem.setDue(date)
    setTodoItem(todoItem)
  }

  const toggleIsPriority = () => {
    todoItem.togglePriority()
    setTodoItem(todoItem)
  }

  const toggleArchived = () => {
    todoItem.toggleArchived()
    setTodoItem(todoItem)
  }

  const toggleCompleted = () => {
    todoItem.toggleCompleted()
    setTodoItem(todoItem)
  }

  const onChange = () => {
    props.onChange(todoItem)
  }

  const isValid = () => {
    return todoItem.subject !== ""
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <Margin>
          <TextField
            error={!isValid()}
            className={classes.text}
            value={todoItem.subject}
            label="Description"
            onChange={setTodoText}
          />
        </Margin>

        <Margin>
          <DatePicker
            autoOk
            keyboardIcon={<KeyboardIcon />}
            leftArrowIcon={<LeftArrowIcon />}
            rightArrowIcon={<RightArrowIcon />}
            label="Due"
            clearable
            value={todoItem.dueDate()}
            onChange={setTodoDate}
          />
        </Margin>

        <Margin>
          <FormControlLabel
            control={
              <Switch onChange={toggleCompleted} checked={todoItem.completed} />
            }
            label="Completed"
          />
          <FormControlLabel
            control={
              <Switch
                onChange={toggleIsPriority}
                checked={todoItem.isPriority}
              />
            }
            label="Priority"
          />
          <FormControlLabel
            control={
              <Switch onChange={toggleArchived} checked={todoItem.archived} />
            }
            label="Archived"
          />
        </Margin>
      </DialogContent>

      <DialogActions>
        <Button disabled={!isValid()} color="primary" onClick={onChange}>
          Submit
        </Button>
      </DialogActions>
    </MuiPickersUtilsProvider>
  )
}

export default TodoForm
