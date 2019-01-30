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
    const { classes, inputValue, inputChange, addTodoSubmit, addTodo } = this.props
    return (
      <div className={classes.input}>
        <TextField
          label="Todo"
          className={classes.textField}
          value={inputValue}
          onChange={inputChange} 
          onKeyUp={addTodoSubmit}      
        />
        <Button
          className={classes.buttonAdd}
          variant="contained"
          color="primary"
          onClick={addTodo}
        >
          Add
        </Button>
      </div>
    )
  }
}

export default withStyles(styles)(TodoInput)