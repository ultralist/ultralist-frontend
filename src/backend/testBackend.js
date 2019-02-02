// @flow

import { todoData } from "../test/test_helper"
import EventCache from "./eventCache"
import utils from "../utils"

const todoList = {
  name: "test list",
  todo_items_attributes: todoData,
  uuid: utils.generateUuid()
}

export default class TestBackend {
  token: string

  constructor(token: string) {
    this.token = token
  }

  fetchTodoList(uuid: string) {
    return new Promise(resolve => resolve(todoList))
  }

  updateTodoList(uuid: string, cache: EventCache) {
    return new Promise(resolve => resolve(todoList))
  }

  createTodoList(uuid: string, name: string) {
    return new Promise(resolve => resolve(todoList))
  }

  fetchTodoLists() {
    return new Promise(resolve => {
      resolve([todoList])
    })
  }
}
