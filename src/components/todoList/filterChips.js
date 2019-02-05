// @flow
import React from "react"
import { makeStyles } from "@material-ui/styles"

import Chip from "@material-ui/core/Chip"

import FilterModel from "../../models/filter"

type Props = {
  currentFilter: FilterModel,
  onChangeFilter: (f: FilterModel) => void
}

const useStyles = makeStyles({
  chip: {
    margin: 3
  }
})

const FilterChips = (props: Props) => {
  const classes = useStyles()

  const removeFilterString = s => {
    props.currentFilter.removeFilterString(s)
    props.onChangeFilter(props.currentFilter)
  }

  return props.currentFilter
    .toFilterStrings()
    .map(s => (
      <Chip
        className={classes.chip}
        key={s}
        label={s}
        onDelete={() => removeFilterString(s)}
      />
    ))
}

export default FilterChips
