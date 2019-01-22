import { format, addDays } from "date-fns"
import utils from "../utils"
import TodoItemModel from "../models/todoItem"

export const todoData = [
  {
    id: 1,
    uuid: utils.generateUuid(),
    subject: "Call with @Bob and @Frank about +bigProject",
    projects: ["bigProject"],
    contexts: ["Bob", "Frank"],
    isPriority: true,
    due: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    notes: ["here is note 1", "here is note 2"],
    completed: false,
    archived: false
  },
  {
    id: 2,
    uuid: utils.generateUuid(),
    subject: "Strategy for +mobile @pomodoro",
    projects: ["mobile"],
    contexts: [],
    isPriority: false,
    due: format(new Date(), "yyyy-MM-dd"),
    notes: ["here is note 1", "here is note 2"],
    completed: false,
    archived: false
  },
  {
    id: 3,
    uuid: utils.generateUuid(),
    subject: "Send phone udid to @Marty to test +mobile projects",
    projects: ["mobile"],
    contexts: ["marty"],
    isPriority: false,
    due: format(new Date(), "yyyy-MM-dd"),
    notes: [],
    completed: false,
    archived: false
  },
  {
    id: 4,
    uuid: utils.generateUuid(),
    subject: "Did @john call me back about the +testProject?",
    projects: ["testProject"],
    contexts: ["john"],
    isPriority: false,
    due: format(new Date(), "yyyy-MM-dd"),
    notes: [],
    completed: true,
    archived: false
  },
  {
    id: 5,
    uuid: utils.generateUuid(),
    subject: "Follow up with @nick about 6-month salary increase",
    projects: [],
    contexts: ["Nick"],
    due: format(addDays(new Date(), -2), "yyyy-MM-dd"),
    notes: [],
    completed: true,
    isPriority: true,
    archived: true
  },
  {
    id: 6,
    uuid: utils.generateUuid(),
    subject:
      "Work on +budget presentation for leadership team, sell to @Nick first",
    projects: ["budget"],
    contexts: ["Nick"],
    due: format(addDays(new Date(), -2), "yyyy-MM-dd"),
    notes: [],
    completed: false,
    isPriority: false,
    archived: false
  },
  {
    id: 7,
    uuid: utils.generateUuid(),
    subject: "no +due @date",
    projects: ["due"],
    contexts: ["date"],
    due: null,
    notes: [],
    completed: false,
    isPriority: false,
    archived: false
  }
]

export const todos = todoData.map(t => new TodoItemModel(t))
