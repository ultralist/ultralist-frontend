// @flow
import React, { useState, useEffect } from "react"
import Button from "@material-ui/core/Button"
import { DatePicker, MuiPickersUtilsProvider } from "material-ui-pickers"
import DateFnsUtils from "@date-io/date-fns"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
import TextField from "@material-ui/core/TextField"
import { makeStyles } from "@material-ui/styles"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"

import KeyboardIcon from "@material-ui/icons/Keyboard"
import LeftArrowIcon from "@material-ui/icons/ArrowLeft"
import RightArrowIcon from "@material-ui/icons/ArrowRight"
import red from "@material-ui/core/colors/red"

import TodoItemModel from "../../../models/todoItem"

type Props = {
  todoItem: TodoItemModel,
  title: string,
  onChange: (todoItem: TodoItemModel) => void,
  onDelete?: (todoItem: TodoItemModel) => void,
  showDelete: boolean
}

const useStyles = makeStyles({
  text: {
    width: "100%",
    maxWidth: "500px"
  },
  withMargin: {
    marginTop: 20,
    marginBottom: 20
  },
  red: {
    color: "white",
    backgroundColor: red[800],
    "&:hover": {
      backgroundColor: red[500]
    }
  }
})

const subjectRef = React.createRef()

const Margin = props => {
  const classes = useStyles()
  return <div className={classes.withMargin}>{props.children}</div>
}

const TodoForm = (props: Props) => {
  const classes = useStyles()
  const [todoItemAttrs, setTodoItem] = useState(props.todoItem.toJSON())
  const todoItem = new TodoItemModel(todoItemAttrs)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const setTodoDate = (date: Date) => {
    todoItem.setDue(date)
    setTodoItem(todoItem)
  }

  const toggleIsPriority = () => {
    todoItem.togglePriority()
    setTodoItem(todoItem.toJSON())
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
    if (!isValid()) return

    if (todoItem.subject !== subjectRef.current.value) {
      todoItem.setSubject(subjectRef.current.value)
      setTodoItem(todoItem)
    }

    props.onChange(todoItem)
  }

  const onShowDeleteDialog = () => {
    setShowDeleteDialog(true)
  }

  const onCloseDeleteDialog = () => {
    setShowDeleteDialog(false)
  }

  const onDelete = () => {
    setShowDeleteDialog(false)
    props.onDelete(todoItem)
  }

  const isValid = () => {
    if (!subjectRef.current) return true
    return subjectRef.current.value !== ""
  }

  const onKeypress = event => {
    if (event.keyCode === 13) onChange()
  }

  useEffect(() => {
    subjectRef.current.addEventListener("keypress", onKeypress)

    return () => {
      subjectRef.current.removeEventListener("keypress", onKeypress)
    }
  }, [])

  const renderDelete = () => {
    if (props.showDelete === false) return
    return (
      <React.Fragment>
        <Button className={classes.red} onClick={onShowDeleteDialog}>
          Delete this todo
        </Button>
        <Dialog open={showDeleteDialog} onClose={onCloseDeleteDialog}>
          <DialogTitle>Delete this todo?</DialogTitle>
          <DialogActions>
            <Button onClick={onDelete}>Delete</Button>
            <Button onClick={onCloseDeleteDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <Margin>
          <TextField error={!isValid()} className={classes.text} defaultValue={todoItem.subject} label="Description" autoFocus inputRef={subjectRef} />
        </Margin>

        <Margin>
          <DatePicker autoOk keyboardIcon={<KeyboardIcon />} leftArrowIcon={<LeftArrowIcon />} rightArrowIcon={<RightArrowIcon />} label="Due" clearable value={todoItem.dueDate()} onChange={setTodoDate} />
        </Margin>

        <Margin>
          <FormControlLabel control={<Switch onChange={toggleCompleted} checked={todoItem.completed} />} label="Completed" />
          <FormControlLabel control={<Switch onChange={toggleIsPriority} checked={todoItem.isPriority} />} label="Priority" />
          <FormControlLabel control={<Switch onChange={toggleArchived} checked={todoItem.archived} />} label="Archived" />
        </Margin>
        {renderDelete()}
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={onChange}>
          Submit
        </Button>
      </DialogActions>
    </MuiPickersUtilsProvider>
  )
}

export default TodoForm
