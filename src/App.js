import React, { Component } from 'react';
import './App.css';
import { AppBar, Toolbar, withStyles } from '@material-ui/core'
import { Card , CardContent } from '@material-ui/core'
import { Input, Button, List, ListItem } from '@material-ui/core'
//import { LinearProgress } from '@material-ui/core'
import { FormControlLabel, Checkbox } from '@material-ui/core'

// 對照之前做的Todolist 看看語法和命名有什麼不同？
// Current Version -> jQuery Version Function（刪除、修改、進度條） -> ideal Todo list
// 如何調整 CSS ？用哪一種邏輯調整 CSS？
// 命名有問題就參考 Amelie
// 有哪些功能要做？
// 先求有再求好 把功能做出來，
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
    this.state={
      checked: false
    }
  }
  handleCheck = () => {
    const { checked } = this.state
    this.setState({
      checked: !checked
    })
  }
  removeTodoClick = () => {
    const { removeTodo, todo } = this.props
    removeTodo(todo)
  }
  render() {
    const { id, value } = this.props
    return (
      <ListItem >
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.checked}
              onChange={this.handleCheck}
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
          variant="outlined"
          color="secondary"
          //className={classes.button}
          onClick={this.removeTodoClick}
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
      id: 0 // id 可以寫在外面嗎？怎麼做？
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
        todoList: [...todoList, {id, inputValue}], // inputValue 可不可以改放其他的？
        inputValue: '',
        id: id+1
      })
    } else {
      alert('請輸入內容')
    }
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
          {/* <LinearProgress color="secondary" variant="determinate" value={this.state.completed} /> */}
          <CardContent>
            <List>
              {todoList.map(item => // map函式是怎麼運作的，可不可以自己寫一個map函式出來？
                <Item key={item.id} id={item.id} value={item.inputValue} todo={item} removeTodo={this.removeTodo} />
              )}
            </List>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export default  withStyles(styles)(App);
