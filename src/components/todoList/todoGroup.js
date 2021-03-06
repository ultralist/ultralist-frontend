// @flow
import React from "react"
import { IconButton, Tooltip } from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"

import { useDrop } from "react-dnd"

import List from "@material-ui/core/List"
import ListSubheader from "@material-ui/core/ListSubheader"

import TodoItemModel from "../../shared/models/todoItem"
import TodoListGroup from "../../shared/models/todoListGroup"

import TodoItem from "../todoItem/styled/todoItem"
import { makeStyles } from "@material-ui/styles"

type Props = {
  group: TodoListGroup,
  selectedTodoUUID?: string,
  kanbanView: boolean,
  onChange: (todoItem: TodoItemModel) => void,
  onDelete: (todoItem: TodoItemModel) => void,
  onSubjectClick: (str: string) => void,
  onShowAddTodoItemDialog?: (attrs: Object) => void,
  onSetTodoItemStatus: (uuid: string, status: string) => void
}

const useStyles = makeStyles({
  cursor: {
    cursor: "pointer"
  },
  list: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  subheader: {
    position: "static",
    flexGrow: 0,
    paddingLeft: 0
  },
  kanbanSubheader: {
    textAlign: "center",
    flexGrow: 0
  },
  dropBorder: {
    border: "2px dashed #ccc",
    minHeight: 150,
    flexGrow: 1,
    borderRadius: 5
  },
  normalBorder: {
    minHeight: 150,
    flexGrow: 1,
    border: "2px solid transparent"
  },
  addTask: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
})

const TodoGroup = (props: Props) => {
  const classes = useStyles()
  const todos = props.group.sortedTodos()

  const onShowAdd = () => {
    props.onShowAddTodoItemDialog({ status: props.group.name })
  }

  const handleDrop = item => {
    if (props.group.name === "none") {
      props.onSetTodoItemStatus(item.uuid, null)
    } else {
      props.onSetTodoItemStatus(item.uuid, props.group.name)
    }
  }

  const [{ isOver }, drop] = useDrop({
    accept: "todo_item",
    drop: handleDrop,
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  })

  return (
    <div style={{ height: "100%" }} ref={drop}>
      <List
        className={classes.list}
        subheader={
          <ListSubheader
            className={
              props.kanbanView ? classes.kanbanSubheader : classes.subheader
            }
            component="div"
          >
            {props.group.name}
          </ListSubheader>
        }
      >
        <div className={isOver ? classes.dropBorder : classes.normalBorder}>
          {todos.map((todo, idx) => (
            <div key={idx} className={classes.cursor}>
              <TodoItem
                isFirst={todo.uuid == todos[0].uuid}
                isSelected={todo.uuid === props.selectedTodoUUID}
                onChange={props.onChange}
                onDelete={props.onDelete}
                onSubjectClick={props.onSubjectClick}
                todoItem={todo}
                kanbanView={props.kanbanView}
              />
            </div>
          ))}
          <div className={classes.addTask}>
            {props.kanbanView && (
              <Tooltip title="Add a task to this column">
                <IconButton onClick={onShowAdd}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </div>
      </List>
    </div>
  )
}

export default TodoGroup
