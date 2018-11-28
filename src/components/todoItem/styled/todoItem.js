// @flow
import React, { useState } from "react"
import TodoItemModel from "../../../models/todoItem"

import { withStyles } from "@material-ui/core/styles"
import IconButton from "@material-ui/core/IconButton"
import ListItem from "@material-ui/core/ListItem"
import Checkbox from "@material-ui/core/Checkbox"
import StarBorder from "@material-ui/icons/StarBorder"
import ListItemText from "@material-ui/core/ListItemText"
import Star from "@material-ui/icons/Star"

import yellow from "@material-ui/core/colors/yellow"

import DueDate from "./dueDate"
import TodoText from "./todoText"

type Props = {
  todoItem: TodoItemModel,
  onChange: (todoItem: TodoItemModel) => void,
  onSubjectClick: (str: string) => void,
  classes: {
    shortWidthHide: string,
    shortWidthShow: string,
    starIcon: string
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
  }
})

const TodoItem = (props: Props) => {
  const [todoItem, setTodoItem] = useState(props.todoItem)

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

  return (
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
    </ListItem>
  )
}

export default withStyles(styles)(TodoItem)
