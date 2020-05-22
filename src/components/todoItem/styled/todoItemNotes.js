// @flow
import React from "react"
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  TextField
} from "@material-ui/core"

import { makeStyles } from "@material-ui/styles"

import TodoItemNote from "./todoItemNote"

import TodoItemModel from "../../../shared/models/todoItem"
import StorageContext from "../../../shared/storageContext"
import ModalStorage from "../../../shared/storage/modalStorage"

type Props = {
  show: boolean,
  onClose: () => void,
  todoItem: TodoItemModel,
  onChange: (todoItem: TodoItemModel) => void
}

const useStyles = makeStyles({
  addNoteArea: {
    display: "flex"
  },
  addNoteText: {
    flexGrow: 1
  }
})

const TodoItemNotes = (props: Props) => {
  const classes = useStyles()
  const modalStorage = new ModalStorage(React.useContext(StorageContext))
  const [noteText, setNoteText] = React.useState("")
  const [_, setTodoItemAttrs] = React.useState(props.todoItem.toJSON())

  modalStorage.setModalIsOpen(props.show, "todoItemNotes")

  const onChangeNoteText = event => {
    setNoteText(event.target.value)
  }

  const onAddNote = () => {
    props.todoItem.notes.push(noteText)
    setTodoItemAttrs(props.todoItem.toJSON())
    setNoteText("")
  }

  const onDeleteNote = note => {
    props.todoItem.deleteNote(note)
    setTodoItemAttrs(props.todoItem.toJSON())
  }

  const onSave = () => {
    props.onChange(props.todoItem)
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={props.show} onClose={props.onClose}>
      <DialogTitle>Notes</DialogTitle>
      <DialogContent>
        <List>
          {props.todoItem.notes.map((n, idx) => (
            <TodoItemNote key={idx} note={n} onDeleteNote={onDeleteNote} />
          ))}
        </List>
        <div className={classes.addNoteArea}>
          <TextField
            className={classes.addNoteText}
            value={noteText}
            onChange={onChangeNoteText}
          />
          <Button color="primary" onClick={onAddNote}>
            Add note
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TodoItemNotes
