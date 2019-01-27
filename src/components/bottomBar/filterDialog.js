// @flow
import React, { useState } from "react"

import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import Switch from "@material-ui/core/Switch"
import Divider from "@material-ui/core/Divider"
import DialogTitle from "@material-ui/core/DialogTitle"
import TextField from "@material-ui/core/TextField"
import { makeStyles } from "@material-ui/styles"

import FilterModel, { LoadFromFilterString } from "../../models/filter"

type Props = {
  currentFilter: FilterModel,
  onChangeFilter: (f: FilterModel) => void
}

const filterStringRef = React.createRef()

const useStyles = makeStyles({
  searchBoxOuter: {
    margin: 20
  },
  searchBox: {
    width: "90%"
  }
})

const FilterDialog = (props: Props) => {
  const classes = useStyles()
  const [isOpen, setIsOpen] = useState(false)
  const [currentFilter, setCurrentFilter] = useState(props.currentFilter)

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  const changeFilterStringEvent = (ev: Event) => {
    ev.preventDefault()
    changeFilterString(filterStringRef.current.value)
  }

  const changeFilterString = (str: string) => {
    filterStringRef.current.value = str
    const filter = LoadFromFilterString(str)
    setCurrentFilter(filter)
    props.onChangeFilter(filter)
  }

  const update = () => {
    filterStringRef.current.value = currentFilter.toFilterString()
    setCurrentFilter(currentFilter)
    props.onChangeFilter(currentFilter)
  }

  const onChangeCompleted = () => {
    currentFilter.toggleCompleted()
    update()
  }

  const onToggleUseCompleted = () => {
    currentFilter.toggleUseCompleted()
    update()
  }

  const onChangeIsPriority = () => {
    currentFilter.toggleIsPriority()
    update()
  }

  const onToggleUseIsPriority = () => {
    currentFilter.toggleUseIsPriority()
    update()
  }

  const onChangeArchived = () => {
    currentFilter.toggleArchived()
    update()
  }

  const onToggleUseArchived = () => {
    currentFilter.toggleUseArchived()
    update()
  }

  return (
    <React.Fragment>
      <Button onClick={toggleOpen} color="inherit">
        Filter
      </Button>
      <Dialog onClose={toggleOpen} open={isOpen}>
        <DialogTitle>Filter your list</DialogTitle>
        <form
          className={classes.searchBoxOuter}
          onSubmit={changeFilterStringEvent}
        >
          <TextField
            id="outlined-search"
            label="Search"
            type="search"
            className={classes.searchBox}
            margin="dense"
            autoComplete="off"
            defaultValue={currentFilter.toFilterString()}
            inputRef={filterStringRef}
          />
        </form>
        <FormControlLabel
          control={
            <React.Fragment>
              <Checkbox
                checked={currentFilter.completed !== null}
                onChange={onToggleUseCompleted}
              />
              <Switch
                checked={currentFilter.completed === true}
                onChange={onChangeCompleted}
              />
            </React.Fragment>
          }
          label="Is Completed"
        />
        <FormControlLabel
          control={
            <React.Fragment>
              <Checkbox
                checked={currentFilter.isPriority !== null}
                onChange={onToggleUseIsPriority}
              />
              <Switch
                checked={currentFilter.isPriority === true}
                onChange={onChangeIsPriority}
              />
            </React.Fragment>
          }
          label="Is Priority"
        />
        <FormControlLabel
          control={
            <React.Fragment>
              <Checkbox
                checked={currentFilter.archived !== null}
                onChange={onToggleUseArchived}
              />
              <Switch
                checked={currentFilter.archived === true}
                onChange={onChangeArchived}
              />
            </React.Fragment>
          }
          label="Is Archived"
        />
      </Dialog>
    </React.Fragment>
  )
}

export default FilterDialog
