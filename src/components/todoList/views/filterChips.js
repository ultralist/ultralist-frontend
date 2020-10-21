// @flow
import React from "react"
import { makeStyles } from "@material-ui/styles"
import AddIcon from "@material-ui/icons/Add"
import Chip from "@material-ui/core/Chip"

import TodoListContext from "../../utils/todoListContext"

type Props = {
  onOpenFilterDialog: () => void
}

const useStyles = makeStyles({
  chip: {
    margin: 3
  }
})

const FilterChips = (props: Props) => {
  const classes = useStyles()
  const { view, setView } = React.useContext(TodoListContext)

  const removeFilterString = s => {
    view.removeFilterString(s)
    setView(view)
  }

  const filters = view
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
