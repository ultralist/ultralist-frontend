// @flow
import React, { useState, useEffect } from "react"

import { makeStyles, createStyles } from "@material-ui/styles"
import {
  Badge,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Checkbox,
  Tooltip
} from "@material-ui/core"

import StarBorder from "@material-ui/icons/StarBorder"
import Star from "@material-ui/icons/Star"
import NotesIcon from "@material-ui/icons/Notes"
import ArchiveIcon from "@material-ui/icons/Archive"
import UnarchiveIcon from "@material-ui/icons/Unarchive"

import yellow from "@material-ui/core/colors/yellow"

import TodoItemModel from "../../../shared/models/todoItem"

import ModalStorage from "../../../shared/storage/modalStorage"
import StorageContext from "../../../shared/storageContext"

import DueDate from "./dueDate"
import TodoText from "./todoText"
import SetDueButton from "./setDueButton"
import TodoItemNotes from "./todoItemNotes"
import EditTodo from "./editTodo"

type Props = {
  todoItem: TodoItemModel,
  isSelected: boolean,
  isFirst: boolean,
  onChange: (todoItem: TodoItemModel) => void,
  onDelete: (todoItem: TodoItemModel) => void,
  onSubjectClick: (str: string) => void,
  showEditTodo: boolean
}

const useStyles = makeStyles(theme =>
  createStyles({
    shortWidthHide: {
      [theme.breakpoints.down("xs")]: {
        display: "none"
      },
      [theme.breakpoints.up("sm")]: {
        display: "block"
      }
    },
    shortWidthShow: {
      [theme.breakpoints.down("xs")]: {
        display: "block"
      },
      [theme.breakpoints.up("sm")]: {
        display: "none"
      }
    },
    todo: {
      [theme.breakpoints.down("xs")]: {},
      [theme.breakpoints.up("sm")]: {
        maxWidth: 1200
      },
      color: "#444",
      backgroundColor: "#fff",
      borderTop: "1px solid #eee"
    },
    firstTodo: {
      [theme.breakpoints.down("xs")]: {},
      [theme.breakpoints.up("sm")]: {
        maxWidth: 1200
      },
      color: "#444",
      backgroundColor: "#fff"
    },
    starIcon: {
      color: yellow[800]
    },
    notesArea: {
      backgroundColor: "#fff",
      paddingLeft: 90
    },
    buttonRow: {
      display: "flex",
      flexDirection: "row"
    }
  })
)

const TodoItem = (props: Props) => {
  const classes = useStyles()
  const modalStorage = new ModalStorage(React.useContext(StorageContext))

  const [todoItemAttrs, setTodoItemAttrs] = useState(props.todoItem.toJSON())
  const todoItem = new TodoItemModel(todoItemAttrs)

  const [showTodoNotes, setShowTodoNotes] = useState(false)
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

  const toggleArchived = () => {
    todoItem.toggleArchived()
    onChangeTodo(todoItem)
  }

  const toggleShowTodoNotes = () => {
    setShowTodoNotes(!showTodoNotes)
  }

  const onChangeTodo = todoItem => {
    setTodoItemAttrs(todoItem.toJSON())
    props.onChange(todoItem)
  }

  const ArchiveButton = props => (
    <Tooltip title="Archive todo">
      <IconButton onClick={props.onClick}>
        <ArchiveIcon />
      </IconButton>
    </Tooltip>
  )

  const UnarchiveButton = props => (
    <Tooltip title="Unarchive todo">
      <IconButton onClick={props.onClick}>
        <UnarchiveIcon />
      </IconButton>
    </Tooltip>
  )

  const NoteIcon = props => {
    if (props.count > 0) {
      return (
        <Badge badgeContent={props.count} color="primary">
          <NotesIcon />
        </Badge>
      )
    } else {
      return <NotesIcon />
    }
  }

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
        return (
          <SetDueButton
            todoItem={todoItem}
            onChange={onChangeTodo}
            onShowEditModal={toggleShowEditTodo}
          />
        )
      }
    }
  }

  const onKeypress = event => {
    if (!props.isSelected || modalStorage.isModalOpen()) return

    if (event.keyCode === 13) setShowEditTodo(true)
    if (event.keyCode === 99) toggleComplete()
    if (event.keyCode === 112) togglePriority()
    if (event.keyCode === 65) toggleArchived()
  }

  useEffect(() => {
    document.addEventListener("keypress", onKeypress)

    return () => {
      document.removeEventListener("keypress", onKeypress)
    }
  }, [])

  return (
    <React.Fragment key={todoItem.id}>
      <ListItem className={props.isFirst ? classes.firstTodo : classes.todo}>
        <Tooltip title="Set completed">
          <Checkbox
            tabIndex={-1}
            checked={todoItem.completed}
            onChange={toggleComplete}
          />
        </Tooltip>

        <Tooltip title="Prioritize">
          <IconButton
            onClick={togglePriority}
            className={classes.shortWidthHide}
            aria-label="Prioritize"
          >
            {todoItem.isPriority ? (
              <Star className={classes.starIcon} />
            ) : (
              <StarBorder />
            )}
          </IconButton>
        </Tooltip>

        <ListItemText
          onClick={toggleShowEditTodo}
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

        <EditTodo
          show={showEditTodo}
          onClose={toggleShowEditTodo}
          todoItem={todoItem}
          onEditTodo={onChangeTodo}
          onDeleteTodo={props.onDelete}
        />

        <TodoItemNotes
          show={showTodoNotes}
          onClose={toggleShowTodoNotes}
          todoItem={todoItem}
          onChange={onChangeTodo}
        />

        <ListItemSecondaryAction>
          <div className={classes.buttonRow}>
            <span className={classes.shortWidthHide}>{firstButton()}</span>

            <Tooltip title="Show/hide notes">
              <IconButton onClick={toggleShowTodoNotes} aria-label="Show Notes">
                <NoteIcon count={todoItem.notes.length} />
              </IconButton>
            </Tooltip>
          </div>
        </ListItemSecondaryAction>
      </ListItem>
    </React.Fragment>
  )
}

export default TodoItem
