import React, { Component } from 'react'
import { TextField, Button, withStyles } from '@material-ui/core'

const styles = () => ({
  input: {
    width: "300px",
    margin: "0 auto 50px"
  },
  textField: {
    margin: "0 auto",
    width: "240px"
  },
  buttonAdd: {
    margin: "12px -3px"
  }
})

class TodoInput extends Component {
  render() {
    const { inputValue, inputChange, inputSubmit, addTodo, classes } = this.props
    return (
      <div className={classes.input}>
        <TextField
          label="Todo"
          value={inputValue}
          onChange={inputChange} 
          onKeyUp={inputSubmit}
          className={classes.textField}
        />
        <Button 
          onClick={addTodo}
          variant="contained"
          color="primary"
          className={classes.buttonAdd}
        >
          Add
        </Button>
      </div>
    )
  }
}

export default withStyles(styles)(TodoInput);