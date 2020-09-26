// @flow
import React from "react"

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
  Tooltip,
  Typography
} from "@material-ui/core"

import FilterContext from "../utils/filterContext"
import UserContext from "../utils/userContext"

import FilterChips from "./filterChips"
import FilterDialog from "./filterDialog"

import FilterModel from "../../shared/models/filter"

const UnsavedChangesSaveButton = () => (
  <Tooltip title="Save how the list is currently filtered.  You have unsaved changes to your filter.">
    <Button size="small">
      <Badge color="secondary" variant="dot">
        Save
      </Badge>
    </Button>
  </Tooltip>
)
const DisabledSaveButton = () => (
  <Button disabled size="small">
    Save
  </Button>
)

const View = () => {
  const { filter, setFilter } = React.useContext(FilterContext)
  const { user } = React.useContext(UserContext)
  const [showFilterDialog, setShowFilterDialog] = React.useState(false)
  const userFilter = new FilterModel(user.views.find(v => v.id === filter.id))
  const filterChanged = !userFilter.equals(filter)

  const onCloseFilterDialog = () => {
    setShowFilterDialog(false)
  }

  return (
    <Container maxWidth="md">
      <Card variant="outlined">
        <CardContent>
          <div>
            <Typography color="textSecondary" gutterBottom>
              Current view: {filter.name}
            </Typography>
          </div>

          <FilterChips onOpenFilterDialog={() => setShowFilterDialog(true)} />
        </CardContent>
        <CardActions>
          <Tooltip title="Load a saved view">
            <Button size="small">Load</Button>
          </Tooltip>
          {filterChanged ? (
            <UnsavedChangesSaveButton />
          ) : (
            <DisabledSaveButton />
          )}
        </CardActions>
      </Card>

      <FilterDialog isOpen={showFilterDialog} onClose={onCloseFilterDialog} />
    </Container>
  )
}

export default View
