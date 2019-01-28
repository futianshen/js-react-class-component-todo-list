import React, { Component } from 'react'
import './App.css'
import { AppBar, Toolbar, withStyles } from '@material-ui/core'
import { Input, Button } from '@material-ui/core'
import TodoList from '../TodoList'
import { Redo, Undo } from '@material-ui/icons'

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
      progress: 100, //改名成 totalCompletePercent 會更好
      todoList: [],// 這個可不可以併到 history 物件裡面？
      id: 0, // id 可以寫在外面嗎？怎麼做？

      history: [{
        step: 0,
        todoList: []
      }],
      checkToggle: false,
      modifyState: false
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const { todoList } = this.state
    //更新 progressbar
    if(todoList!==prevState.todoList) { //條件可以再設更精準一點
      if(todoList.length!==0) this.setState({progress: resetProgress(todoList)})
      else this.setState({progress: 100})
    }
    //新增刪除時 記錄 history
    const { history } = this.state
    if(todoList.length!==prevState.todoList.length) {
      console.log('new')
      this.setState({
        history: [...history, {
          step: history.length,
          todoList
        }]
      })
    }
    //check時 記錄 history
    const { checkToggle } = this.state
    if(checkToggle!==prevState.checkToggle) {
      console.log('check')
      this.setState({
        history: [...history, {
          step: history.length,
          todoList
        }]
      })
    }
    //修改完成時 紀錄 history
    const { modifyState } = this.state
    if(modifyState!==prevState.modifyState && !modifyState ) {
      this.setState({
        history: [...history, {
          step: history.length,
          todoList
        }]
      })
    }

  }
  undo = () => {
    const { history, step } = this.state
    if(step>=1) {
      let todoList = history[step-1]
      this.setState({
        todoList: todoList,
        step: step-1
      })
    }
  }
  redo = () => {
    const { history, step } = this.state
    if(step<=history.length-2) {
      let todoList = history[step+1]
      this.setState({
        todoList: todoList,
      })
    }
  }
  inputChange = e => { // 這種使用arrow function寫法叫什麼？
    this.setState({
      inputValue: e.target.value
    })
  }
  inputSubmit = e => {
    if(e.keyCode===13) this.addTodo()
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
        id: id+1
      })
    } else alert('請輸入內容')
  }
  checkTodo = todo => {
    const { todoList, checkToggle } = this.state
    let result = todoList.find(item=>item.id===todo.id)
    result.checked = !result.checked
    let newTodoList = todoList.map(item=>item.id===todo.id ? result : item)
    this.setState({
      todoList: newTodoList,
      checkToggle: !checkToggle,
    })
  }
  removeTodo = todo => {
    const { todoList } = this.state
    this.setState({
      todoList: todoList.filter(item=>item.id!==todo.id)
    })
  }
  modifyTodo = todo => {
    const { todoList } = this.state
    let result = todoList.find(item=>item.id===todo.id)
    result.modifyState = true
    let newTodoList = todoList.map(item=>item.id===todo.id ? result : item)
    this.setState({
      todoList: newTodoList,
      modifyState: true
    })
  }
  modifyTodoDone = (todo, modifyValue) => {
    if(modifyValue) {
      const { todoList } = this.state 
      let result = todoList.find(item=>item.id===todo.id)
      result.modifyValue = modifyValue
      result.value = modifyValue
      result.modifyState = false
      let newTodoList = todoList.map(item=>item.id===todo.id ? result : item)
      this.setState({
        todoList: newTodoList,
        modifyState: false
      })
    } else alert('請輸入修改資料')
  }
  render() {
    const { inputValue, todoList, progress, history, modifyState } = this.state
    const { classes } = this.props
    console.log(history)
    return (
      <div className="App">
        <AppBar position="static" color="default" className={classes.root}>
          <Toolbar>React Todo</Toolbar>
        </AppBar>
        <Undo onClick={this.undo} />
        <Redo onClick={this.redo} />
        <Input 
          placeholder="Input something to do"
          value={inputValue} 
          onChange={this.inputChange} 
          onKeyUp={this.inputSubmit} />
        <Button onClick={this.addTodo}>Add</Button>
        <TodoList 
          todoList={todoList} 
          progress={progress}
          checkTodo={this.checkTodo}
          removeTodo={this.removeTodo}

          modifyState={modifyState}
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