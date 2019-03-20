import React, { Component } from 'react';
class List extends Component {
    constructor(){
        super();
        this.state={
            tasks:[],
            status:''
        }
        this.handleChange = this.handleChange.bind(this);
    }
    swithcTask(id,status){
        fetch('/task/changeStatus/'+id+'&'+status, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(res => res.json())
            .then(data => console.log(data.ok))
            .catch(err => console.log(err));
    }
    handleInputChange(e) {
        switch (e.target.name) {
            case 'open':
            this.swithcTask(e.target.id,'OPEN')
                break;
            case 'in-progress':
            this.swithcTask(e.target.id,'IN-PROGRESS')
                break;
            case 'completed':
            this.swithcTask(e.target.id,'COMPLETED')
                break;
            case 'archived':
            this.swithcTask(e.target.id,'ARCHIVED')
                break;
            default:
                break;
        }
    }
    renderTask(task){
        return(
            <li className="list-group-item list-group-item-action col" key={task._id}>
                <ul className="list-group list-group-horizontal col">
                    <li className="list-group-item col">{task.name}</li>
                    <li className="list-group-item col">{task.user.name}</li>
                    <li className="list-group-item col">{task.status}</li>
                </ul>
            </li>
        );
    }
    componentDidMount() {
        this.fetchsTasks();
    }
    // a fetch to get a list of task 
    fetchsTasks(value) {
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
    handleChange(e) {
        console.log(e.target.id);
        if(e.target.id==='value'){
            this.fetchsTasks(e.target.value);
        }else{
            console.log(`object`);
            this.setState({status:e.target.value})
        }
        
    }
    render() {
        let tasks = this.state.tasks;
        if (this.state.status !== '') {
            tasks = this.state.tasks.filter(task => task.status === this.state.status)
        }
        return (
            <div className="container">
                <div className="row rounded-bottom bg-secondary">
                    <div className="pb-2 col d-flex justify-content-center">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1"><i className="fas fa-search"></i></span>
                            </div>
                            <input id="value" className="form-control" onChange={this.handleChange} type="search" placeholder="Search task" aria-label="Search" />
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                <input onChange={this.handleChange} type="radio" name="status" value="OPEN" id="OPEN" /> OPEN
                                <input onChange={this.handleChange} type="radio" name="status" value="IN-PROGRESS" id="IN-PROGRESS" /> IN-PROGRESS
                                <input onChange={this.handleChange} type="radio" name="status" value="COMPLETED" id="COMPLETED" /> COMPLETE
                                <input onChange={this.handleChange} type="radio" name="status" value="ARCHIVED" id="ARCHIVED" /> ARCHIVED
                        </div>
                    </div>
                </div>
                <div className="m2">
                    <ul className="list-group mt-3">
                        <li className="list-group-item list-group-item-secondary list-group-item-action col">
                            <ul className="list-group list-group-horizontal col">
                                <li className="list-group-item list-group-item-secondary col"><h3>Name</h3></li>
                                <li className="list-group-item list-group-item-secondary col"><h3>Create by</h3></li>
                                <li className="list-group-item list-group-item-secondary col"><h3>Status</h3></li>
                            </ul>
                        </li>
                        {tasks.map(task => this.renderTask(task))}
                    </ul>
                </div>
            </div>
        )
    }
}

export default List;



