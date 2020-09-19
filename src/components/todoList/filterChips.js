// @flow
import React from "react"
import { makeStyles } from "@material-ui/styles"

import Chip from "@material-ui/core/Chip"

import FilterModel from "../../shared/models/filter"
import FilterContext from "../utils/filterContext"

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
  const { filter, setFilter } = React.useContext(FilterContext)

  const removeFilterString = s => {
    filter.removeFilterString(s)
    setFilter(filter)
  }

  return filter
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
