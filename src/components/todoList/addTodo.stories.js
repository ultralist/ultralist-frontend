// @flow
import React, { useState } from "react"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import AddTodo from "./addTodo"
import TodoItemModel from "../../models/todoItem"

const addTodoItem = (todoItem: TodoItemModel) => {
  console.log("todoItem = ", todoItem)
}

storiesOf("components/todoList/addTodo", module).add("Standard", () => (
  <AddTodo onAddTodoItem={addTodoItem} />
))
