// @flow
import React from "react"

import List from "@material-ui/core/List"
import ListSubheader from "@material-ui/core/ListSubheader"

import TodoItemModel from "../../models/todoItem"
import TodoListGroup from "../../models/todoListGroup"

import TodoItem from "../todoItem/styled/todoItem"
import { makeStyles } from "@material-ui/styles"

type Props = {
  group: TodoListGroup,
  onChange: (todoItem: TodoItemModel) => void,
  onSubjectClick: (str: string) => void
}

const useStyles = makeStyles({
  list: {
    margin: "auto",
    width: "calc(100vw - 15px)",
    maxWidth: 1200
  }
})

const TodoGroup = (props: Props) => {
  const classes = useStyles()
  return (
    <List
      className={classes.list}
      subheader={
        <ListSubheader className={classes.subheader} component="div">
          {props.group.name}
        </ListSubheader>
      }
    >
      {props.group.sortedTodos().map(todo => (
        <React.Fragment key={todo.uuid}>
          <TodoItem
            onChange={props.onChange}
            onSubjectClick={props.onSubjectClick}
            todoItem={todo}
          />
        </React.Fragment>
      ))}
    </List>
  )
}

export default TodoGroup
