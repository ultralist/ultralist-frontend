// @flow
import React from "react"
import { format, isPast, isToday, isTomorrow, isYesterday } from "date-fns"

type Props = {
  date: string | null,
  classes: {
    past: string,
    today: string,
    tomorrow: string,
    future: string
  }
}

const DueDate = (props: Props) => {
  if (props.date === null) return null

  const formattedDate = format(props.date, "MMM Do")

  if (isYesterday(props.date)) {
    return <span className={props.classes.past}>Yesterday</span>
  }

  if (isToday(props.date)) {
    return <span className={props.classes.today}>Today</span>
  }

  if (isPast(props.date)) {
    return <span className={props.classes.past}>{formattedDate}</span>
  }

  if (isTomorrow(props.date)) {
    return <span className={props.classes.tomorrow}>Tomorrow</span>
  }

  return <span className={props.classes.future}>{formattedDate}</span>
}

export default DueDate
