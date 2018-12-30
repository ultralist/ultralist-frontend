// @flow
import React from "react"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import TodoForm from "./todoForm"
import TodoItemModel from "../../../models/todoItem"

import { todos } from "../../../test/test_helper"

storiesOf("components/todoItem/todoForm", module)
  .add("Existing todo", () => (
    <TodoForm todoItem={todos[0]} />
  ))
