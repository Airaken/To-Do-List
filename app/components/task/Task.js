import React, { Component } from 'react';
import './Task.css'
import User from './User';
class Task extends Component{
    constructor(props){
        super(props);
         // usersSelect validates if the list of users of task cards is selected
        this.state = { 
            usersInTask:[],
            usersOutTask:[],
            name:this.props.task.name,
            description:this.props.task.description,
            status:this.props.task.status,
            disabled:true,
            visible:true
        }
        this.handlerOnChange = this.handlerOnChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }  
     // this function executes the necessary code to load the data before assembling the elements
    componentDidMount() {
        this.fetchUsers();
    }
    // a fetch to get a list of users
    fetchUsers() {
        if (this.props.task.users.length !== 0) {
            this.props.task.users.map(userId => {
                fetch('/user/' + userId)
                    .then(res => res.json())
                    .then(data => {
                        //add user to list of users assigned in task
                        if (data.ok) {
                            let usersInTask = this.state.usersInTask;
                            usersInTask.push(data.user);
                            this.setState({ usersInTask });
                        } else {
                            alert(data.err.message)
                        }
                    })
                    .catch(err => alert(err.message));
            });
        }
        fetch('/user')
            .then(res => res.json())
            .then(data => {
                //add user to list of users not assigned in thask-
                if (data.ok) {
                    let users = data.user;
                    let usersOutTask = data.users;
                    this.state.usersInTask.map(userTask => {
                        usersOutTask = usersOutTask.filter(user => user._id !== userTask._id);
                    });
                    this.setState({ users, usersOutTask });
                } else {
                    alert(data.err.message)
                }
            })
            .catch(err => alert(err.message));
    }
    // this function change the status of task 
    swithcTask(status){
        fetch('/task/changeStatus/'+this.props.task._id+'&'+status, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(res => res.json())
            .then(data => {
                if (data.ok) {
                    console.log(data.ok)
                } else {
                    alert(data.err.message)
                }
            })
            .catch(err => alert(err.message));
    }
    // this function change usersSelect depending on which link is selected
    handleClick(e) {
        console.log(e.target.name);
        console.log(this.state.status);
        let disabled = false;
        let visible = false;
        switch (e.target.name) {
            case 'Assign':
                fetch('/task/assignUser/' + e.target.id + '&' + this.props.task._id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        //add user to list of users assigned
                        if (data.ok) {                           
                            let usersOutTask = this.state.usersOutTask.filter(userId => userId._id !== data.user._id);
                            let usersInTask = this.state.usersInTask;
                            usersInTask.push(data.user)
                            this.setState({ usersInTask, usersOutTask });
                        } else {
                            alert(data.err.message)
                        }
                    })
                    .catch(err => alert(err.message));
                break;
            case 'Remove':
                fetch('/task/removeUser/' + e.target.id + '&' + this.props.task._id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        // remove users to list of users asssigned in task
                        if (data.ok) {
                            let usersInTask = this.state.usersInTask.filter(userId => userId._id !== data.user._id);
                            let usersOutTask = this.state.usersOutTask;
                            usersOutTask.push(data.user)
                            this.setState({ usersOutTask, usersInTask });
                        } else {
                            alert(data.err.message)
                        }
                    })
                    .catch(err => alert(err.message));
                break;
            case 'Edit':
                disabled = false;
                visible = false
                this.setState({
                    disabled,
                    visible
                })
                break;
            case 'Cancel':
                disabled = true;
                visible = true;
                let name = this.props.task.name;
                let description = this.props.task.description;
                this.setState({
                    disabled,
                    visible,
                    name,
                    description
                })
                break;
            case 'Save':
                disabled = true;
                visible = true;
                const data = new URLSearchParams("name=" + this.state.name + "&description=" + this.state.description);
                fetch('/task/'+this.props.task._id, {
                    method: 'PUT',
                    body: data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.ok) {
                            this.setState({
                                disabled,
                                visible
                            })
                        } else {
                            alert(data.err.message)
                        }
                    })
                    .catch(err => alert(err.message));
                break;
            case 'open':
            this.swithcTask('OPEN')
            this.setState({status:'OPEN'})
                break;
            case 'in-progress':
            this.swithcTask('IN-PROGRESS')
            this.setState({status:'IN-PROGRESS'})
                break;
            case 'completed':
            this.swithcTask('COMPLETED')
            this.setState({status:'COMPLETED'})
                break;
            case 'archived':
            this.swithcTask('ARCHIVED')
            this.setState({status:'ARCHIVED'})
                break;
            default:
                break;
        }
    }
    // this function change the states and keep it
    handlerOnChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }
    // main render task
    render() {
        let usersInTask = this.state.usersInTask.map(user => <User key={user._id} user={user} onClick={this.handleClick} name={'Remove'} />);
        let usersOutTask = this.state.usersOutTask.map(user => <User key={user._id} user={user} onClick={this.handleClick} name={'Assign'} />);
        if (usersOutTask.length === 0) {
            usersOutTask = 'there are no users to show'
        }
        let id = `id-${this.props.task._id}`;
        let task = this.props.task;
        let badge = '';
        switch(this.state.status){
            case 'OPEN':badge = 'primary'
                break;
            case 'IN-PROGRESS':badge = 'secondary'
                break;
            case 'COMPLETED':badge = 'success'
                break;
            case 'ARCHIVED':badge = 'danger'
                break;
            default:
                break;
        }
        return (
            <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3 mt-3">
                <div className="card" key={task._id}>
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" id="task-tab" data-toggle="tab" href={`#task-${id}`} role="tab" aria-controls="task" aria-selected="true">Task</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="users-tab" data-toggle="tab" href={`#users-${id}`} role="tab" aria-controls="users" aria-selected="false">Users</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="status-tab" data-toggle="tab" href={`#status-${id}`} role="tab" aria-controls="status" aria-selected="false">Status</a>
                        </li>
                        <li className="nav-item mx-auto">
                            <span  className={`nav-item status badge badge-${badge}`}>{this.state.status}</span>
                        </li>
                    </ul>
                    <div className="tab-content" id="tabContent">
                        {/* tab of task info */}
                        <div className="tab-pane fade show active" id={`task-${id}`} role="tabpanel" aria-labelledby="task-tab">
                            {/* tthis is body card, it have name of task and message of task */}
                            <div className="card-body">
                                <input onChange={this.handlerOnChange} disabled={this.state.disabled} value={this.state.name} name="name" type="text" className={`card-title form-control task-title ${this.state.disabled === true ? 'task-title-border' : ' '}`} />
                                <textarea onChange={this.handlerOnChange} disabled={this.state.disabled} value={this.state.description} name="description" className="form-control" aria-label="With textarea"></textarea>
                                <div className="border mt-3">
                                    <div className="row p-2 btn-toolbar justify-content-between" >
                                        <div className="col col-lg-4 " >
                                            <button id="edit" name="Edit" onClick={this.handleClick} type="button" className={` badge badge-primary ${this.state.visible === true ? 'visible' : 'invisible'}`}> Edit</button>
                                        </div>
                                        <div className={`row col buttons ${this.state.visible === false ? 'visible' : 'invisible'}`}>
                                            <div className="col-6" role="group" >
                                                <button id="cancel" name="Cancel" onClick={this.handleClick} type="button" className=" badge badge-secondary"> Cancel</button>
                                            </div>
                                            <div className="col-4">
                                                <button id="save" name="Save" onClick={this.handleClick} type="button" className=" badge badge-success">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* tab of users */}
                        <div className="tab-pane fade" id={`users-${id}`} role="tabpanel" aria-labelledby="users-tab">
                            <div className="card-body">
                                <button data-toggle="modal" data-target={"#" + id}
                                    className="m-1 mb-3 badge badge-primary" type="button">Assign User</button>
                                <div key={task._id} className="modal fade" id={`id-${task._id}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-scrollable" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalScrollableTitle">Assign users to {task.name}</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                {usersOutTask}
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {usersInTask}
                            </div>
                        </div>
                        {/* tab of satus  values: ['OPEN', 'IN-PROGRESS', 'COMPLETED', 'ARCHIVED'],*/}
                        <div className="tab-pane fade" id={`status-${id}`} role="tabpanel" aria-labelledby="status-tab">
                            <div className="body-card m-4">
                                <div className="list-group">
                                    <button onClick={this.handleClick} name="open" type="button" className={`list-group-item list-group-item-action ${this.state.status === 'OPEN' ? 'active' : ''}`}>OPEN</button>
                                    <button onClick={this.handleClick} name="in-progress" type="button" className={`list-group-item list-group-item-action ${this.state.status === 'IN-PROGRESS' ? 'active' : ''}`}>IN-PROGRESS</button>
                                    <button onClick={this.handleClick} name="completed" type="button" className={`list-group-item list-group-item-action ${this.state.status ==='COMPLETED' ? 'active' : ''}`}>COMPLETED</button>
                                    <button onClick={this.handleClick} name="archived" type="button" className={`list-group-item list-group-item-action ${this.state.status === 'ARCHIVED' ? 'active' : ''}`}>ARCHIVED</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        )
    }
}

export default Task;