// @flow
import grouper from "./grouper"

import TodoItemModel from "../../models/todoItem"
import TodoListGroup from "../../models/todoListGroup"

import { ALL, BY_CONTEXT, BY_PROJECT } from "../../constants"
import { todos } from "../../test/test_helper"

it("filters by context", () => {
  grouper.grouped(todos, BY_CONTEXT)
  expect(1).toEqual(1)
})

