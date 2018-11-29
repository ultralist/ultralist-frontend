// @flow
import React from "react"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import Typography from "@material-ui/core/Typography"
import { format, addDays } from "date-fns"

import TodoItemModel from "../../../models/todoItem"
import TodoItem from "./todoItem"
import utils from "../../../utils"

const todoModel = new TodoItemModel({
  id: 1,
  uuid: utils.generateUuid(),
  completed: false,
  archived: false,
  isPriority: false,
  completedDate: null,
  subject: "+tasks chat with @bob",
  due: format(new Date(), "YYYY-MM-DD"),
  notes: ["here is note 1", "here is note 2"]
})

const todoModelYesterday = new TodoItemModel({
  id: 1,
  uuid: utils.generateUuid(),
  completed: false,
  archived: false,
  isPriority: false,
  completedDate: null,
  subject: "+tasks chat with @bob",
  due: format(addDays(new Date(), -1), "YYYY-MM-DD"),
  notes: ["here is note 1", "here is note 2"]
})

storiesOf("containers/todoItem/todoItem", module)
  .add("Standard", () => (
    <Typography variant="body1">
      <TodoItem
        todoItem={todoModel}
        onChange={ action(todoModel) }
        onSubjectClick={(val) => console.log(val) }
      />
      <hr />
      <TodoItem
        todoItem={todoModelYesterday}
        onChange={ action(todoModel) }
        onSubjectClick={(val) => console.log(val) }
      />
    </Typography>
  ))

