import React from "react"
import { format, addDays } from "date-fns"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import { ALL, BY_CONTEXT, BY_PROJECT } from "../../constants"
import { todos } from "../../test/test_helper"

import utils from "../../utils"
import TodoGroup from "./todoGroup"
import grouper from "./grouper"

import TodoItemModel from "../../models/todoItem"
import TodoListGroup from "../../models/todoListGroup"

const group1 = new TodoListGroup({ name: "Bob", todos })

const todoObjects = todos.map(t => new TodoItemModel(t))
const groups = grouper.grouped(todoObjects, BY_CONTEXT)

storiesOf("components/todoGroup", module).add("Standard", () => (
  <React.Fragment>
    {groups.map(g => (
      <TodoGroup onChange={t => action(t)} group={g} />
    ))}
  </React.Fragment>
))
