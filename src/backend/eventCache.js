// @flow
import TodoEvent from "../models/todoEvent"

export default class EventCache {
  cache: Array<TodoEvent>

  constructor() {
    const cache = window.localStorage.getItem("eventCache")
    this.cache = cache ? cache : []
  }

  addItem(event: TodoEvent) {
    this.cache.push(event)
    // window.localStorage.setItem("eventCache", this.cache)
  }

  toJSON(): Array<Object> {
    return this.cache.map(e => e.toJSON())
  }

  clear() {
    this.cache = []
    // window.localStorage.setItem("eventCache", this.cache)
  }
}
