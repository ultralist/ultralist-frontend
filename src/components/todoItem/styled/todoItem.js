// @flow
import React, { useState } from "react"
import { format } from "date-fns"

import { withStyles } from "@material-ui/core/styles"
import IconButton from "@material-ui/core/IconButton"
import ListItem from "@material-ui/core/ListItem"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import Checkbox from "@material-ui/core/Checkbox"
import StarBorder from "@material-ui/icons/StarBorder"
import ListItemText from "@material-ui/core/ListItemText"
import Star from "@material-ui/icons/Star"
import Collapse from "@material-ui/core/Collapse"

import MoreHorizIcon from "@material-ui/icons/MoreHoriz"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"

import yellow from "@material-ui/core/colors/yellow"

import TodoItemModel from "../../../models/todoItem"

import DueDate from "./dueDate"
import TodoText from "./todoText"
import DueTodayButton from "./dueTodayButton"
import TodoItemNote from "./todoItemNote"

type Props = {
  todoItem: TodoItemModel,
  onChange: (todoItem: TodoItemModel) => void,
  onSubjectClick: (str: string) => void,
  classes: {
    shortWidthHide: string,
    shortWidthShow: string,
    starIcon: string,
    notesArea: string
  }
}

const styles = theme => ({
  shortWidthHide: {
    [theme.breakpoints.down(700 + theme.spacing.unit * 3 * 2)]: {
      display: "none"
    },
    [theme.breakpoints.up(700 + theme.spacing.unit * 3 * 2)]: {
      display: "block"
    }
  },
  shortWidthShow: {
    [theme.breakpoints.down(700 + theme.spacing.unit * 3 * 2)]: {
      display: "block"
    },
    [theme.breakpoints.up(700 + theme.spacing.unit * 3 * 2)]: {
      display: "none"
    }
  },
  starIcon: {
    color: yellow[800]
  },
  notesArea: {
    backgroundColor: "#efefef",
    marginLeft: 40,
    marginBottom: 20
  },
})

const TodoItem = (props: Props) => {
  const [todoItem, setTodoItem] = useState(props.todoItem)
  const [showNotes, setShowNotes] = useState(false)

  const toggleComplete = () => {
    todoItem.toggleComplete()
    setTodoItem(todoItem)
    props.onChange(todoItem)
  }

  const togglePriority = () => {
    todoItem.togglePriority()
    setTodoItem(todoItem)
    props.onChange(todoItem)
  }

  const setDueToday = () => {
    todoItem.due = format(new Date(), "YYYY-MM-DD")
    setTodoItem(todoItem)
    props.onChange(todoItem)
  }

  const deleteNote = note => {
    todoItem.deleteNote(note)
    setTodoItem(todoItem)
    props.onChange(todoItem)
  }

  const toggleShowNotes = () => {
    setShowNotes(!showNotes)
  }

  const notes = () => {
    return todoItem.notes.map(n => (
      <TodoItemNote note={n} onDeleteNote={deleteNote} />
    ))
  }

  return (
    <React.Fragment>
      <ListItem key={todoItem.id}>
        <Checkbox
          tabIndex={-1}
          checked={todoItem.completed}
          onChange={toggleComplete}
        />

        <IconButton
          onClick={togglePriority}
          className={props.classes.shortWidthHide}
          aria-label="Prioritize"
        >
          {todoItem.isPriority ? <Star className={props.classes.starIcon}/> : <StarBorder />}
        </IconButton>

        <ListItemText
          primary={
            <TodoText val={todoItem.subject} onClick={props.onSubjectClick} />
          }
          secondary={<DueDate date={todoItem.due} />}
        />

        <ListItemSecondaryAction>
          <div className={props.classes.shortWidthHide}>
            <DueTodayButton due={todoItem.due} onClick={setDueToday} />
            <IconButton aria-label="More actions">
              <MoreHorizIcon />
            </IconButton>
            <IconButton onClick={toggleShowNotes} aria-label="Show Notes">
              {showNotes ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </div>
        </ListItemSecondaryAction>
      </ListItem>

      <Collapse in={showNotes} timeout="auto" unmountOnExit>
        <ul className={props.classes.notesArea}> {notes()} </ul>
      </Collapse>
    </React.Fragment>
  )
}

export default withStyles(styles)(TodoItem)
