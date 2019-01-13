// @flow

import { todos } from "../test/test_helper"

import TodoList from "../models/todoList"

export default class TestBackend {
  token: string

  constructor(token: string) {
    this.token = token
  }

  fetchTodoLists() {
    const todoList = new TodoList({ name: "test list", todos })

    return new Promise(resolve => {
      resolve([todoList])
    })
  }
}
