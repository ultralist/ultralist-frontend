// @flow
import React from "react"

import Collapse from "@material-ui/core/Collapse"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import { withStyles } from "@material-ui/core/styles"

import DeleteForever from "@material-ui/icons/DeleteForever"

import TodoItemNoteModel from "../../../models/todoItemNote"

type Props = {
  note: string,
  onDeleteNote: string => void,
  classes: {
    notesAreaItem: string,
    noteText: string
  }
}

const styles = theme => ({
  notesAreaItem: {
    borderTop: "1px solid #ddd",
    listStyleType: "none",
    display: "flex",
    "&:first-child": {
      borderTop: "none"
    }
  },
  noteText: {
    display: "inline",
    flex: 1,
    paddingTop: 15
  }
})

const TodoItemNote = (props: Props) => {
  const onDelete = () => {
    // if (confirm("Are you sure you wish to delete this note?")) {
    //   props.onDeleteNote(props.note)
    // }
  }

  return (
    <li className={props.classes.notesAreaItem}>
      <Typography variant="body1" className={props.classes.noteText}>
        <span>{props.note}</span>
      </Typography>
      <IconButton onClick={onDelete} aria-label="Show notes">
        <DeleteForever />
      </IconButton>
    </li>
  )
}

export default withStyles(styles)(TodoItemNote)
