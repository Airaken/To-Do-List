import React, { Component } from 'react';
import Task from '../task/Task';
class Board extends Component{
    constructor(){
        super();
        this.state = {
            tasks:[]
        }
        this.renderTask = this.renderTask.bind(this);
    }
    renderTask(task){
        return(
            <Task task={task} key={task._id}/>
        );
    }
    componentDidMount(){
        this.fetchTasks();
    }
    fetchTasks() {
        console.log('in to the renderTask');
        fetch('/task')
            .then(res => res.json())
            .then(data => {
                this.setState({tasks:data.tasks});
                console.log(this.state);
            })
            .catch(err => console.log(err));
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