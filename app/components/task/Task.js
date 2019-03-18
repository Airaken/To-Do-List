import React, { Component } from 'react';
import './Task.css'
import User from './User';
class Task extends Component{
    constructor(){
        super();
         // usersSelect validates if the list of users of task cards is selected
        this.state = { 
            usersInTask:[],
            usersOutTask:[],
            name:'',
            description:'',
            status:'',
            disabled:true,
            visible:true
        }
        this.handlerOnChange = this.handlerOnChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }  
    componentDidMount() {
        this.fetchUsers();
        let name = this.props.task.name;
        let description = this.props.task.description;
        this.setState({ name ,description})
    }
    // a fetch to get a list of users
    fetchUsers() {
        if (this.props.task.users.length !== 0) {
            this.props.task.users.map(userId => {
                fetch('/user/' + userId)
                    .then(res => res.json())
                    .then(data => {
                        //add user to list of users assigned in task
                        let usersInTask = this.state.usersInTask;
                        usersInTask.push(data.user);
                        this.setState({usersInTask});
                    })
                    .catch(err => console.log(err));
            });
        }
        fetch('/user')
            .then(res => res.json())
            .then(data => {
                //add user to list of users not assigned in thask-
                let users = data.user;
                let usersOutTask = data.users;
                this.state.usersInTask.map(userTask => {
                    usersOutTask = usersOutTask.filter(user => user._id !== userTask._id);
                });
                this.setState({users,usersOutTask});
            })
            .catch(err => console.log(err));
    }
    // this function change usersSelect depending on which link is selected
    handleClick(e) {
        console.log(e.target.name);
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
                        let usersOutTask = this.state.usersOutTask.filter(userId => userId._id !== data.user._id);
                        let usersInTask = this.state.usersInTask;
                        usersInTask.push(data.user)
                        this.setState({usersInTask,usersOutTask});
                    })
                    .catch(err => console.log(err));
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
                        let usersInTask = this.state.usersInTask.filter(userId => userId._id !== data.user._id);
                        let usersOutTask = this.state.usersOutTask;
                        usersOutTask.push(data.user)
                        this.setState({ usersOutTask, usersInTask });
                    })
                    .catch(err => console.log(err));
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
                        console.log(data.ok);
                        this.setState({
                            disabled,
                            visible
                        })
                    })
                    .catch(err => console.log(err));
                break;
            default:
                break;
        }
    }
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
                    </ul>
                    <div className="tab-content" id="myTabContent">
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
                        <div className="tab-pane fade" id={`users-${id}`} role="tabpanel" aria-labelledby="users-tab">
                            <div className="card-body">
                                <button data-toggle="modal" data-target={"#" + id}
                                    className="badge badge-primary" type="button">Assign User</button>
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
                    </div>
                </div>
            </div> 
        )
    }
}

export default Task;