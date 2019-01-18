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

  updateTodolist(uuid: string, cache: EventCache) {
    return new Promise(resolve => resolve(todoList))
  }

  fetchTodoLists() {
    return new Promise(resolve => {
      resolve([todoList])
    })
  }
}
