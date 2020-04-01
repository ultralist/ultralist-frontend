// @flow
import TodoItemModel from "./todoItem"

describe("setSubject", () => {
  it("hydrates the contexts and projects arrays", () => {
    const todo = new TodoItemModel({})

    todo.setSubject("chat with @bob about +project")

    expect(todo.contexts).toEqual(["bob"])
    expect(todo.projects).toEqual(["project"])
  })
})
