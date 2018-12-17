import React from "react"
import { format, addDays } from "date-fns"
import { storiesOf } from "@storybook/react"

import { todos } from "../../test/test_helper"

import utils from "../../utils"
import TodoGroup from "./todoGroup"

import TodoItemModel from "../../models/todoItem"
import TodoListGroup from "../../models/todoListGroup"

const group1 = new TodoListGroup({ name: "Bob", todos })

storiesOf("components/todoGroup", module).add("Standard", () => (
  <React.Fragment>
    <TodoGroup group={group1} />
    <TodoGroup group={group1} />
  </React.Fragment>
))
