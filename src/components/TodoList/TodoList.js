import React, { Component, Fragment } from 'react' // Fragment 是什麼意思？
import { withStyles } from '@material-ui/core'
import { Card , CardContent } from '@material-ui/core'
import { LinearProgress } from '@material-ui/core'
import { FormControlLabel, Checkbox,  List, ListItem } from '@material-ui/core'
import { Button, Switch } from '@material-ui/core'

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
    const { value, removeTodoTrigger, modifyTodoTrigger } = this.props
    return (
      <Fragment>
        <p onDoubleClick={modifyTodoTrigger}>{value}</p>
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
  modifySubmit = e => {
    if(e.keyCode===13) this.modifyTodoDoneTrigger()
  }
  modifyTodoDoneTrigger = () => {
    const { modifyValue } = this.state
    const { modifyTodoDone, todo } = this.props
    modifyTodoDone(todo, modifyValue)
  }
  render() {
    const { modifyValue } = this.state
    return (
      <Fragment>
        <input 
          value={modifyValue} 
          onChange={this.modifyChange}
          onKeyUp={this.modifySubmit}
        />
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
  checkTodoTrigger = () => {
    const { checkTodo, todo } = this.props
    checkTodo(todo)
  }
  removeTodoTrigger = () => {
    const { removeTodo, todo } = this.props
    if(window.confirm('確定要刪除嗎？')) removeTodo(todo)
  }
  modifyTodoTrigger = () => {
    const { modifyState } = this.props
    if(!modifyState) {
      const { modifyTodo, todo } = this.props
      modifyTodo(todo)
    }
  }
  completeModifyTodoTrigger = () => {
    const { completeModifyTodo, todo } = this.props
    completeModifyTodo(todo)
  }
  render() {
    const { value, checked, todo, modifyValue, modifyTodoDone ,darkMode } = this.props
    return (
      <ListItem>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              color={darkMode ? "secondary" : "primary" }
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
            modifyTodoTrigger={this.modifyTodoTrigger}
          />
        }
      </ListItem>
    )
  }
}

class TodoList extends Component {
  constructor(props) {
    super(props)
    this.state={
      listState: 0
    }
  }
  allList = () => {
    this.setState({
      listState: 0
    })
  }
  completeList = () => {
    this.setState({
      listState: 1
    })
  }
  uncompleteList = () => {
    this.setState({
      listState: 2
    })
  }
  render() {
    //  切換完成 / 未完成
    const { listState } = this.state
    const { classes, todoList, progress, modifyState } = this.props
    let todolist = listState ? 
      (listState % 2 ? 
        todoList.filter(item=>item.checked===true) : todoList.filter(item=>item.checked===false)
      ) 
    : todoList
    const { checkTodo, removeTodo, modifyTodo, modifyTodoDone, darkMode } = this.props
    return (
      <Card>
        {darkMode ? 
          <LinearProgress value={progress} variant="determinate" color="secondary" />
          :
          <LinearProgress value={progress} variant="determinate" color="primary"/>
        }  
        
        <Button 
          variant="contained"
          color={listState===0 ? (darkMode ? "secondary" : "primary") : "default"}
          className={classes.button}
          onClick={this.allList}
        >
          全部
        </Button>
        <Button 
          variant="contained"
          color={listState===1 ? (darkMode ? "secondary" : "primary") : "default"}
          className={classes.button} 
          onClick={this.completeList}
        >
          完成
        </Button>
        <Button 
          variant="contained"
          color={listState===2 ? (darkMode ? "secondary" : "primary") : "default"}
          className={classes.button} 
          onClick={this.uncompleteList}
        >
          未完成
        </Button>
        <Switch 
          checked={darkMode} 
          color="default"
          //color={darkMode ? "secondary" : "primary"}
          onClick={this.props.toggleDarkMode}
        />
        <CardContent>
          <List>
            {todolist.map(item =>
              <Item
                key={item.id}
                checked={item.checked}
                value={item.value}
                modifyValue={item.modifyValue}
                todo={item}
                checkTodo={checkTodo}
                removeTodo={removeTodo}

                darkMode={darkMode}

                modifyState={modifyState}
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