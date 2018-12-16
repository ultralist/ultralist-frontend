// @flow
import React from "react"

import List from "@material-ui/core/List"
import ListSubheader from "@material-ui/core/ListSubheader"

import TodoListGroup from "../../models/todoListGroup"

import TodoItem from "../todoItem/styled/todoItem"

type Props = {
  group: TodoListGroup
}

const TodoGroup = (props: Props) => {
  return (
    <List subheader={<ListSubheader component="div">{props.group.name}</ListSubheader>}>
      {props.group.todos.map(todo => <TodoItem todoItem={todo} /> )}
    </List>
  )
}

export default TodoGroup
