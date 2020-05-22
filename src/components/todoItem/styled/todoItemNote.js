// @flow
import React from "react"

import { ListItem, IconButton, Typography } from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles"

import DeleteForever from "@material-ui/icons/DeleteForever"

type Props = {
  note: string,
  onDeleteNote: string => void,
  classes: {
    notesAreaItem: string,
    noteText: string
  }
}

const styles = theme => ({
  noteText: {
    fontSize: 14,
    display: "inline",
    flex: 1
  }
})

const TodoItemNote = (props: Props) => {
  const onDelete = () => {
    props.onDeleteNote(props.note)
  }

  return (
    <ListItem key={props.key}>
      <Typography variant="body1" className={props.classes.noteText}>
        <span>{props.note}</span>
      </Typography>
      <IconButton onClick={onDelete} aria-label="Show notes">
        <DeleteForever />
      </IconButton>
    </ListItem>
  )
}

export default withStyles(styles)(TodoItemNote)
