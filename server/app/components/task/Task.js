import React, { Component } from 'react';
import './Task.css'
import Modal from './Modal';
class Task extends Component{
    constructor(){
        super();
         // usersSelect validates if the list of users of task cards is selected
        this.state = {  
            usersInTask:[],
            usersOutTask:[]
        }
        this.handleClick = this.handleClick.bind(this);
    }  
    componentDidMount(){
        this.fetchUsers();
    }
    // a fetch to get a list of users 
    fetchUsers() {
        if (this.props.task.users.length !== 0) {
            this.props.task.users.map(userId => {
                fetch('/user/' + userId)
                    .then(res => res.json())
                    .then(data => {
                        let usersInTask = this.state.usersInTask;
                        usersInTask.push(data.user);
                        this.setState({usersInTask});
                    })
                    .catch(err => console.log(err));
            });
        }
    }
    // this function change usersSelect depending on which link is selected
    handleClick(e) {
        switch (e.target.name) {
            case 'assign':
                fetch('/user')
                    .then(res => res.json())
                    .then(data => {
                        let usersOutTask = data.users;
                        this.state.usersInTask.map(userTask =>{
                            usersOutTask = usersOutTask.filter(user => user._id !== userTask._id);
                        });
                        this.setState({ usersOutTask });
                    })
                    .catch(err => console.log(err));
                break;
            case 'delete':
                fetch('/task/removeTask/' + e.target.id + '&' + this.props.task._id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data.message);
                        console.log(this.state.usersInTask);
                        let usersInTask = this.state.usersInTask.filter(userId => userId===data.userDelete);
                        this.setState({ usersInTask });
                    })
                    .catch(err => console.log(err));
                break;
            case 'edit':

                break;
            default:
                break;
        }
    }
    returnRefresh(usersInTask) {
        // usersInTask.push(...this.state.usersInTask);
        // this.setState({ usersInTask })
    }
    renderUser(user) {
        return (
            <div key={user._id} className=" list-group-item list-group-item-action list-group-item-light" >
                <div className="row">
                    <div className="col-8">
                        <span>{user.name}</span>
                    </div>
                    <div className="col-4">
                        <div>
                            <button name="delete" id={user._id} onClick={this.handleClick} className="badge badge-danger pl-2" type="button"> Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    render() {
        let users = this.state.usersInTask.map(user => this.renderUser(user) );
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
                            <div className="card-body">
                                <h5 className="card-title">{task.name}</h5>
                                <p className="card-text mb-3">{task.description}</p>
                                    <button name="edit" onClick={this.handleClick} type="button" className="badge badge-primary">Edit</button>
                                
                            </div>
                        </div>
                        <div className="tab-pane fade" id={`users-${id}`} role="tabpanel" aria-labelledby="users-tab">
                            <div className="card-body">
                                <button name="assign" onClick={this.handleClick}
                                    data-toggle="modal" data-target={"#" + id}
                                    className="badge badge-primary" type="button">Assign User</button>
                                <Modal returnRefresh={this.returnRefresh} key={task._id} task={task} users={this.state.usersOutTask} />
                                {users}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default Task;