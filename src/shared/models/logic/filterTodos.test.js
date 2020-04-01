// @flow
import filterTodos from "./filterTodos"

import TodoItemModel from "../../../models/todoItem"
import TodoListGroup from "../../../models/todoListGroup"
import FilterModel from "../../../models/filter"

import { todos } from "../../../test/test_helper"

it("a blank filter will return all todos", () => {
  const filterModel = new FilterModel({})

  const filtered = filterTodos(todos, filterModel)

  expect(filtered.length).toEqual(7)
})

it("filters by project", () => {
  const filterModel = new FilterModel({ projects: ["bigProject"] })

  const filtered = filterTodos(todos, filterModel)

  expect(filtered.length).toEqual(1)
  expect(filtered[0].projects).toEqual(["bigProject"])
})

it("filters by todos with no project", () => {
  const filterModel = new FilterModel({ projects: [] })

  const filtered = filterTodos(todos, filterModel)

  expect(filtered.length).toEqual(1)
  expect(filtered[0].id).toEqual(5)
})

it("filters by context", () => {
  const filterModel = new FilterModel({ contexts: ["Nick"] })

  const filtered = filterTodos(todos, filterModel)

  expect(filtered.length).toEqual(2)
  expect(filtered[0].contexts).toEqual(["Nick"])
})

it("filters by todos with no context", () => {
  const filterModel = new FilterModel({ contexts: [] })

  const filtered = filterTodos(todos, filterModel)

  expect(filtered.length).toEqual(1)
  expect(filtered[0].id).toEqual(2)
})

it("filters by subject", () => {
  const filterModel = new FilterModel({ subjectContains: "presentation" })

  const filtered = filterTodos(todos, filterModel)

  expect(filtered.length).toEqual(1)
  expect(filtered[0].id).toEqual(6)
})

it("filters by subject, ignores case", () => {
  const filterModel = new FilterModel({ subjectContains: "Presentation" })

  const filtered = filterTodos(todos, filterModel)

  expect(filtered.length).toEqual(1)
  expect(filtered[0].id).toEqual(6)
})

it("filters by archived", () => {
  const filterModel = new FilterModel({ archived: true })

  const filtered = filterTodos(todos, filterModel)

  expect(filtered.length).toEqual(1)
  expect(filtered[0].id).toEqual(5)
  expect(filtered[0].archived).toBeTruthy()
})

it("filters by priority", () => {
  const filterModel = new FilterModel({ isPriority: true })

  const filtered = filterTodos(todos, filterModel)

  expect(filtered.length).toEqual(2)
})

it("filters by completed", () => {
  const filterModel = new FilterModel({ completed: true })

  const filtered = filterTodos(todos, filterModel)

  expect(filtered.length).toEqual(2)
  expect(filtered.map(f => f.id)).toEqual([4, 5])
})

it("filters by priority and completed", () => {
  const filterModel = new FilterModel({ isPriority: true, completed: true })

  const filtered = filterTodos(todos, filterModel)

  expect(filtered.length).toEqual(1)
})

it("filters by subject and contexts", () => {
  const filterModel = new FilterModel({
    subjectContains: "presentation",
    contexts: ["dingle"]
  })

  const filtered = filterTodos(todos, filterModel)

  expect(filtered.length).toEqual(0)
})

it("filters by subject and contexts right contexts", () => {
  const filterModel = new FilterModel({
    subjectContains: "presentation",
    contexts: ["Nick"]
  })

  const filtered = filterTodos(todos, filterModel)

  expect(filtered.length).toEqual(1)
})

describe("filtering by date", () => {
  it("filtering by agenda takes out todos due in the future, or have no due date", () => {
    const filterModel = new FilterModel({
      due: "agenda"
    })

    const filtered = filterTodos(todos, filterModel)

    expect(filtered.length).toEqual(6)
  })
})
