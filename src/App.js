// @flow
import React from "react"
import CssBaseline from "@material-ui/core/CssBaseline"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"

import MenuIcon from "@material-ui/icons/Menu"
import ExpandMore from "@material-ui/icons/ExpandMore"
import StarBorder from "@material-ui/icons/StarBorder"
import Archive from "@material-ui/icons/Archive"
import Today from "@material-ui/icons/Today"
import MoreHoriz from "@material-ui/icons/MoreHoriz"
import DeleteForever from "@material-ui/icons/DeleteForever"

import Divider from "@material-ui/core/Divider"

import Collapse from "@material-ui/core/Collapse"
import Grid from "@material-ui/core/Grid"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListSubheader from "@material-ui/core/ListSubheader"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import TextField from "@material-ui/core/TextField"

import ToggleButton from "@material-ui/lab/ToggleButton"
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup"

import Checkbox from "@material-ui/core/Checkbox"
import Paper from "@material-ui/core/Paper"

import { withStyles } from "@material-ui/core/styles"

import "typeface-roboto"

const styles = theme => ({
  appBar: {
    position: "relative"
  },
  layout: {
    [theme.breakpoints.down(1100 + theme.spacing.unit * 3 * 2)]: {
      width: "auto",
      marginLeft: 0,
      marginRight: 0
    },
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  shortWidthHide: {
    [theme.breakpoints.down(700 + theme.spacing.unit * 3 * 2)]: {
      display: "none"
    },
    [theme.breakpoints.up(700 + theme.spacing.unit * 3 * 2)]: {
      display: "block"
    }
  },
  shortWidthShow: {
    [theme.breakpoints.down(700 + theme.spacing.unit * 3 * 2)]: {
      display: "block"
    },
    [theme.breakpoints.up(700 + theme.spacing.unit * 3 * 2)]: {
      display: "none"
    }
  },
  listName: {
    margin: 20
  },
  searchBox: {
    marginLeft: 20,
    marginRight: 20,
    width: "90%"
  },
  sortToggleContainer: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%"
  },
  sortToggle: {
    width: 350
  },
  notesArea: {
    backgroundColor: "#efefef",
    marginLeft: 40,
    marginBottom: 20
  },
  notesAreaItem: {
    borderTop: "1px solid #ddd",
    listStyleType: "none",
    display: "flex",
    "&:first-child": {
      borderTop: "none"
    }
  },
  noteText: {
    display: "inline",
    flex: 1,
    paddingTop: 15
  }
})

type props = {
  classes: Object
}

class App extends React.Component<props> {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <IconButton>
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit">
              Ultralist
            </Typography>
          </Toolbar>
        </AppBar>

        <div className={this.props.classes.layout}>
          <Typography
            className={this.props.classes.listName}
            variant="headline"
            color="inherit"
          >
            My main list
          </Typography>

          <div className={this.props.classes.sortToggleContainer}>
            <div className={this.props.classes.sortToggle}>
              <ToggleButtonGroup exclusive value="project">
                <ToggleButton value="none" size="small">
                  No grouping
                </ToggleButton>
                <ToggleButton value="project" size="small">
                  By project
                </ToggleButton>
                <ToggleButton value="context" size="small">
                  By context
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>

          <Paper>
            <TextField
              id="outlined-search"
              label="Search"
              type="search"
              className={this.props.classes.searchBox}
              margin="dense"
            />

            <List subheader={<ListSubheader component="div">Store</ListSubheader>}>
              <ListItem key={0}>
                <Checkbox tabIndex={-1} />

                <IconButton className={this.props.classes.shortWidthHide} aria-label="Prioritize">
                  <StarBorder />
                </IconButton>

                <ListItemText primary={"Get milk from the +store and here's a really long title thingy that makes things super long"} secondary="Today" />
                <ListItemSecondaryAction>
                  <div className={this.props.classes.shortWidthHide}>
                    <IconButton aria-label="Due Today">
                      <Today />
                    </IconButton>
                    <IconButton aria-label="More actions">
                      <MoreHoriz />
                    </IconButton>
                    <IconButton aria-label="Show notes">
                      <ExpandMore />
                    </IconButton>
                  </div>
                  <div className={this.props.classes.shortWidthShow}>
                    <IconButton aria-label="More actions">
                      <MoreHoriz />
                    </IconButton>
                  </div>
                </ListItemSecondaryAction>
              </ListItem>

              <Collapse in={true} timeout="auto" unmountOnExit>
                <ul className={this.props.classes.notesArea}>
                  <li className={this.props.classes.notesAreaItem}>
                    <Typography variant="body1" className={this.props.classes.noteText}>
                      <span>This is note 1</span>
                    </Typography>
                    <IconButton aria-label="Show notes">
                      <DeleteForever />
                    </IconButton>
                  </li>
                  <li className={this.props.classes.notesAreaItem}>
                    <Typography variant="body1" className={this.props.classes.noteText}>
                      <span>This is note 2</span>
                    </Typography>
                    <IconButton aria-label="Show notes">
                      <DeleteForever />
                    </IconButton>
                  </li>
                  <li className={this.props.classes.notesAreaItem}>
                    <Typography variant="body1" className={this.props.classes.noteText}>
                      <span>This is note 3</span>
                    </Typography>
                    <IconButton aria-label="Show notes">
                      <DeleteForever />
                    </IconButton>
                  </li>
                </ul>
              </Collapse>

              <Collapse in={false} timeout="auto" unmountOnExit>
                <List component="div" disablepadding>
                  <ListItem>
                    <StarBorder />
                  </ListItem>
                  <IconButton aria-label="Archive">
                    <Archive />
                  </IconButton>
                </List>
              </Collapse>

              <Divider inset component="li" />

              <ListItem key={1}>
                <Checkbox tabIndex={-1} />
                <ListItemText primary={"Do some other stuff at the +store"} />
              </ListItem>
            </List>

            <List
              subheader={<ListSubheader component="div">Work</ListSubheader>}
            >
              <ListItem key={0}>
                <Checkbox tabIndex={-1} />
                <ListItemText
                  primary={"+work call @carl back"}
                  secondary="Tomorrow"
                />
              </ListItem>

              <Divider inset component="li" />

              <ListItem key={1}>
                <Checkbox tabIndex={-1} />
                <ListItemText
                  primary={"+work do the @bigproject"}
                  secondary="Tue Oct 16"
                />
              </ListItem>
            </List>
          </Paper>
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(App)
