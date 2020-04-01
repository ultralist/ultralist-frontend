// @flow
import TodoItemModel from "./todoItem"
import TodoList, { findLowestUnusedID } from "./todoList"

describe("findLowestUnusedID", () => {
  it("returns 1 for the first todo", () => {
    expect(findLowestUnusedID([])).toEqual(1)
  })

  it("finds the lowest in the middle", () => {
    const todos = []
    todos.push(new TodoItemModel({}))
    todos.push(new TodoItemModel({ id: 1 }))
    todos.push(new TodoItemModel({ id: 3 }))

    expect(findLowestUnusedID(todos)).toEqual(2)
  })

  it("uses the highest of none of the lowers are available", () => {
    const todos = []
    todos.push(new TodoItemModel({}))
    todos.push(new TodoItemModel({ id: 1 }))
    todos.push(new TodoItemModel({ id: 2 }))

    expect(findLowestUnusedID(todos)).toEqual(3)
  })

  it("uses id 1 if it's available", () => {
    const todos = []
    todos.push(new TodoItemModel({}))
    todos.push(new TodoItemModel({ id: 2 }))
    todos.push(new TodoItemModel({ id: 3 }))

    expect(findLowestUnusedID(todos)).toEqual(1)
  })
})
