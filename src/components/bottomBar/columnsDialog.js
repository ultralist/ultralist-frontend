// @flow
import React from "react"

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Tooltip,
  Typography
} from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"

import arrayMove from "array-move"

import {
  DeleteOutlined as DeleteIcon,
  DragHandle as DragHandleIcon
} from "@material-ui/icons"

import FilterModel from "../../shared/models/filter"

import ModalStorage from "../../shared/storage/modalStorage"
import StorageContext from "../../shared/storageContext"

import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from "react-sortable-hoc"

type Props = {
  currentFilter: FilterModel,
  onChangeFilter: (f: FilterModel) => void
}

const useStyles = makeStyles({
  newColumnHolder: {
    display: "flex",
    alignItems: "flex-end"
  }
})

const ColumnsDialog = (props: Props) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [columns, setColumns] = React.useState(
    props.currentFilter.kanbanColumns
  )

  const [newColumnName, setNewColumnName] = React.useState("")

  const classes = useStyles()

  const modalStorage = new ModalStorage(React.useContext(StorageContext))
  modalStorage.setModalIsOpen(isOpen, "addTodo")

  const onToggleOpen = () => {
    setIsOpen(!isOpen)
  }

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newColumns = arrayMove(columns, oldIndex, newIndex)
    setColumns(newColumns)
    props.currentFilter.kanbanColumns = newColumns
    props.onChangeFilter(props.currentFilter)
  }

  const onDeleteColumn = name => {
    const newColumns = columns.filter(n => n !== name)
    setColumns(newColumns)
    props.currentFilter.kanbanColumns = newColumns
    props.onChangeFilter(props.currentFilter)
  }

  const onAddColumn = () => {
    columns.push(newColumnName)
    setColumns(columns)
    props.currentFilter.kanbanColumns = columns
    props.onChangeFilter(props.currentFilter)
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

  const nameRef = React.useRef()

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
      <Button onClick={onToggleOpen} color="inherit">
        Columns
      </Button>
      <Dialog fullWidth maxWidth="sm" onClose={onToggleOpen} open={isOpen}>
        <DialogTitle>Choose Kanban Columns</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Kanban columns are used with a todo's status.
          </DialogContentText>
          <SortableListContainer
            useDragHandle={true}
            onSortEnd={onSortEnd}
            items={columns}
          />

          <Typography>Add a new status column</Typography>
          <div className={classes.newColumnHolder}>
            <TextField
              value={newColumnName}
              onChange={onChangeNewColumnName}
              label="Name"
            />
            <Button onClick={onAddColumn}>Add</Button>
          </div>
        </DialogContent>

        <DialogActions>
          <Button color="primary" onClick={onToggleOpen}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default ColumnsDialog
