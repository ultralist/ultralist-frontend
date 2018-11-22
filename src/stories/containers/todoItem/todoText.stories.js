
import React from "react"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import TodoText from "../../../containers/todoItem/todoText"

storiesOf("containers/todoItem/todoText", module)
  .add("Standard", () => (
    <TodoText onClick={action("clicked")} val="+tasks work with @bob" />
  ))
