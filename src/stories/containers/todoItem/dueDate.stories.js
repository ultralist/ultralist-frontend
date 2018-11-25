import React from "react"
import { storiesOf } from "@storybook/react"
import { format, addDays } from "date-fns"
import CssBaseline from "@material-ui/core/CssBaseline"
import Typography from "@material-ui/core/Typography"

import DueDate from "../../../containers/todoItem/dueDate"

storiesOf("containers/todoItem/dueDate", module)
  .add("Standard", () => (
    <div>
      <Typography variant="body1">
        <CssBaseline />
        <p>Past:</p>
        <DueDate date={format(addDays(new Date(), -5), "YYYY-MM-DD")} />
        <hr />
        <p>Yesterday:</p>
        <DueDate date={format(addDays(new Date(), -1), "YYYY-MM-DD")} />
        <hr />
        <p>Today:</p>
        <DueDate date={format(new Date(), "YYYY-MM-DD")} />
        <hr />
        <p>Tomorrow:</p>
        <DueDate date={format(addDays(new Date(), 1), "YYYY-MM-DD")} />
        <hr />
        <p>Future:</p>
        <DueDate date={format(addDays(new Date(), 2), "YYYY-MM-DD")} />
      </Typography>
    </div>
  ))
