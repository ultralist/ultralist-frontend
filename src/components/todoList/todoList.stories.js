// @flow
import React from "react"
import { storiesOf } from "@storybook/react"
import { todos } from "../../test/test_helper"

import TodoList from "./todoList"

import TodoListModel from "../../models/todoList"

const list = new TodoListModel({ name: "My List", todos })

storiesOf("components/todoList", module).add("Standard", () => (
  <React.Fragment>
    <TodoList todoList={list} />
  </React.Fragment>
))
