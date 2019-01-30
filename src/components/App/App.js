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
    height: "100%",
    color: "#666"
  },
  darkTheme: {
    height: "100%",
    color: "#ccc"
  }
})

class App extends Component {
  constructor() {
    super()
    this.state = { //  如何整理 state 的資料，將相關資料整理成物件？
      inputValue: '',
      progress: 100, //改名成 totalCompletePercent 會更好
      todoList: [],// 這個可不可以併到 history 物件裡面？
      
      id: 0, // id 可以寫在外面嗎？怎麼做？參考 huli Sample Code。為什麼胡立的 id 要寫在外面？ 如果 id 應該寫在外面，那還有哪些狀態也應該寫在外面？ darkMode, checkToggle, modifyState, isHistoryRecord, historyStep。寫在 this.state 外面和裡面的判斷標準是什麼？ 需不需要 rerender？

      historyStep: 0,
      history: [[]],
      isHistoryRecord: true,
      
      darkMode: false, //isDarkMode
      checkToggle: false, 
      modifyState: false //isModifying
    }
    //跟 render 沒有關係的狀態放這裡
  }
  componentDidMount() {
    window.addEventListener("unload", () => {
      const { todoList, id } = this.state
      window.localStorage.setItem('todoList', JSON.stringify(todoList))
      window.localStorage.setItem('id', id)
    })
    const todoList = JSON.parse(window.localStorage.getItem('todoList'))
    const id = window.localStorage.getItem('id')
    if(todoList && id) {
      this.setState({
        id: id,
        todoList
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
    //記錄 history
    const { isHistoryRecord } = this.state
    if(isHistoryRecord) {
      const { history, historyStep } = this.state
      //新增、刪除 
      if(todoList.length!==prevState.todoList.length) {
        this.setState({
          historyStep: historyStep+1,
          history: [...history, todoList]
        })
      }
      //Check
      const { checkToggle } = this.state
      if(checkToggle!==prevState.checkToggle) {
        this.setState({
          historyStep: historyStep+1,
          history: [...history, todoList]
        })
      }
      //修改完成
      const { modifyState } = this.state
      if(modifyState!==prevState.modifyState && !modifyState) {
        this.setState({
          historyStep: historyStep+1,
          history: [...history, todoList]
        })
      }
    }
  }
  deleteTodoList = () => {
    window.localStorage.removeItem('todoList')
    window.localStorage.removeItem('id')
    if(window.confirm("確定要將 Todo List 的資料全部刪除？")) {
      this.setState({
        todoList: []
      })
    }
  }
  undo = () => {
    const { history, historyStep } = this.state
    if(1<=historyStep) {
      const todoList = [...history[historyStep-1]]
      this.setState({
        historyStep: historyStep-1,
        todoList,
        isHistoryRecord: false
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
        isHistoryRecord: false
      })
    }
  }
  toggleDarkMode = () => {
    const { darkMode } = this.state
    this.setState({
      darkMode: !darkMode
    })
    let body = document.querySelector('body')
    if(darkMode) body.style.backgroundColor = "#fff"
    else body.style.backgroundColor = "#333"
  }
  inputChange = e => { // 這種使用arrow function寫法叫什麼？
    this.setState({
      inputValue: e.target.value
    })
  }
  inputSubmit = e => {
    console.log(e)
    if(e.keyCode===13) this.addTodo()
  }
  addTodo = () => { // react 命名的慣例是什麼？ todoAdd？
    const { todoList, id, inputValue } = this.state
    const { history, historyStep } = this.state
    if(inputValue!=='') {
      this.setState({
        //在過去版本新增資料，就刪除未來紀錄
        history: historyStep<history.length-1 ? deleteFutureRecord(history, historyStep) : history,
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
    const { history, historyStep } = this.state
    this.setState({
      //在過去版本 check，就刪除未來紀錄
      history: historyStep<history.length-1 ? deleteFutureRecord(history, historyStep) : history,
      todoList: newTodoList,
      checkToggle: !checkToggle,
      isHistoryRecord: true
    })
  }
  removeTodo = todo => {
    const { todoList } = this.state
    const { history, historyStep } = this.state
    this.setState({
      //在過去版本移除資料，就刪除未來紀錄。
      history: historyStep<history.length-1 ? deleteFutureRecord(history, historyStep) : history,
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
      const { history, historyStep } = this.state
      this.setState({
        //在過去版本修改資料，就刪除未來紀錄。
        history: historyStep<history.length-1 ? deleteFutureRecord(history, historyStep) : history,
        todoList: newTodoList,
        modifyState: false,
        isHistoryRecord: true
      })
    } else alert('請輸入修改資料')
  }
  render() {
    const { inputValue, todoList, progress, darkMode, modifyState } = this.state
    const { classes } = this.props
    return (
      <MuiThemeProvider theme={ darkMode ? darkTheme : lightTheme } className={ darkMode ? classes.darkTheme: classes.lightTheme }  >
        <div className={ darkMode ? classes.darkTheme: classes.lightTheme }>
          <Header 
            darkMode={darkMode}
            toggleDarkMode={this.toggleDarkMode}
          />
        
          <TodoInput 
            inputValue={inputValue}
            darkMode={darkMode}
  
            inputChange={this.inputChange}
            addTodo={this.addTodo}
            inputSubmit={this.inputSubmit}
          />
          <TodoList 
            todoList={todoList} 
            progress={progress}
            darkMode={darkMode}
            modifyState={modifyState}

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
  let checkedNumber = 0
    for(let i=0; i<todoList.length; i++) {
      if(todoList[i].checked) checkedNumber++
    }
    let percent = checkedNumber/todoList.length*100
    return percent
}

function deleteFutureRecord(history, historyStep) {
  return history.filter((todoList, index) => index<=historyStep)
}

export default withStyles(styles)(App)

