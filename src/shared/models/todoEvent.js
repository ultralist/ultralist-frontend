// @flow
import TodoItemModel from "./todoItem"

type TodoEvents = "EventAdded" | "EventDeleted" | "EventUpdated"

export default class TodoEvent {
  todo: TodoItemModel
  eventType: TodoEvents

  constructor(eventType: TodoEvents, todo: TodoItemModel) {
    this.eventType = eventType
    this.todo = todo
  }

  toJSON() {
    return {
      eventType: this.eventType,
      id: this.todo.id,
      uuid: this.todo.uuid,
      subject: this.todo.subject,
      projects: this.todo.projects,
      contexts: this.todo.contexts,
      due: this.todo.due,
      completed: this.todo.completed,
      completedDate: this.todo.completedDate,
      archived: this.todo.archived,
      isPriority: this.todo.isPriority,
      notes: this.todo.notes
      // createdAt: this.todo.createdAt
    }
  }
}

export const createAddEvent = (todo: TodoItemModel) => {
  return new TodoEvent("EventAdded", todo)
}

export const createUpdateEvent = (todo: TodoItemModel) => {
  return new TodoEvent("EventUpdated", todo)
}

export const createDeleteEvent = (todo: TodoItemModel) => {
  return new TodoEvent("EventDeleted", todo)
}
