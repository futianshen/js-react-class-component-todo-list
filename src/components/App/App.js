import React, { Component } from 'react'
import './App.css'
import Header from '../Header'
import TodoInput from '../TodoInput'
import TodoList from '../TodoList'
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles'

const lightTheme = createMuiTheme({
  palette: {
    type: 'light'
  }
})
const darkTheme = createMuiTheme({
  palette: {
    type: 'dark'
  }
})
const styles = () => ({
  lightTheme: {
    color: "#666"
  },
  darkTheme: {
    color: "#eee"
  }
})

class App extends Component {
  constructor() {
    super()
    this.state = { 
      inputValue: '',
      progress: 100,
      todoList: [],
      id: 0,

      historyStep: 0,
      history: [[]],
      isRecordingHistory: true,
      
      checkSwitch: false,
      isDarkMode: false, 
      isModifying: false
    }
    //跟 render 沒有關係的狀態可以放這裡
  }
  componentDidMount() {
    //關閉分頁：將 todolist 資料存到 Local Storage
    window.addEventListener("unload", () => {
      const { todoList, id, isDarkMode } = this.state
      window.localStorage.setItem('todoList', JSON.stringify(todoList))
      window.localStorage.setItem('id', id)
      window.localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode))
    })
    //開啟分頁：將 todolist 資料從 Local Storage 取出
    const id = window.localStorage.getItem('id')
    const todoList = JSON.parse(window.localStorage.getItem('todoList'))
    const isDarkMode = JSON.parse(window.localStorage.getItem('isDarkMode'))
    if(todoList && id) {
      this.setState({
        id,
        todoList,
        isDarkMode
      })
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const { todoList } = this.state
    //更新 progressbar
    if(todoList!==prevState.todoList) { //條件可以再設更精準一點
      if(todoList.length!==0) this.setState({progress: resetProgress(todoList)})
      else this.setState({progress: 100})
    }

    //isDarkMode <body> background
    const { isDarkMode } = this.state
    const body = document.querySelector('body')
    if(isDarkMode) body.style.backgroundColor = "#333"
    else body.style.backgroundColor = "#fff"

    //記錄 history
    const { isRecordingHistory } = this.state
    if(isRecordingHistory) {
      const { history, historyStep } = this.state
      //新增、刪除後
      if(todoList.length!==prevState.todoList.length) {
        this.setState({
          historyStep: historyStep+1,
          history: [...history, todoList]
        })
      }
      //Check 觸發
      const { checkSwitch } = this.state
      if(checkSwitch!==prevState.checkSwitch) {
        this.setState({
          historyStep: historyStep+1,
          history: [...history, todoList]
        })
      }
      //修改完成
      const { isModifying } = this.state
      if(isModifying!==prevState.isModifying && !isModifying) {
        this.setState({
          historyStep: historyStep+1,
          history: [...history, todoList]
        })
      }
    }
  }

  toggleDarkMode = () => {
    const { isDarkMode } = this.state
    this.setState({
      isDarkMode: !isDarkMode
    })
  }
  undo = () => {
    const { history, historyStep } = this.state
    if(1<=historyStep) {
      const todoList = [...history[historyStep-1]]
      this.setState({
        historyStep: historyStep-1,
        todoList,
        isRecordingHistory: false //停止紀錄歷史
      })
    }
  }
  redo = () => {
    const { history, historyStep } = this.state
    if(historyStep<=history.length-2) {
      const todoList = [...history[historyStep+1]]
      this.setState({
        historyStep: historyStep+1,
        todoList,
        isRecordingHistory: false  //停止紀錄歷史
      })
    }
  }
  deleteTodoList = () => {
    if(window.confirm("確定要將 Todo List 的資料全部刪除？")) {
      window.localStorage.removeItem('todoList')
      window.localStorage.removeItem('id')
      window.localStorage.removeItem('isDarkMode')
      this.setState({
        todoList: []
      })
    }
  }
  inputChange = e => { // 這種使用arrow function寫法叫什麼？
    this.setState({
      inputValue: e.target.value
    })
  }
  addTodoSubmit = e => e.keyCode===13 ? this.addTodo() : 0
  addTodo = () => { 
    const { todoList, id, inputValue } = this.state
    const { history, historyStep } = this.state
    if(inputValue!=='') {
      this.setState({
        //如果在過去版本新增資料，就刪除未來紀錄。
        history: historyStep<history.length-1 ? deleteFutureRecord(history, historyStep) : history,
        todoList: [...todoList, 
          {
            id,
            //value 和 modifyValue 可以只留一個就好？
            value: inputValue, 
            modifyValue: inputValue,
            isModifying: false,
            checked: false,
          }
        ],
        inputValue: '',
        id: id+1,
        isRecordingHistory: true  //恢復紀錄歷史
      })
    } else alert('請輸入內容')
  }

  checkTodo = todo => {
    const { todoList, checkSwitch } = this.state
    let result = {...todoList.find(item=>item.id===todo.id)}
    result.checked = !result.checked
    //上下比對看看會發生什麼問題？跟物件指向記憶體位置有關
    //let result = todoList.find(item=>item.id===todo.id)
    //result.checked = !result.checked
    const { history, historyStep } = this.state
    this.setState({
      //在過去版本 check，就刪除未來紀錄
      history: historyStep<history.length-1 ? deleteFutureRecord(history, historyStep) : history,
      //check todo
      todoList: todoList.map(item=>item.id===todo.id ? result : item),
      checkSwitch: !checkSwitch,
      isRecordingHistory: true  //恢復紀錄歷史
    })
  }
  removeTodo = todo => {
    const { todoList } = this.state
    const { history, historyStep } = this.state
    this.setState({
      //在過去版本移除資料，就刪除未來紀錄。
      history: historyStep<history.length-1 ? deleteFutureRecord(history, historyStep) : history,
      todoList: todoList.filter(item=>item.id!==todo.id),
      isRecordingHistory: true  //恢復紀錄歷史
    })
  }
  modifyTodo = todo => {
    const { todoList } = this.state
    let result = {...todoList.find(item=>item.id===todo.id)}
    result.isModifying = true
    //上下比對看看會發生什麼問題？跟物件指向記憶體位置有關
    //let result = todoList.find(item=>item.id===todo.id)
    //result.isModifying = true
    this.setState({
      todoList: todoList.map(item=>item.id===todo.id ? result : item),
      isModifying: true  //一次只能有一個 Todo 進行修改
    })
  }
  modifyTodoDone = (todo, modifyValue) => {
    if(modifyValue) {
      const { todoList } = this.state  
      let result = {...todoList.find(item=>item.id===todo.id)}  //原因物件存記憶體位置
      result.modifyValue = modifyValue
      result.value = modifyValue
      result.isModifying = false
      const newTodoList = todoList.map(item=>item.id===todo.id ? result : item)
      const { history, historyStep } = this.state
      this.setState({
        //在過去版本修改資料，就刪除未來紀錄。
        history: historyStep<history.length-1 ? deleteFutureRecord(history, historyStep) : history,
        todoList: newTodoList,
        isModifying: false,
        isRecordingHistory: true
      })
    } else alert('請輸入修改資料')
  }
  render() {
    const { isDarkMode, isModifying, inputValue, todoList, progress } = this.state
    const { classes } = this.props
    return (
      <MuiThemeProvider theme={ isDarkMode ? darkTheme : lightTheme} >
        <div className={ isDarkMode ? classes.darkTheme: classes.lightTheme }>
          <Header 
            isDarkMode={isDarkMode}
            toggleDarkMode={this.toggleDarkMode}
          />
        
          <TodoInput
            isDarkMode={isDarkMode}
            inputValue={inputValue}
  
            inputChange={this.inputChange}
            addTodo={this.addTodo}
            addTodoSubmit={this.addTodoSubmit}
          />

          <TodoList
            isDarkMode={isDarkMode}
            isModifying={isModifying}
            todoList={todoList} 
            progress={progress}
            
            undo={this.undo}
            redo={this.redo}
            deleteTodoList={this.deleteTodoList}
            checkTodo={this.checkTodo}
            removeTodo={this.removeTodo}
            modifyTodo={this.modifyTodo}
            modifyTodoDone={this.modifyTodoDone}
          />

        </div>
      </MuiThemeProvider>
    )
  }
}

function resetProgress(todoList) {
  //這邊如果用內建函式可以怎麼寫？
  let checkedNumber = 0
  for(let i=0; i<todoList.length; i++) { 
    if(todoList[i].checked) checkedNumber++
  }
  return checkedNumber/todoList.length*100
}

function deleteFutureRecord(history, historyStep) {
  return history.filter((todoList, index) => index<=historyStep)
}

export default withStyles(styles)(App)