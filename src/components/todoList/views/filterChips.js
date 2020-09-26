// @flow
import React from "react"
import { makeStyles } from "@material-ui/styles"

import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import AddIcon from "@material-ui/icons/Add"

import Chip from "@material-ui/core/Chip"

import FilterContext from "../../utils/filterContext"

type Props = {
  onOpenFilterDialog: () => void
}

const useStyles = makeStyles({
  chip: {
    margin: 3
  }
})

const AddNew = () => {
  return (
    <Tooltip title="Add a filter">
      <IconButton>
        <AddIcon />
      </IconButton>
    </Tooltip>
  )
}

const FilterChips = (props: Props) => {
  const classes = useStyles()
  const { filter, setFilter } = React.useContext(FilterContext)

  const removeFilterString = s => {
    filter.removeFilterString(s)
    setFilter(filter)
  }

  const filters = filter
    .toFilterStrings()
    .map(s => (
      <Chip
        className={classes.chip}
        key={s}
        label={s}
        onDelete={() => removeFilterString(s)}
      />
    ))
  return (
    <React.Fragment>
      {filters}
      <Chip
        className={classes.chip}
        clickable
        onClick={props.onOpenFilterDialog}
        icon={<AddIcon />}
        label="Add filter"
      />
    </React.Fragment>
  )
}

export default FilterChips
