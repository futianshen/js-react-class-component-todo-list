import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import { Card , CardContent } from '@material-ui/core'
import { LinearProgress } from '@material-ui/core'
import { FormControlLabel, Checkbox,  List, ListItem } from '@material-ui/core'
import { Button } from '@material-ui/core'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing.unit,
  }
})

class Item extends Component {
  constructor(props) {
    super(props)
  }
  checkTodoTrigger = () => {
    const { checkTodo, todo } = this.props
    checkTodo(todo)
  }
  removeTodoTrigger = () => {
    const { removeTodo, todo } = this.props
    if(window.confirm('確定要刪除嗎？')) removeTodo(todo)
  }
  modifyTodoTrigger = () => {

  }
  render() {
    const { id, value, checked } = this.props
    return (
      <ListItem onDoubleClick={this.modifyTodoTrigger}>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={this.checkTodoTrigger}
              value=""
              /* classes={{
                root: classes.root,
                checked: classes.checked,
              }} */
            />
          }
        />
        {id}:{value}
        <Button
          //className={classes.button}
          variant="outlined"
          color="secondary"
          onClick={this.removeTodoTrigger}
        >
          刪除
        </Button>
      </ListItem>
    )
  }
}

class LinearDeterminate extends Component {
  render() {
    return (
      <LinearProgress variant="determinate" value={this.props.completed} />
    )
  }
}

class TodoList extends Component {
  render() {
    const { classes, todoList, completed } = this.props
    const { checkTodo, removeTodo, modifyTodo } = this.props
    return (
      <Card>
        <Button variant="contained" className={classes.button}>全部</Button>
        <Button variant="contained" color="primary" className={classes.button}>完成</Button>
        <Button variant="contained" color="secondary" className={classes.button}>未完成</Button>
        <LinearDeterminate completed={completed} />
        <CardContent>
          <List>
            {todoList.map(item =>
              <Item 
                key={item.id} 
                id={item.id} 
                checked={item.checked}
                value={item.value} 
                todo={item}
                checkTodo={checkTodo}
                removeTodo={removeTodo}
                modifyTodo={modifyTodo}
              />
            )}
          </List>
        </CardContent>
      </Card>
    )
  }
}

export default withStyles(styles)(TodoList);