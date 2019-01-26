import React, { Component, Fragment } from 'react' // Fragment 是什麼意思？
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

class DeleteItem extends Component {
  render() {
    const { value, removeTodoTrigger } = this.props
    return (
      <Fragment>
        <p>{value}</p>
        <Button
          variant="outlined"
          color="secondary"
          onClick={removeTodoTrigger}
          >
          刪除
        </Button>
      </Fragment>
    )
  }
}

class ModifyItem extends Component {
  constructor(props) { //只有在初始化需要 props 的時候才要塞 props
    super(props)
    const { modifyValue } = this.props
    this.state={
      modifyValue: modifyValue
    }
  }
  modifyChange = e => {
    this.setState({
      modifyValue: e.target.value
    })
  }
  modifyTodoDoneTrigger = () => {
    console.log(1)
    const { modifyValue } = this.state
    const { modifyTodoDone, todo } = this.props
    modifyTodoDone(todo, modifyValue)
  }
  render() {
    const { modifyValue } = this.state
    return (
      <Fragment>
        <input value={modifyValue} onChange={this.modifyChange} />
        <Button
          variant="outlined"
          color="primary"
          onClick={this.modifyTodoDoneTrigger}
        >
          修改
        </Button>
      </Fragment>
    )
  }
}

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
    const { modifyTodo, todo } = this.props
    modifyTodo(todo)
  }
  completeModifyTodoTrigger = () => {
    const { completeModifyTodo, todo } = this.props
    completeModifyTodo(todo)
  }
  render() {
    const { value, checked, todo, modifyValue, modifyTodoDone } = this.props
    return (
      <ListItem onDoubleClick={this.modifyTodoTrigger}>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={this.checkTodoTrigger}
            />
          }
        />
        {todo.modifyState ? 
          <ModifyItem
            todo={todo}
            modifyValue={modifyValue}
            modifyTodoDone={modifyTodoDone} 
          /> 
          : 
          <DeleteItem 
            value={value} 
            removeTodoTrigger={this.removeTodoTrigger}
          />
        }
      </ListItem>
    )
  }
}

class LinearDeterminate extends Component { // 可以用 functional Component
  render() {
    return (
      <LinearProgress variant="determinate" value={this.props.progress} />
    )
  }
}

class TodoList extends Component {
  render() {
    const { classes, todoList, progress, state } = this.props
    const { checkTodo, removeTodo, modifyTodo, modifyTodoDone } = this.props
    return (
      <Card>
        <Button variant="contained" className={classes.button}>全部</Button>
        <Button variant="contained" color="primary" className={classes.button}>完成</Button>
        <Button variant="contained" color="secondary" className={classes.button}>未完成</Button>
        <LinearDeterminate progress={progress} />
        <CardContent>
          <List>
            {todoList.map(item =>
              <Item 
                key={item.id}
                checked={item.checked}
                value={item.value}
                modifyValue={item.modifyValue}
                todo={item}
                state={state}
                checkTodo={checkTodo}
                removeTodo={removeTodo}
                modifyTodo={modifyTodo}
                modifyTodoDone={modifyTodoDone}
              />
            )}
          </List>
        </CardContent>
      </Card>
    )
  }
}

export default withStyles(styles)(TodoList)

