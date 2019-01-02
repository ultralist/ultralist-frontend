import React from "react"
import { format, addDays } from "date-fns"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import { ALL, BY_CONTEXT, BY_PROJECT } from "../../constants"
import { todos } from "../../test/test_helper"

import utils from "../../utils"
import TodoGroup from "./todoGroup"
import group from "./logic/grouper"

import TodoItemModel from "../../models/todoItem"
import TodoListGroup from "../../models/todoListGroup"

const groups = group(todos, BY_CONTEXT)

storiesOf("components/todoGroup", module).add("Standard", () => (
  <React.Fragment>
    {groups.map(g => (
      <TodoGroup
        group={g}
        onSubjectClick={t => action(t)}
        onChange={t => action(t)}
      />
    ))}
  </React.Fragment>
))
