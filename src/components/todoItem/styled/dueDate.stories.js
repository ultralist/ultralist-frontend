import React from "react"
import { storiesOf } from "@storybook/react"
import { format, addDays } from "date-fns"
import CssBaseline from "@material-ui/core/CssBaseline"
import Typography from "@material-ui/core/Typography"

import DueDate from "./dueDate"

storiesOf("components/todoItem/dueDate", module)
  .add("Standard", () => (
    <div>
      <Typography variant="body1">
        <CssBaseline />
        <p>Past:</p>
        <DueDate date={format(addDays(new Date(), -5), "yyyy-MM-dd")} />
        <hr />
        <p>Yesterday:</p>
        <DueDate date={format(addDays(new Date(), -1), "yyyy-MM-dd")} />
        <hr />
        <p>Today:</p>
        <DueDate date={format(new Date(), "yyyy-MM-dd")} />
        <hr />
        <p>Tomorrow:</p>
        <DueDate date={format(addDays(new Date(), 1), "yyyy-MM-dd")} />
        <hr />
        <p>Future:</p>
        <DueDate date={format(addDays(new Date(), 2), "yyyy-MM-dd")} />
      </Typography>
    </div>
  ))
