// @flow
import React from "react"

import { Grid, Switch } from "@material-ui/core"

type Props = {
  checked: boolean,
  onChange: () => void
}

const ViewSwitcher = (props: Props) => {
  return (
    <Grid component="label" container alignItems="center" spacing={0}>
      <Grid item>List</Grid>
      <Grid item>
        <Switch
          color="default"
          checked={props.checked}
          onChange={props.onChange}
        />
      </Grid>
      <Grid item>Kanban</Grid>
    </Grid>
  )
}

export default ViewSwitcher
