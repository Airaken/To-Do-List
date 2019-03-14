import React, { Component } from 'react';
import Task from '../task/Task';
class Board extends Component{
    constructor(){
        super();
        this.state = {
            tasks:[]
        }
        this.renderTask = this.renderTask.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    renderTask(task){
        return(
            <Task task={task} key={task._id}/>
        );
    }
    componentDidMount(){
        this.fetchsTasks();
    }
    fetchsTasks() {
        console.log(this.props.value);
        if (this.props.value) {
            console.log('in /task/search/');
            fetch('/task/search/' + this.props.value)
                .then(res => res.json())
                .then(data => {
                    this.setState({ tasks: data.tasks });
                })
                .catch(err => console.log(err));
        } else {
            console.log('in /task');
            fetch('/task')
                .then(res => res.json())
                .then(data => {
                    this.setState({ tasks: data.tasks });
                })
                .catch(err => console.log(err));
        }
    }
    render() {
        return (
            <div className="container">
                <div className="row m2">
                    {this.state.tasks.map(task => this.renderTask(task))}
                </div>
            </div>
        )
    }
}

export default Board;