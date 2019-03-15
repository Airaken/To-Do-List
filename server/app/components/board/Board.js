import React, { Component } from 'react';
import Task from '../task/Task';
class Board extends Component{
    constructor(){
        super();
        this.state = {
            tasks:[]
        }
        this.renderTask = this.renderTask.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount(){
        this.fetchsTasks();
    }
    renderTask(task){
        return(
            <Task task={task} key={task._id}/>
        );
    }
    fetchsTasks(value) {
        console.log(value);
        if (value) {
            fetch('/task/search/' + value)
                .then(res => res.json())
                .then(data => this.setState({ tasks: data.tasks }))
                .catch(err => console.log(err));
        } else {
            fetch('/task')
                .then(res => res.json())
                .then(data => this.setState({ tasks: data.tasks }))
                .catch(err => console.log(err));
        }
    }
    handleChange(e){
        this.fetchsTasks(e.target.value);
    }
    render() {      
        return (
            <div className="container">
                <div className="row rounded-bottom bg-secondary">
                    <div className="col-5">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1"><ion-icon name="search"></ion-icon></span>
                            </div>
                            <input className="form-control mr-sm-2" onChange={this.handleChange} type="search" placeholder="Search task" aria-label="Search" />
                        </div>
                    </div>
                    <div className="col-12">
                        <form className="form-inline p-2 my-2 my-lg-0">
                            <input className="form-control mr-sm-2" onChange={this.handleChange} type="text" placeholder="Search task"  />
                        </form>
                    </div>
                </div>
                <div className="row m2">
                    {this.state.tasks.map(task => this.renderTask(task))}
                </div>
            </div>
        )
    }
}

export default Board;