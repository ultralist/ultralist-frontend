// @flow
import React from "react"
import { isToday } from "date-fns"
import IconButton from "@material-ui/core/IconButton"
import TodayIcon from "@material-ui/icons/Today"

type Props = {
  due: string | null,
  onClick: () => void
}

const DueTodayButton = (props: Props) => {
  if (isToday(props.due)) return null

  return (
    <IconButton onClick={props.onClick} aria-label="Due Today">
      <TodayIcon />
    </IconButton>
  )
}

export default DueTodayButton
