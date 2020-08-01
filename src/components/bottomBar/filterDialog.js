// @flow
import React, { useState, useEffect } from "react"

import {
  Button,
  Dialog,
  DialogActions,
  Divider,
  FormControlLabel,
  Grid,
  Input,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Switch,
  DialogTitle,
  TextField,
  Typography
} from "@material-ui/core"

import { makeStyles } from "@material-ui/styles"

import { debounce } from "debounce"

import FilterModel from "../../shared/models/filter"
import FilterChips from "../todoList/filterChips"

import StorageContext from "../../shared/storageContext"
import ModalStorage from "../../shared/storage/modalStorage"
import UserStorage from "../../shared/storage/userStorage"

import ViewSwitcher from "./views/viewSwitcher"

type Props = {
  currentFilter: FilterModel,
  onChangeFilter: (f: FilterModel) => void
}

const useStyles = makeStyles({
  searchBoxOuter: {
    marginLeft: 20,
    marginRight: 20
  },
  searchBox: {
    width: "50%",
    display: "block"
  },
  filterChips: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 20
  },
  dueLabel: {
    margin: 15
  },
  saveView: {
    display: "flex",
    flexDirection: "row"
  }
})

const FilterDialog = (props: Props) => {
  const modalStorage = new ModalStorage(React.useContext(StorageContext))
  const classes = useStyles()
  const [isOpen, setIsOpen] = useState(false)
  const debouncedOnChangeFilter = React.useRef(
    debounce(props.onChangeFilter, 250)
  )

  const userStorage = new UserStorage(React.useContext(StorageContext))
  const user = userStorage.loadUser()

  const [currentFilterAttrs, setCurrentFilter] = useState(
    props.currentFilter.toJSON()
  )

  useEffect(() => {
    setCurrentFilter(props.currentFilter.toJSON())
  }, [props.currentFilter])

  const currentFilter = new FilterModel(currentFilterAttrs)

  modalStorage.setModalIsOpen(isOpen, "filterDialog")

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  const changeSearchStringEvent = (ev: Event) => {
    ev.preventDefault()
    currentFilter.subjectContains = ev.target.value
    update()
  }

  const update = () => {
    setCurrentFilter(currentFilter.toJSON())
    debouncedOnChangeFilter.current(currentFilter)
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

  const onChangeDue = event => {
    currentFilter.due = event.target.value
    if (event.target.value === "none") currentFilter.due = null
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
      <Dialog fullWidth maxWidth="md" onClose={toggleOpen} open={isOpen}>
        <div className={classes.searchBoxOuter}>
          <Typography variant="h6">Filter your list</Typography>

          <div className={classes.filterChips}>
            <FilterChips
              currentFilter={currentFilter}
              onChangeFilter={update}
            />
          </div>

          <TextField
            id="outlined-search"
            label="Subject"
            type="search"
            className={classes.searchBox}
            margin="dense"
            autoComplete="off"
            value={currentFilter.subjectContains || ""}
            onChange={changeSearchStringEvent}
          />

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
          <br />
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
          <br />
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
          <br />
          <FormControlLabel
            control={
              <React.Fragment>
                <InputLabel className={classes.dueLabel} htmlFor="due">
                  Due
                </InputLabel>
                <Select
                  value={currentFilter.due || "none"}
                  onChange={onChangeDue}
                  input={<Input name="due" id="due" />}
                >
                  <MenuItem value="none">No due filter</MenuItem>
                  <MenuItem value="nodue">No date set</MenuItem>
                  <Divider />
                  <MenuItem value="agenda">Agenda</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                  <Divider />
                  <MenuItem value="today">today</MenuItem>
                  <MenuItem value="tomorrow">tomorrow</MenuItem>
                  <Divider />
                  <MenuItem value="mon">Monday</MenuItem>
                  <MenuItem value="tue">Tuesday</MenuItem>
                  <MenuItem value="wed">Wednesday</MenuItem>
                  <MenuItem value="thu">Thursday</MenuItem>
                  <MenuItem value="fri">Friday</MenuItem>
                  <MenuItem value="sat">Saturday</MenuItem>
                  <MenuItem value="sun">Sunday</MenuItem>
                </Select>
              </React.Fragment>
            }
          />
        </div>

        <DialogActions>
          <Button color="primary" onClick={toggleOpen}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default FilterDialog
