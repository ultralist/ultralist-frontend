// @flow
import group from "./grouper"

import TodoItemModel from "../../../models/todoItem"
import TodoListGroup from "../../../models/todoListGroup"

import { ALL, BY_CONTEXT, BY_PROJECT } from "../../../constants"
import { todos } from "../../../test/test_helper"

it("groups by context", () => {
  const grouped = group(todos, BY_CONTEXT)
  expect(grouped.length).toEqual(7)

  const nickGroup = grouped.find(g => g.name === "Nick")
  expect(nickGroup.todos.length).toEqual(2)
})

it("groups by project", () => {
  const grouped = group(todos, BY_PROJECT)
  expect(grouped.length).toEqual(6)

  const projects = [
    "bigProject",
    "budget",
    "due",
    "mobile",
    "No projects",
    "testProject"
  ]
  expect(grouped.map(g => g.name)).toEqual(projects)
})
