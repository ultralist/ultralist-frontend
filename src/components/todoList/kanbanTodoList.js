// @flow
import React from "react"

import { makeStyles } from "@material-ui/styles"

import { debounce } from "debounce"

import TodoGroup from "./todoGroup"
import TodoItemModel from "../../shared/models/todoItem"
import TodoListGroupModel from "../../shared/models/todoListGroup"

type Props = {
  groups: TodoListGroupModel[],
  onChangeTodo: (todoItem: TodoItemModel) => void,
  onShowAddTodoItemDialog?: (attrs: Object) => void,
  onDeleteTodo: (todoItem: TodoItemModel) => void,
  onSubjectClick: (subject: string) => void,
  onSetTodoItemStatus: (uuid: string, status: string) => void
}

const useStyles = makeStyles({
  kanbanOuter: {
    marginTop: 20,
    height: "calc(100vh - 384px)",
    width: "100%",
    overflowX: "auto"
  },
  kanbanHolder: {
    display: "flex",
    flexDirection: "row",
    minHeight: "calc(100vh - 384px)"
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
    <div className={classes.kanbanOuter}>
      <div ref={kanbanHolderRef} className={classes.kanbanHolder}>
        {props.groups.map((g, idx) => (
          <div key={idx} className={classes.kanbanColumn}>
            <TodoGroup
              key={g.uuid}
              onShowAddTodoItemDialog={props.onShowAddTodoItemDialog}
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
    </div>
  )
}

export default KanbanTodoList
