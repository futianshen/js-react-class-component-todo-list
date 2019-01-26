import React, { Component } from 'react'
import './App.css'
import { AppBar, Toolbar, withStyles } from '@material-ui/core'
import { Input, Button } from '@material-ui/core'
import TodoList from '../TodoList'

// 對照之前做的 React Todolist 看看語法和命名有什麼不同？
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

class App extends Component {
  constructor() {
    super()
    this.state = {
      inputValue: '',
      todoList: [],
      id: 0, // id 可以寫在外面嗎？怎麼做？
      progress: 100, //改名成 totalCompletePercent 會更好
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const { todoList } = this.state
    if(todoList!==prevState.todoList) {
      if(todoList.length===0) this.setState({completed: 100})
      else this.setState({completed: resetProgress(todoList)})
    } 
  }
  inputChange = e => { // 這種使用arrow function寫法叫什麼？
    this.setState({
      inputValue: e.target.value
    })
  }
  addTodo = () => { // react 命名的慣例是什麼？ todoAdd？
    const { todoList, id, inputValue } = this.state
    if(inputValue!=='') {
      this.setState({
        todoList: [...todoList, 
          {
            id,
            value: inputValue,
            modifyValue: inputValue,
            modifyState: false,
            checked: false,
          }
        ],
        inputValue: '',
        id: id+1,
      })
    } else alert('請輸入內容')
  }
  checkTodo = todo => {
    const { todoList } = this.state
    let result = todoList.find(item=>item.id===todo.id)
    result.checked = !result.checked
    let newTodoList = todoList.map(item=>item.id===todo.id ? result : item)
    this.setState({
      todoList: newTodoList
    })
  }
  removeTodo = todo => {
    const { todoList } = this.state
    this.setState({
      todoList: todoList.filter(item=>item.id!==todo.id),
    })
  }
  modifyTodo = todo => {
    //重複動作可以做成函式
    const { todoList } = this.state
    let result = todoList.find(item=>item.id===todo.id)
    result.modifyState = true
    let newTodoList = todoList.map(item=>item.id===todo.id ? result : item)
    this.setState({
      todoList: newTodoList
    })
  }
  modifyTodoDone = (todo, modifyValue) => {
    //重複動作可以做成函式
    const { todoList } = this.state 
    let result = todoList.find(item=>item.id===todo.id)
    result.modifyValue = modifyValue
    result.value = modifyValue
    result.modifyState = false
    let newTodoList = todoList.map(item=>item.id===todo.id ? result : item)
    this.setState({
      todoList: newTodoList
    })
  }
  render() {
    const { inputValue, todoList, progress, modifyState } = this.state
    const { classes } = this.props
    return (
      <div className="App">
        <AppBar position="static" color="default" className={classes.root}>
          <Toolbar>React Todo</Toolbar>
        </AppBar>
        <Input value={inputValue} onChange={this.inputChange} placeholder="Todo" />
        <Button onClick={this.addTodo}>Add</Button>
        <TodoList 
          todoList={todoList} 
          modifyState={modifyState}
          progress={progress}
          checkTodo={this.checkTodo}
          removeTodo={this.removeTodo}
          modifyTodo={this.modifyTodo}
          modifyTodoDone={this.modifyTodoDone}
        />
      </div>
    )
  }
}

export default withStyles(styles)(App);

function resetProgress(todoList) {
  let checkedNumber = 0
    for(let i=0; i<todoList.length; i++) {
      if(todoList[i].checked) checkedNumber++
    }
    let percent = checkedNumber/todoList.length*100
    return percent
}