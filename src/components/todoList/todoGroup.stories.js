import React from "react"
import { format, addDays } from "date-fns"
import { storiesOf } from "@storybook/react"

import utils from "../../utils"
import TodoGroup from "./todoGroup"

import TodoItemModel from "../../models/todoItem"
import TodoListGroup from "../../models/todoListGroup"

const bobTodo1 = new TodoItemModel({
  id: 1,
  uuid: utils.generateUuid(),
  completed: false,
  archived: false,
  isPriority: false,
  completedDate: null,
  contexts: ["bob"],
  projects: ["tasks"],
  subject: "+tasks chat with @bob",
  due: format(new Date(), "YYYY-MM-DD"),
  notes: ["here is note 1", "here is note 2"]
})

const bobTodo2 = new TodoItemModel({
  id: 1,
  uuid: utils.generateUuid(),
  completed: false,
  archived: false,
  isPriority: false,
  completedDate: null,
  contexts: ["bob"],
  projects: ["waiting"],
  subject: "+waiting did @bob finish up that thing?",
  due: format(new Date(), "YYYY-MM-DD"),
  notes: ["here is note 1", "here is note 2"]
})

const group1 = new TodoListGroup({ name: "Bob", todos: [bobTodo1, bobTodo2] })

storiesOf("components/todoGroup", module)
  .add("Standard", () => (
    <React.Fragment>
      <TodoGroup group={group1} />
      <TodoGroup group={group1} />
    </React.Fragment>
  ))
