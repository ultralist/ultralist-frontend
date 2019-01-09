// @flow
import React from "react"
import { format, isSameDay, addDays, toDate, isBefore } from "date-fns"

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

const isYesterday = (date: Date): boolean => {
  return isSameDay(date, addDays(new Date(), -1))
}

const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date())
}

const isTomorrow = (date: Date): boolean => {
  return isSameDay(date, addDays(new Date(), 1))
}

const DueDate = (props: Props) => {
  if (props.date === null) return null

  const formattedDate = format(props.date, "MMM do")
  const realDate = toDate(props.date)
  const grey = props.classes.grey

  if (isYesterday(realDate)) {
    return (
      <span className={props.grey ? grey : props.classes.past}>Yesterday</span>
    )
  }

  if (isToday(realDate)) {
    return (
      <span className={props.grey ? grey : props.classes.today}>Today</span>
    )
  }

  if (isBefore(realDate, new Date())) {
    return (
      <span className={props.grey ? grey : props.classes.past}>
        {formattedDate}
      </span>
    )
  }

  if (isTomorrow(realDate)) {
    return (
      <span className={props.grey ? grey : props.classes.tomorrow}>
        Tomorrow
      </span>
    )
  }

  return (
    <span className={props.grey ? grey : props.classes.future}>
      {formattedDate}
    </span>
  )
}

export default DueDate
