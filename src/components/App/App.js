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
      id: 0, // id 可以寫在外面嗎？怎麼做？參考 huli Sample Code
      step: 0,
      history: [[]],
      checkToggle: false,
      modifyState: false,
      isHistoryRecord: true
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const { todoList } = this.state
    //更新 progressbar
    if(todoList!==prevState.todoList) { //條件可以再設更精準一點
      if(todoList.length!==0) this.setState({progress: resetProgress(todoList)})
      else this.setState({progress: 100})
    }
    //記錄 history
    const { isHistoryRecord } = this.state
    const { history, step } = this.state
    if(isHistoryRecord) {
      if(isHistoryRecord!==prevState.isHistoryRecord) {
        //在過去版本刪除未來紀錄
        this.setState({
          history: history.filter((todoList, index)=> index<=step)
        })
      } else {
        //新增、刪除 
        if(todoList.length!==prevState.todoList.length) {
          this.setState({
            step: step+1,
            history: [...history, todoList]
          })
        }
        //Check
        const { checkToggle } = this.state
        if(checkToggle!==prevState.checkToggle) {
          this.setState({
            step: step+1,
            history: [...history, todoList]
          })
        }
        //修改完成
        const { modifyState } = this.state
        if(modifyState!==prevState.modifyState && !modifyState ) {
          this.setState({
            step: step+1,
            history: [...history, todoList]
          })
        }
      }
    }
  }
  undo = () => {
    const { history, step } = this.state
    if(1<=step) {
      const todoList = [...history[step-1]]
      this.setState({
        step: step-1,
        todoList,
        isHistoryRecord: false
      })
    }
  }
  redo = () => {
    const { history, step } = this.state
    if(step<=history.length-2) {
      const todoList = [...history[step+1]]
      this.setState({
        step: step+1,
        todoList,
        isHistoryRecord: false
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
        id: id+1,
        isHistoryRecord: true
      })
    } else alert('請輸入內容')
  }
  checkTodo = todo => {
    const { todoList, checkToggle } = this.state
    let result = {...todoList.find(item=>item.id===todo.id)}
    result.checked = !result.checked
    //上下比對會發生什麼問題？跟物件指向記憶體位置有關
    //let result = todoList.find(item=>item.id===todo.id)
    //result.checked = !result.checked
    let newTodoList = todoList.map(item=>item.id===todo.id ? result : item)
    this.setState({
      todoList: newTodoList,
      checkToggle: !checkToggle,
      isHistoryRecord: true
    })
  }
  removeTodo = todo => {
    const { todoList } = this.state
    this.setState({
      todoList: todoList.filter(item=>item.id!==todo.id),
      isHistoryRecord: true
    })
  }
  modifyTodo = todo => {
    const { todoList } = this.state
    let result = {...todoList.find(item=>item.id===todo.id)}
    result.modifyState = true
    //上下比對會發生什麼問題？跟物件指向記憶體位置有關
    //let result = todoList.find(item=>item.id===todo.id)
    //result.modifyState = true
    let newTodoList = todoList.map(item=>item.id===todo.id ? result : item)
    this.setState({
      todoList: newTodoList,
      modifyState: true
    })
  }
  modifyTodoDone = (todo, modifyValue) => {
    if(modifyValue) {
      const { todoList } = this.state  
      let result = {...todoList.find(item=>item.id===todo.id)}  //原因物件存記憶體位置
      result.modifyValue = modifyValue
      result.value = modifyValue
      result.modifyState = false
      const newTodoList = todoList.map(item=>item.id===todo.id ? result : item)
      this.setState({
        todoList: newTodoList,
        modifyState: false

      })
    } else alert('請輸入修改資料')
  }
  render() {
    const { inputValue, todoList, progress, history, modifyState, step } = this.state
    const { classes } = this.props
    console.log(step, history)
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