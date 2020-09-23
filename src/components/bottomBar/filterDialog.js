// @flow
import React, { useState, useEffect } from "react"

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormControl,
  FormGroup,
  FormHelperText,
  InputLabel,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Select,
  MenuItem,
  Checkbox,
  Switch,
  TextField,
  Tooltip,
  Typography
} from "@material-ui/core"

import {
  DeleteOutlined as DeleteIcon,
  DragHandle as DragHandleIcon
} from "@material-ui/icons"

import { makeStyles } from "@material-ui/styles"

import { debounce } from "debounce"

import arrayMove from "array-move"
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from "react-sortable-hoc"

import FilterModel from "../../shared/models/filter"
//import FilterChips from "../todoList/filterChips"

import StorageContext from "../../shared/storageContext"
import ModalStorage from "../../shared/storage/modalStorage"

type Props = {
  currentFilter: FilterModel,
  onChangeFilter: (f: FilterModel) => void
}

const useStyles = makeStyles(theme => {
  return {
    searchBoxOuter: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      overflowY: "auto"
    },
    separator: {
      [theme.breakpoints.up("sm")]: {
        borderLeft: "0.5px solid #ccc",
        paddingLeft: 20
      }
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
    },
    fieldset: {
      display: "block",
      marginRight: 20,
      marginTop: 20,
      marginBottom: 20
    },
    kanbanHolder: {
      borderTop: "0.5px solid #ccc"
    },
    kanbanColumns: {
      marginTop: 45,
      maxHeight: 200,
      overflowY: "auto"
    }
  }
})

const FilterDialog = (props: Props) => {
  const modalStorage = new ModalStorage(React.useContext(StorageContext))
  const classes = useStyles()
  const [isOpen, setIsOpen] = useState(false)
  const debouncedOnChangeFilter = React.useRef(
    debounce(props.onChangeFilter, 250)
  )

  const [currentFilterAttrs, setCurrentFilter] = useState(
    props.currentFilter.toJSON()
  )
  const [newColumnName, setNewColumnName] = React.useState("")

  useEffect(() => {
    setCurrentFilter(props.currentFilter.toJSON())
  }, [props.currentFilter])

  const currentFilter = new FilterModel(currentFilterAttrs)

  modalStorage.setModalIsOpen(isOpen, "filterDialog")

  const toggleOpen = () => {
    setIsOpen(!isOpen)
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

  const onChangeGroup = event => {
    currentFilter.group = event.target.value
    if (event.target.value === "all") currentFilter.group = null
    update()
  }

  const onToggleUseArchived = () => {
    currentFilter.toggleUseArchived()
    update()
  }

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newColumns = arrayMove(
      currentFilter.kanbanColumns(),
      oldIndex,
      newIndex
    )
    currentFilter.setKanbanColumns(newColumns)
    update()
  }

  const onDeleteColumn = name => {
    const newColumns = currentFilter.kanbanColumns().filter(n => n !== name)
    currentFilter.setKanbanColumns(newColumns)
    update()
  }

  const onAddColumn = () => {
    const columns = currentFilter.kanbanColumns()
    columns.push(newColumnName)
    currentFilter.setKanbanColumns(columns)
    update()
    setNewColumnName("")
  }

  const onChangeNewColumnName = ev => {
    setNewColumnName(ev.target.value)
  }

  const DragHandle = SortableHandle(() => (
    <ListItemIcon>
      <DragHandleIcon />
    </ListItemIcon>
  ))

  const SortableItem = SortableElement(({ text }) => (
    <ListItem style={{ zIndex: 1400 }}>
      <ListItemIcon style={{ cursor: "pointer" }}>
        <DragHandle />
      </ListItemIcon>
      <ListItemText primary={text} />
      <Tooltip title="Delete this column">
        <IconButton onClick={() => onDeleteColumn(text)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </ListItem>
  ))

  const SortableListContainer = SortableContainer(({ items }) => (
    <List component="div">
      {items.map((name, idx) => (
        <SortableItem key={name} index={idx} text={name} />
      ))}
    </List>
  ))

  return (
    <React.Fragment>
      <Button onClick={toggleOpen} color="inherit">
        Filter
      </Button>
      <Dialog fullWidth maxWidth="lg" onClose={toggleOpen} open={isOpen}>
        <DialogTitle>Manage view</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            Filter your tasks and customize how you see your list.
          </DialogContentText>
          <div className={classes.searchBoxOuter}>
            <FormControl component="fieldset" className={classes.fieldset}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <React.Fragment>
                      <Checkbox
                        checked={currentFilter.completed !== null}
                        onChange={onToggleUseCompleted}
                      />
                      <Switch
                        checked={currentFilter.completed}
                        onChange={onChangeCompleted}
                      />
                    </React.Fragment>
                  }
                  label={
                    currentFilter.completed ? "Is completed" : "Not completed"
                  }
                />

                <FormControlLabel
                  control={
                    <React.Fragment>
                      <Checkbox
                        checked={currentFilter.isPriority !== null}
                        onChange={onToggleUseIsPriority}
                      />
                      <Switch
                        checked={currentFilter.isPriority}
                        onChange={onChangeIsPriority}
                      />
                    </React.Fragment>
                  }
                  label={
                    currentFilter.isPriority ? "Is priority" : "Not priority"
                  }
                />

                <FormControlLabel
                  control={
                    <React.Fragment>
                      <Checkbox
                        checked={currentFilter.archived !== null}
                        onChange={onToggleUseArchived}
                      />
                      <Switch
                        checked={currentFilter.archived}
                        onChange={onChangeArchived}
                      />
                    </React.Fragment>
                  }
                  label={
                    currentFilter.archived ? "Is archived" : "Not archived"
                  }
                />
              </FormGroup>
              <FormHelperText>
                Check the box to filter on a particular criteria. The slider
                designates true or false.
              </FormHelperText>
            </FormControl>

            <div className={classes.separator}>
              <FormControl component="fieldset" className={classes.fieldset}>
                <InputLabel>Due</InputLabel>
                <Select
                  value={currentFilter.due || "none"}
                  onChange={onChangeDue}
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
              </FormControl>

              <FormControl component="fieldset" className={classes.fieldset}>
                <InputLabel>Group</InputLabel>
                <Select
                  value={currentFilter.group || "all"}
                  onChange={onChangeGroup}
                >
                  <MenuItem value="all">No grouping</MenuItem>
                  <MenuItem value="context">By context</MenuItem>
                  <MenuItem value="project">By project</MenuItem>
                  <MenuItem value="status">By status</MenuItem>
                  <MenuItem value="kanban">Kanban</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div
              className={classes.kanbanHolder}
              style={{
                display: currentFilter.group === "kanban" ? "block" : "none"
              }}
            >
              <FormControl component="fieldset" className={classes.fieldset}>
                <InputLabel>Kanban columns</InputLabel>
                <div className={classes.kanbanColumns}>
                  <SortableListContainer
                    useDragHandle={true}
                    onSortEnd={onSortEnd}
                    items={currentFilter.kanbanColumns()}
                  />
                </div>
                <div className={classes.newColumnHolder}>
                  <Typography>Add a new status column</Typography>
                  <TextField
                    value={newColumnName}
                    onChange={onChangeNewColumnName}
                    label="Name"
                  />
                  <Button onClick={onAddColumn}>Add</Button>
                </div>
              </FormControl>
            </div>
          </div>
        </DialogContent>

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
