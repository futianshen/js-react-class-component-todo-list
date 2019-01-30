import React, { Component } from 'react' // Fragment 是什麼意思？
import { withStyles } from '@material-ui/core'
import { Card, CardContent } from '@material-ui/core'
import { LinearProgress } from '@material-ui/core'
import { FormControlLabel, Checkbox,  List, ListItem } from '@material-ui/core'
import { Button } from '@material-ui/core'
import { Delete, Redo, Undo } from '@material-ui/icons'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  todolist: {
    maxWidth: "85%",
    margin: "0 auto 100px"
  },
  icon: {
    cursor: "pointer",
    transition: ".3s",
    '&:hover': {
      opacity: '0.6'
    },
    '&:active': {
      opacity: '0.9'
    }
  },
  history: {
    display: "flex",
    width: "55px",
    justifyContent: "space-between",
  },
  delete: {
    cursor: "pointer",
    width: "55px",
    transition: ".3s",
    '&:hover': {
      opacity: '0.6'
    },
    '&:active': {
      opacity: '0.9'
    }
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  modifyInputLight: {
    border: "0",
    outline: "0",
    fontSize: '16px',
    width: '160px',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: '#000'
  },
  modifyInputDark: {
    border: "0",
    outline: "0",
    fontSize: '16px',
    width: '160px',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: '#fff'
  },
  todoContent: {
    display: 'flex',
    justifyContent: 'space-between'
  }
})

class Item extends Component {
  constructor(props) { //只有在初始化需要 props 的時候才要塞 props
    super(props)
    const { modifyValue } = this.props
    this.state= {
      modifyValue: modifyValue
    }
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
    const { modifyState } = this.props
    if(!modifyState) {
      const { modifyTodo, todo } = this.props
      modifyTodo(todo)
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
    const { value, checked, todo, classes, darkMode } = this.props
    const { modifyValue } = this.state
    return (
      <ListItem className={classes.listItem}>
        <div className={classes.todoContent}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                color="primary"
                onChange={this.checkTodoTrigger}
              />
            }
          />
          {todo.modifyState ? 
            <input
              className={darkMode ? classes.modifyInputDark : classes.modifyInputLight}
              value={modifyValue} 
              onChange={this.modifyChange}
              onKeyUp={this.modifySubmit}
            />
            :
            <p onDoubleClick={this.modifyTodoTrigger}>{value}</p>
          }
        </div>
        {todo.modifyState ? 
          <Button
            variant={darkMode ? "contained" : "outlined"}
            color="primary"
            onClick={this.modifyTodoDoneTrigger} 
          >
            修改
          </Button>
          :
          <Button
            variant={darkMode ? "contained" : "outlined"}
            color="secondary"
            onClick={this.removeTodoTrigger}
          >
            刪除
          </Button>
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
  all = () => {
    this.setState({
      listState: 0
    })
  }
  completed = () => {
    this.setState({
      listState: 1
    })
  }
  uncompleted = () => {
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
      <Card className={classes.todolist}>
        <LinearProgress value={progress} variant="determinate" color="primary"/>
        <CardContent className={classes.cardHeader}>
          <div className={classes.history}>
            <Undo onClick={this.props.undo} className={classes.icon} />
            <Redo onClick={this.props.redo} className={classes.icon} />
          </div>
          <div className="buttons">
            <Button 
              variant="contained"
              color={listState===0 ? "primary" : "default"}
              className={classes.button}
              onClick={this.all}
            >
              全部
            </Button>
            <Button 
              variant="contained"
              color={listState===1 ? "primary" : "default"}
              className={classes.button} 
              onClick={this.completed}
            >
              完成
            </Button>
            <Button 
              variant="contained"
              color={listState===2 ? "primary" : "default"}
              className={classes.button} 
              onClick={this.uncompleted}
            >
              未完成
            </Button>
          </div>
          <Delete className={classes.delete} onClick={this.props.deleteTodoList}  />
        </CardContent>
        <CardContent>
          <List>
            {todolist.map(item =>
              <Item
                classes={classes}
                darkMode={darkMode}

                todo={item}
                key={item.id}
                checked={item.checked}
                value={item.value}
                modifyValue={item.modifyValue}

                checkTodo={checkTodo}
                removeTodo={removeTodo}

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