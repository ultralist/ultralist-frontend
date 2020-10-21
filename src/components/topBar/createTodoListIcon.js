// @flow
import React from "react"

import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import AddIcon from "@material-ui/icons/Add"
import { makeStyles } from "@material-ui/styles"

import CreateTodoList from "./createTodoList"

import ModalStorage from "../../shared/storage/modalStorage"
import StorageContext from "../../shared/storageContext"
import TodoListModel from "../../shared/models/todoList"

const useStyles = makeStyles(() => {
  return {
    icon: {
      color: "#fff !important" // TODO: make this use theme
    }
  }
})

const CreateTodoListIcon = (props: Props) => {
  const classes = useStyles()
  const [isOpen, setIsOpen] = React.useState(false)

  const modalStorage = new ModalStorage(React.useContext(StorageContext))

  const onOpenModal = () => {
    setIsOpen(true)
    modalStorage.setModalIsOpen(true, "createTodoList")
  }

  const onCloseModal = () => {
    setIsOpen(false)
    modalStorage.setModalIsOpen(false, "createTodoList")
  }

  const onCreateTodoList = (tl: TodoListModel) => {
    setIsOpen(false)
    props.onCreateTodoList(tl)
  }

  return (
    <React.Fragment>
      <Tooltip disableFocusListener={true} title="Create new todolist">
        <IconButton className={classes.icon} onClick={onOpenModal}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <CreateTodoList
        isOpen={isOpen}
        onClose={onCloseModal}
        onCreateTodoList={onCreateTodoList}
      />
    </React.Fragment>
  )
}

export default CreateTodoListIcon
