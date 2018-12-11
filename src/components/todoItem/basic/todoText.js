// @flow
import React from "react"

type Props = {
  val: string,
  strike: boolean,
  grey: boolean,
  bold: boolean,
  onClick: (str: string) => void,
  classes: {
    project: string,
    context: string,
    strike: string,
    grey: string,
    bold: string
  }
}

const isProject = word => {
  return word.startsWith("+")
}

const isContext = word => {
  return word.startsWith("@")
}

const TodoText = (props: Props) => {
  const words = props.val.split(" ")

  const parsedWords = words.map(word => {
    word = word + " "

    if (isContext(word)) {
      return (
        <a
          className={props.grey ? null : props.classes.context}
          onClick={() => props.onClick(word.trim())}
        >
          {word}
        </a>
      )
    } else if (isProject(word)) {
      return (
        <a
          className={props.grey ? null : props.classes.project}
          onClick={() => props.onClick(word.trim())}
        >
          {word}
        </a>
      )
    } else {
      return word
    }
  })

  const classNames = []
  if (props.strike) classNames.push(props.classes.strike)
  if (props.grey) classNames.push(props.classes.grey)
  if (props.bold) classNames.push(props.classes.bold)

  return <span className={classNames.join(" ")}>{parsedWords}</span>
}

export default TodoText
