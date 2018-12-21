// @flow
import React from "react"

import TodoItemModel from "../../models/todoItem"
import TodoListGroup from "../../models/todoListGroup"

import TodoGroup from "./todoGroup"

type Props = {
  todos: Array<TodoItemModel>,
  onChange: (todoItem: TodoItemModel) => void
}

const TodoList = (props: Props) => {
  return groups.map(g => (
    <TodoGroup
      onChange={props.onChange}
      onSubjectChange
      group={g}
    />
  ))
}
