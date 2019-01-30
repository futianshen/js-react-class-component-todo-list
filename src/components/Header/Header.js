import React, { Component } from 'react'
import { AppBar, Toolbar, Switch, withStyles } from '@material-ui/core'

const styles = () => ({
  appbar: {
    marginBottom: "80px"
  },
  header: {
    display: 'flex',
    margin: '0 auto', 
    width: "85%",
    justifyContent: 'space-between',
  }
})

class Header extends Component {
  render() {
    const { classes, isDarkMode, toggleDarkMode } = this.props
    return(
      <AppBar 
        position="static" 
        color="default" 
        className={classes.appbar} 
      >
        <Toolbar className={classes.header}>
          React Todo
          <Switch
            color="default"
            checked={isDarkMode} 
            onClick={toggleDarkMode}
          />
        </Toolbar>
      </AppBar>
    ) 
  }
}

export default withStyles(styles)(Header)