// @flow
import React from "react"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import TodoForm from "./todoForm"
import TodoItemModel from "../../../models/todoItem"

import { todos } from "../../../test/test_helper"

const onChange = (todoItem: TodoItemModel) => {
  console.log("onChange",todoItem)
  console.log("existing",todos[0])
}

storiesOf("components/todoItem/todoForm", module)
  .add("Existing todo", () => (
    <TodoForm todoItem={todos[0]} onChange={onChange} />
  ))
