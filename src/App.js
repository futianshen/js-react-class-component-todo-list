import React, { Component } from 'react';
import './App.css';
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

class App extends Component {
  constructor() {
    super()
    this.state = {
      inputValue: '',
      todoList: [],
      id: 0 // id 可以寫在外面嗎？怎麼做？
    }
    
  }
  inputChange = e => {
    this.setState({
      inputValue: e.target.value
    })
  }
  addTodo = () => {
    const { todoList, id, inputValue } = this.state
    this.setState({
      todoList: [...todoList, {id, inputValue}],
      inputValue: '',
      id: id+1
    })
  }
  
  render() {
    const { inputValue, todoList } = this.state
    return (
      <div className="App">
        <Input value={inputValue} onChange={this.inputChange} placeholder="Todo" />
        <Button onClick={this.addTodo}>Add</Button>
        <List>
          {todoList.map(item =>
            <ListItem key={item.id} >
              {item.inputValue}
            </ListItem>
          )}
        </List>
      </div>
    )
  }
}

export default App;
