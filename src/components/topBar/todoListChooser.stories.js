// @flow
import React from "react"
import { storiesOf } from "@storybook/react"

import TodoListChooser from "./todoListChooser"
import TodoList from "../models/todoList"

const todolists = []

todolists.push(new TodoList({ name: "List 1" }))
todolists.push(new TodoList({ name: "List 2" }))
todolists.push(new TodoList({ name: "List 3" }))

const selectTodoList = (todoList: TodoListModel) => {
  console.log("selectTodoList", todoList)
}

storiesOf("components", module).add("todolistChooser", () => (
  <TodoListChooser todoLists={todolists} onSelectTodoList={selectTodoList} />
))
