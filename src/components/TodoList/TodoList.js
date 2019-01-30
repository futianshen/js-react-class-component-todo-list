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
    removeTodo(todo)
  }
  modifyTodoTrigger = () => {
    const { isModifying } = this.props
    if(!isModifying) {
      const { modifyTodo, todo } = this.props
      modifyTodo(todo)
    }
  }
  modifyChange = e => {
    this.setState({
      modifyValue: e.target.value
    })
  }
  modifyTodoSubmit = e => e.keyCode===13 ? this.modifyTodoDoneTrigger() : 0
  modifyTodoDoneTrigger = () => {
    const { modifyValue } = this.state
    const { modifyTodoDone, todo } = this.props
    modifyTodoDone(todo, modifyValue)
  }
  render() {
    const { value, checked, todo, classes, isDarkMode } = this.props
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
          {todo.isModifying ? 
            <input
              className={isDarkMode ? classes.modifyInputDark : classes.modifyInputLight}
              value={modifyValue} 
              onChange={this.modifyChange}
              onKeyUp={this.modifyTodoSubmit}
            />
            :
            <p onDoubleClick={this.modifyTodoTrigger}>{value}</p>
          }
        </div>
        {todo.isModifying ? 
          <Button
            variant={isDarkMode ? "contained" : "outlined"}
            color="primary"
            onClick={this.modifyTodoDoneTrigger} 
          >
            修改
          </Button>
          :
          <Button
            variant={isDarkMode ? "contained" : "outlined"}
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
      category: 0
    }
  }
  //分類
  allTodos = () => {
    this.setState({
      category: 0
    })
  }
  completedTodos = () => {
    this.setState({
      category: 1
    })
  }
  uncompletedTodos = () => {
    this.setState({
      category: 2
    })
  }
  render() {
    const { category } = this.state
    const { undo, redo, deleteTodoList, checkTodo, removeTodo, modifyTodo, modifyTodoDone } = this.props
    const { classes, isDarkMode, isModifying, todoList, progress } = this.props
    let todolist = category ? 
      (category % 2 ? 
        todoList.filter(item=>item.checked===true) : todoList.filter(item=>item.checked===false)
      ) 
    : todoList
    return (
      <Card className={classes.todolist}>
        <LinearProgress value={progress} variant="determinate" color="primary"/>
        <CardContent className={classes.cardHeader}>
          <div className={classes.history}>
            <Undo className={classes.icon} onClick={undo}  />
            <Redo className={classes.icon} onClick={redo}  />
          </div>
          <div className="buttons">
            <Button 
              variant="contained"
              color={category===0 ? "primary" : "default"}
              className={classes.button}
              onClick={this.allTodos}
            >
              全部
            </Button>
            <Button 
              variant="contained"
              color={category===1 ? "primary" : "default"}
              className={classes.button} 
              onClick={this.completedTodos}
            >
              完成
            </Button>
            <Button 
              variant="contained"
              color={category===2 ? "primary" : "default"}
              className={classes.button} 
              onClick={this.uncompletedTodos}
            >
              未完成
            </Button>
          </div>
          <Delete className={classes.delete} onClick={deleteTodoList} />
        </CardContent>
        
        <CardContent>
          <List>
            {todolist.map(item =>
              <Item
                classes={classes}
                isDarkMode={isDarkMode}

                todo={item}
                key={item.id}
                checked={item.checked}
                value={item.value}
                modifyValue={item.modifyValue}

                checkTodo={checkTodo}
                removeTodo={removeTodo}

                isModifying={isModifying}
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
