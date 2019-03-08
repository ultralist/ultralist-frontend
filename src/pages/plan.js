// @flow
import React from "react"

import TopBar from "../components/topBar"
import UserIcon from "../components/userIcon"

import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"

const Plan = () => {
  return (
    <React.Fragment>
      <TopBar>
        <UserIcon />
      </TopBar>

      <Paper>
        <Typography variant="h2">Plan</Typography>
      </Paper>
    </React.Fragment>
  )
}

export default Plan
