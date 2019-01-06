// @flow
import React from "react"
import { storiesOf } from "@storybook/react"
import { todos } from "../../test/test_helper"

import TodoList from "./todoList"

import TodoListModel from "../../models/todoList"
import TodoItemModel from "../../models/todoItem"

import EventCache from "../../backend/eventCache"
import { createAddEvent, createUpdateEvent } from "../../models/todoEvent"

const list = new TodoListModel({ name: "My List", todos })
const eventCache = new EventCache()

const addTodoItem = (todoItem: TodoItemModel) => {
  eventCache.addItem(createAddEvent(todoItem))
  console.log("eventCache is ", eventCache.toJSON())
}

const changeTodoItem = (todoItem: TodoItemModel) => {
  eventCache.addItem(createUpdateEvent(todoItem))
  console.log("eventCache is ", eventCache.toJSON())
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
