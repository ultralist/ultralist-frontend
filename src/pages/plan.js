// @flow
import React from "react"

import TopBar from "../components/topBar"
import UserIcon from "../components/userIcon"

import Typography from "@material-ui/core/Typography"
import Card from "@material-ui/core/Card"
import Container from "@material-ui/core/Container"

const Plan = () => {
  return (
    <React.Fragment>
      <TopBar>
        <UserIcon />
      </TopBar>

      <Container>
        <Typography variant="h2">Plan</Typography>
        <Typography variant="body1">Ultralist includes a 30-day free trial.</Typography>
        <Typography variant="body1">Refer a friend and get free months!</Typography>
        <Typography variant="h4">What's included?</Typography>

        <Card>
          <Typography variant="h4">Ultralist Premium</Typography>
        </Card>
      </Container>
    </React.Fragment>
  )
}

export default Plan
