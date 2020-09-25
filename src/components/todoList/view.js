// @flow
import React from "react"

import {
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
  Typography
} from "@material-ui/core"

import FilterContext from "../utils/filterContext"

import FilterChips from "./filterChips"
import FilterDialog from "./filterDialog"

const View = () => {
  const { filter, setFilter } = React.useContext(FilterContext)
  const [showFilterDialog, setShowFilterDialog] = React.useState(false)

  const onCloseFilterDialog = () => {
    setShowFilterDialog(false)
  }

  return (
    <Container maxWidth="md">
      <Card variant="outlined">
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Current view: {filter.name}
          </Typography>
          <FilterChips onOpenFilterDialog={() => setShowFilterDialog(true)} />
        </CardContent>
        <CardActions>
          <Button size="small">Load</Button>
          <Button size="small">Save</Button>
        </CardActions>
      </Card>

      <FilterDialog isOpen={showFilterDialog} onClose={onCloseFilterDialog} />
    </Container>
  )
}

export default View
