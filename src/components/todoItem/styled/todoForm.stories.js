// @flow
import React, { useState } from "react"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"
import Dialog from "@material-ui/core/Dialog"

import TodoForm from "./todoForm"
import TodoItemModel from "../../../models/todoItem"

import { todos } from "../../../test/test_helper"

const onChange = (todoItem: TodoItemModel) => {
  console.log("onChange",todoItem)
  console.log("existing",todos[0])
}

const ModalHolder = () => {
  const [modalOpen, setModalOpen] = useState(false)

  const toggleModalOpen = () => {
    setModalOpen(!modalOpen)
  }

  return (
    <React.Fragment>
      <Fab onClick={toggleModalOpen} color="primary">
        <AddIcon />
      </Fab>
      <Dialog fullWidth maxWidth="md" open={modalOpen} onClose={toggleModalOpen}>
        <TodoForm title="Edit todo" todoItem={todos[0]} onChange={toggleModalOpen} />
      </Dialog>
    </React.Fragment>
  )
}

storiesOf("components/todoItem/todoForm", module)
  .add("Existing todo", () => (
    <TodoForm todoItem={todos[0]} onChange={onChange} />
  ))
  .add("Modal", () => (
    <ModalHolder />
  ))
