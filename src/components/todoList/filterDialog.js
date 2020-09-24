// @flow
import React, { useState } from "react"

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
  Tooltip
} from "@material-ui/core"

import {
  DeleteOutlined as DeleteIcon,
  DragHandle as DragHandleIcon
} from "@material-ui/icons"

import { makeStyles } from "@material-ui/styles"

import arrayMove from "array-move"
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from "react-sortable-hoc"

import FilterContext from "../utils/filterContext"

import StorageContext from "../../shared/storageContext"
import ModalStorage from "../../shared/storage/modalStorage"

const useStyles = makeStyles(theme => {
  return {
    searchBoxOuter: {
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      overflowY: "auto"
    },
    separator: {
      [theme.breakpoints.up("sm")]: {
        // borderLeft: "0.5px solid #ccc",
        // paddingLeft: 20
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
      // borderTop: "0.5px solid #ccc",
      width: "100%"
    },
    kanbanColumns: {
      marginTop: 45
      // maxHeight: 200,
      // overflowY: "auto"
    }
  }
})

type Props = {
  isOpen: boolean,
  onClose: () => void
}

const FilterDialog = (props: Props) => {
  const modalStorage = new ModalStorage(React.useContext(StorageContext))
  const classes = useStyles()
  const { filter, setFilter } = React.useContext(FilterContext)

  const [newColumnName, setNewColumnName] = React.useState("")

  modalStorage.setModalIsOpen(props.isOpen, "filterDialog")

  const update = () => {
    setFilter(filter)
  }

  const onChangeCompleted = () => {
    filter.toggleCompleted()
    update()
  }

  const onToggleUseCompleted = () => {
    filter.toggleUseCompleted()
    update()
  }

  const onChangeIsPriority = () => {
    filter.toggleIsPriority()
    update()
  }

  const onToggleUseIsPriority = () => {
    filter.toggleUseIsPriority()
    update()
  }

  const onChangeArchived = () => {
    filter.toggleArchived()
    update()
  }

  const onChangeDue = event => {
    filter.due = event.target.value
    if (event.target.value === "none") filter.due = null
    update()
  }

  const onChangeGroup = event => {
    filter.group = event.target.value
    event.target.value === "kanban"
      ? (filter.viewType = "kanban")
      : (filter.viewType = "list")
    if (event.target.value === "all") filter.group = null
    update()
  }

  const onToggleUseArchived = () => {
    filter.toggleUseArchived()
    update()
  }

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newColumns = arrayMove(filter.kanbanColumns(), oldIndex, newIndex)
    filter.setKanbanColumns(newColumns)
    update()
  }

  const onDeleteColumn = name => {
    const newColumns = filter.kanbanColumns().filter(n => n !== name)
    filter.setKanbanColumns(newColumns)
    update()
  }

  const onAddColumn = () => {
    const columns = filter.kanbanColumns()
    columns.push(newColumnName)
    filter.setKanbanColumns(columns)
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
    <Dialog fullWidth maxWidth="sm" onClose={props.onClose} open={props.isOpen}>
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
                      checked={filter.completed !== null}
                      onChange={onToggleUseCompleted}
                    />
                    <Switch
                      checked={filter.completed}
                      onChange={onChangeCompleted}
                    />
                  </React.Fragment>
                }
                label={filter.completed ? "Is completed" : "Not completed"}
              />

              <FormControlLabel
                control={
                  <React.Fragment>
                    <Checkbox
                      checked={filter.isPriority !== null}
                      onChange={onToggleUseIsPriority}
                    />
                    <Switch
                      checked={filter.isPriority}
                      onChange={onChangeIsPriority}
                    />
                  </React.Fragment>
                }
                label={filter.isPriority ? "Is priority" : "Not priority"}
              />

              <FormControlLabel
                control={
                  <React.Fragment>
                    <Checkbox
                      checked={filter.archived !== null}
                      onChange={onToggleUseArchived}
                    />
                    <Switch
                      checked={filter.archived}
                      onChange={onChangeArchived}
                    />
                  </React.Fragment>
                }
                label={filter.archived ? "Is archived" : "Not archived"}
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
              <Select value={filter.due || "none"} onChange={onChangeDue}>
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
              <Select value={filter.group || "all"} onChange={onChangeGroup}>
                <MenuItem value="all">No grouping</MenuItem>
                <MenuItem value="context">By context</MenuItem>
                <MenuItem value="project">By project</MenuItem>
                <MenuItem value="status">By status</MenuItem>
                <MenuItem value="kanban">Kanban status</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div
            className={classes.kanbanHolder}
            style={{
              display: filter.group === "kanban" ? "block" : "none"
            }}
          >
            <FormControl component="fieldset" className={classes.fieldset}>
              <InputLabel>Kanban status columns</InputLabel>
              <div className={classes.kanbanColumns}>
                <SortableListContainer
                  useDragHandle={true}
                  onSortEnd={onSortEnd}
                  items={filter.kanbanColumns()}
                />
              </div>
              <div className={classes.newColumnHolder}>
                <TextField
                  value={newColumnName}
                  onChange={onChangeNewColumnName}
                  helperText="Add a new status column"
                  label="Name"
                />
                <Button onClick={onAddColumn}>Add</Button>
              </div>
            </FormControl>
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={props.onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FilterDialog
