import React from "react"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import Typography from "@material-ui/core/Typography"

import TodoText from "../../../containers/todoItem/todoText"

storiesOf("containers/todoItem/todoText", module)
  .add("Standard", () => (
    <Typography variant="body1">
      <TodoText onClick={action("clicked")} val="+tasks chat with @bob" />
    </Typography>
  ))
