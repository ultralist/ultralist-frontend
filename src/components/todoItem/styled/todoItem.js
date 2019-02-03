// @flow
import React, { useState } from "react"

import { withStyles } from "@material-ui/core/styles"
import IconButton from "@material-ui/core/IconButton"
import ListItem from "@material-ui/core/ListItem"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import Checkbox from "@material-ui/core/Checkbox"
import StarBorder from "@material-ui/icons/StarBorder"
import ListItemText from "@material-ui/core/ListItemText"
import Star from "@material-ui/icons/Star"
import Collapse from "@material-ui/core/Collapse"
import Paper from "@material-ui/core/Paper"

import EditIcon from "@material-ui/icons/Edit"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ArchiveIcon from "@material-ui/icons/Archive"
import UnarchiveIcon from "@material-ui/icons/Unarchive"

import yellow from "@material-ui/core/colors/yellow"

import TodoItemModel from "../../../models/todoItem"

import DueDate from "./dueDate"
import TodoText from "./todoText"
import SetDueButton from "./setDueButton"
import TodoItemNote from "./todoItemNote"
import EditTodo from "./editTodo"

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
  paper: {
    [theme.breakpoints.down(700 + theme.spacing.unit * 3 * 2)]: {},
    [theme.breakpoints.up(700 + theme.spacing.unit * 3 * 2)]: {
      maxWidth: 1200
    }
  },
  starIcon: {
    color: yellow[800]
  },
  notesArea: {
    backgroundColor: "#efefef",
    marginLeft: 40,
    marginBottom: 20
  }
})

const TodoItem = (props: Props) => {
  const todoItem = props.todoItem
  const [showNotes, setShowNotes] = useState(false)
  const [showEditTodo, setShowEditTodo] = useState(false)

  const toggleShowEditTodo = () => {
    setShowEditTodo(!showEditTodo)
  }

  const toggleComplete = () => {
    todoItem.toggleCompleted()
    onChangeTodo(todoItem)
  }

  const togglePriority = () => {
    todoItem.togglePriority()
    onChangeTodo(todoItem)
  }

  const deleteNote = note => {
    todoItem.deleteNote(note)
    onChangeTodo(todoItem)
  }

  const toggleArchived = () => {
    todoItem.toggleArchived()
    onChangeTodo(todoItem)
  }

  const toggleShowNotes = () => {
    setShowNotes(!showNotes)
  }

  const onChangeTodo = todoItem => {
    props.onChange(todoItem)
  }

  const notes = () => {
    return todoItem.notes.map(n => (
      <React.Fragment key={n}>
        <TodoItemNote note={n} onDeleteNote={deleteNote} />
      </React.Fragment>
    ))
  }

  const ArchiveButton = props => (
    <IconButton onClick={props.onClick}>
      <ArchiveIcon />
    </IconButton>
  )

  const UnarchiveButton = props => (
    <IconButton onClick={props.onClick}>
      <UnarchiveIcon />
    </IconButton>
  )

  const firstButton = () => {
    if (todoItem.completed) {
      if (todoItem.archived) {
        return <UnarchiveButton onClick={toggleArchived} />
      } else {
        return <ArchiveButton onClick={toggleArchived} />
      }
    } else {
      if (todoItem.archived) {
        return <UnarchiveButton onClick={toggleArchived} />
      } else {
        return <SetDueButton todoItem={todoItem} onChange={onChangeTodo} />
      }
    }
  }

  return (
    <Paper className={props.classes.paper}>
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
          {todoItem.isPriority ? (
            <Star className={props.classes.starIcon} />
          ) : (
            <StarBorder />
          )}
        </IconButton>

        <ListItemText
          primary={
            <TodoText
              bold={todoItem.isPriority}
              strike={todoItem.completed}
              grey={todoItem.archived}
              val={todoItem.subject}
              onClick={props.onSubjectClick}
            />
          }
          secondary={
            <DueDate
              grey={todoItem.archived || todoItem.completed}
              date={todoItem.dueDate()}
            />
          }
        />

        <ListItemSecondaryAction>
          <div className={props.classes.shortWidthHide}>
            {firstButton()}

            <IconButton onClick={toggleShowEditTodo} aria-label="Edit">
              <EditIcon />
            </IconButton>

            <IconButton onClick={toggleShowNotes} aria-label="Show Notes">
              {showNotes ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </div>
          <div className={props.classes.shortWidthShow}>
            <IconButton onClick={toggleShowEditTodo} aria-label="Edit">
              <EditIcon />
            </IconButton>
          </div>
        </ListItemSecondaryAction>
      </ListItem>

      <Collapse in={showNotes} timeout="auto" unmountOnExit>
        <ul className={props.classes.notesArea}> {notes()} </ul>
      </Collapse>

      <EditTodo
        show={showEditTodo}
        onClose={toggleShowEditTodo}
        todoItem={todoItem}
        onEditTodo={onChangeTodo}
      />
    </Paper>
  )
}

export default withStyles(styles)(TodoItem)
