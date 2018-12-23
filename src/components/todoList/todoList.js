// @flow
import React, { useState } from "react"

import { BY_CONTEXT, BY_PROJECT, BY_ALL } from "../../constants"

import FilterModel from "../../models/filter"
import TodoItemModel from "../../models/todoItem"
import TodoListModel from "../../models/todoList"

import filter from "./filter"
import group from "./grouper"

import TodoGroup from "./todoGroup"

type Props = {
  todoList: TodoListModel
}

const TodoList = (props: Props) => {
  const [filter, setFilter] = useState(new FilterModel({}))
  const filteredTodos = filter(props.todoList.todos, filter)
  const groups = group(filteredTodos, BY_ALL)

  const onChange = (todoItem: TodoItemModel) => {
    console.log("todoItem change", todoItem)
  }

  const onSubjectClick = (str: string) => {
    console.log("subject click", str)
  }

  return (
    <React.Fragment>
      <h2>{props.todoList.name}</h2>

      {groups.map(g => (
        <TodoGroup
          onChange={onChange}
          onSubjectClick={onSubjectClick}
          group={g}
        />
      ))}
    </React.Fragment>
  )
}

export default TodoList
