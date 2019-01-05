// @flow
import React from "react"
import { storiesOf } from "@storybook/react"
import { todos } from "../../test/test_helper"

import TodoList from "./todoList"

import TodoListModel from "../../models/todoList"
import TodoItemModel from "../../models/todoItem"

const list = new TodoListModel({ name: "My List", todos })

const addTodoItem = (todoItem: TodoItemModel) => {
  console.log("addTodoItem", todoItem)
}

const changeTodoItem = (todoItem: TodoItemModel) => {
  console.log("changeTodoItem", todoItem)
}

storiesOf("components/todoList", module).add("Standard", () => (
  <React.Fragment>
    <TodoList
      todoList={list}
      onAddTodoItem={addTodoItem}
      onChangeTodoItem={changeTodoItem}
    />
  </React.Fragment>
))
