// @flow
import React, { useState, useEffect } from "react"
import Button from "@material-ui/core/Button"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField
} from "@material-ui/core"

import { DatePicker, MuiPickersUtilsProvider } from "material-ui-pickers"
import DateFnsUtils from "@date-io/date-fns"

import { makeStyles } from "@material-ui/styles"

import KeyboardIcon from "@material-ui/icons/Keyboard"
import LeftArrowIcon from "@material-ui/icons/ArrowLeft"
import RightArrowIcon from "@material-ui/icons/ArrowRight"
import red from "@material-ui/core/colors/red"

import TodoItemModel from "../../../shared/models/todoItem"

type Props = {
  todoItem: TodoItemModel,
  title: string,
  onChange: (todoItem: TodoItemModel) => void,
  onDelete?: (todoItem: TodoItemModel) => void,
  onClose: () => void,
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
const statusRef = React.createRef()

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

  const onSetStatus = ev => {
    todoItem.setStatus(ev.target.value)
    setTodoItem(todoItem)
  }

  const onChangeRecur = ev => {
    todoItem.recur = ev.target.value === "none" ? null : ev.target.value
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
        <Button variant="outlined" size="small" onClick={onShowDeleteDialog}>
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
          <TextField
            error={!isValid()}
            className={classes.text}
            defaultValue={todoItem.subject}
            label="Description"
            autoFocus
            inputRef={subjectRef}
          />
        </Margin>

        <Margin>
          <TextField
            error={!isValid()}
            className={classes.text}
            label="Status"
            value={todoItem.status}
            onChange={onSetStatus}
          />
        </Margin>

        <FormControl>
          <InputLabel>Recur</InputLabel>
          <Select value={todoItem.recur || "none"} onChange={onChangeRecur}>
            <MenuItem value="none">Does not recur</MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekdays">Weedays</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>

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
        {renderDelete()}
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={props.onClose}>
          Cancel
        </Button>
        <Button color="primary" onClick={onChange}>
          Submit
        </Button>
      </DialogActions>
    </MuiPickersUtilsProvider>
  )
}

export default TodoForm
