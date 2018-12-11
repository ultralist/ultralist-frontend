// @flow
import React from "react"
import { format, isPast, isToday, isTomorrow, isYesterday } from "date-fns"

type Props = {
  date: string | null,
  grey: boolean,
  classes: {
    past: string,
    today: string,
    tomorrow: string,
    future: string,
    grey: string
  }
}

const DueDate = (props: Props) => {
  if (props.date === null) return null

  const formattedDate = format(props.date, "MMM Do")
  const grey = props.classes.grey

  if (isYesterday(props.date)) {
    return <span className={props.grey ? grey : props.classes.past}>Yesterday</span>
  }

  if (isToday(props.date)) {
    return <span className={props.grey ? grey : props.classes.today}>Today</span>
  }

  if (isPast(props.date)) {
    return <span className={props.grey ? grey : props.classes.past}>{formattedDate}</span>
  }

  if (isTomorrow(props.date)) {
    return <span className={props.grey ? grey : props.classes.tomorrow}>Tomorrow</span>
  }

  return <span className={props.grey ? grey : props.classes.future}>{formattedDate}</span>
}

export default DueDate
