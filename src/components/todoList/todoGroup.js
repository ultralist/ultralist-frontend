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
  selectedTodoUUID: string,
  onChange: (todoItem: TodoItemModel) => void,
  onDelete: (todoItem: TodoItemModel) => void,
  onSubjectClick: (str: string) => void
}

const useStyles = makeStyles({})

const TodoGroup = (props: Props) => {
  const classes = useStyles()
  const todos = props.group.sortedTodos()
  return (
    <List
      subheader={
        <ListSubheader className={classes.subheader} component="div">
          {props.group.name}
        </ListSubheader>
      }
    >
      {todos.map(todo => (
        <React.Fragment key={todo.uuid}>
          <TodoItem isFirst={todo.uuid == todos[0].uuid} isSelected={todo.uuid === props.selectedTodoUUID} onChange={props.onChange} onDelete={props.onDelete} onSubjectClick={props.onSubjectClick} todoItem={todo} />
        </React.Fragment>
      ))}
    </List>
  )
}

export default TodoGroup
