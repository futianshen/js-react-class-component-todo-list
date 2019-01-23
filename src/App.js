import React, { Component } from 'react'
import './App.css'

// 將 material 拆分成元件
import { AppBar, Toolbar, withStyles } from '@material-ui/core'
import { Card , CardContent } from '@material-ui/core'
import { Input, Button, List, ListItem } from '@material-ui/core'
import { LinearProgress } from '@material-ui/core'
import { FormControlLabel, Checkbox } from '@material-ui/core'

// 對照之前做的Todolist 看看語法和命名有什麼不同？
// Current Version -> jQuery Version Function（刪除、修改、進度條） -> ideal Todo list
// 如何調整 CSS ？用哪一種邏輯調整 CSS？
// Component method 命名有問題就參考 Amelie
// 先求有再求好 把功能做出來。

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

class App extends Component {
  constructor() {
    super()
    this.state = {
      inputValue: '',
      todoList: [],
      id: 0, // id 可以寫在外面嗎？怎麼做？
    }
  }
  inputChange = e => { // 這種寫法叫什麼？
    this.setState({
      inputValue: e.target.value
    })
  }
  addTodo = () => {
    const { todoList, id, inputValue } = this.state
    if(inputValue!=='') {
      this.setState({
        todoList: [...todoList, 
          {
            id, 
            value: inputValue,
            checked: false
          }
        ],
        inputValue: '',
        id: id+1
      })
    } else {
      alert('請輸入內容')
    }
  }
  checkTodo = todo => {
    const { todoList } = this.state
    let result = todoList.find(item=>item.id===todo.id)
    result.checked = !result.checked
    let newTodoList = todoList.map(item=>item.id===todo.id ? result : item )
    this.setState({
      todoList: newTodoList
    })
  }
  removeTodo = todo => {
    const { todoList } = this.state
    this.setState({
      todoList: todoList.filter(item=>item.id!==todo.id)
    })
  }
  render() {
    const { inputValue, todoList } = this.state
    const { classes } = this.props
    return (
      <div className="App">
        <AppBar position="static" color="default" className={classes.root}>
          <Toolbar>React Todo</Toolbar>
        </AppBar>

        <Input value={inputValue} onChange={this.inputChange} placeholder="Todo" />
        <Button onClick={this.addTodo}>Add</Button>

        <Card>
          <Button variant="contained" className={classes.button}>全部</Button>
          <Button variant="contained" color="primary" className={classes.button}>完成</Button>
          <Button variant="contained" color="secondary" className={classes.button}>未完成</Button>

          <CardContent>
            <LinearProgress color="secondary" />
            <List>
              {todoList.map(item =>
                <Item 
                  key={item.id} 
                  id={item.id} 
                  checked={item.checked}
                  value={item.value} 
                  todo={item}
                  checkTodo={this.checkTodo}
                  removeTodo={this.removeTodo}
                  modifyTodo={this.modifyTodo}
                />
              )}
            </List>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export default  withStyles(styles)(App);
