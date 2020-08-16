// @flow
import React from "react"

import { makeStyles } from "@material-ui/styles"

import { debounce } from "debounce"

import TodoGroup from "./todoGroup"
import TodoItemModel from "../../shared/models/todoItem"

type Props = {
  todos: TodoItemModel[],
  onChangeTodo: (todoItem: TodoItemModel) => void,
  onDeleteTodo: (todoItem: TodoItemModel) => void,
  onSubjectClick: (subject: string) => void,
  onSetTodoItemStatus: (uuid: string, status: string) => void
}

const useStyles = makeStyles({
  kanbanHolder: {
    display: "flex",
    overflowX: "auto",
    flexDirection: "row",
    height: "calc(100vh - 272px)"
  },
  kanbanColumn: {
    width: 400,
    minWidth: 400,
    marginLeft: 10,
    marginRight: 10
  }
})

const KanbanTodoList = (props: Props) => {
  const classes = useStyles()

  const kanbanHolderRef = React.useRef()
  const [scrollX, setScrollX] = React.useState(0)
  const [scrollY, setScrollY] = React.useState(0)

  const onScroll = () => {
    setScrollX(kanbanHolderRef.current.scrollLeft)
    setScrollY(kanbanHolderRef.current.scrollTop)
  }
  const debouncedOnScroll = React.useRef(debounce(onScroll, 250))

  React.useEffect(() => {
    kanbanHolderRef.current.scrollLeft = scrollX
    kanbanHolderRef.current.scrollTop = scrollY
    kanbanHolderRef.current.addEventListener(
      "scroll",
      debouncedOnScroll.current
    )
    return () => {
      kanbanHolderRef.current.removeEventListener(
        "scroll",
        debouncedOnScroll.current
      )
    }
  })

  return (
    <div ref={kanbanHolderRef} className={classes.kanbanHolder}>
      {props.groups.map((g, idx) => (
        <div key={idx} className={classes.kanbanColumn}>
          <TodoGroup
            key={g.uuid}
            selectedTodoUUID={null}
            onChange={props.onChangeTodo}
            onDelete={props.onDeleteTodo}
            onSubjectClick={props.onSubjectClick}
            onSetTodoItemStatus={props.onSetTodoItemStatus}
            group={g}
            kanbanView={true}
          />
        </div>
      ))}
    </div>
  )
}

export default KanbanTodoList
