import React, { Component } from 'react';
import './Task.css'
import Modal from '../users/Modal';
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
    renderUser(user) {
        return (
            <div key={user._id} className=" list-group-item list-group-item-action list-group-item-light" >
                <div className="row">
                    <div className="col-9">
                        <span>{user.name}</span>
                    </div>
                    <div className="col-3">
                        <span className="badge badge-danger" type="button"> Delete</span>
                    </div>
                </div>
            </div>
        )
    }
    // this function change usersSelect depending on which link is selected
    handleClick(e) {
        switch (e.target.id) {
            case 'assign':
                fetch('/user')
                    .then(res => res.json())
                    .then(data => {
                        let usersOutTask = data.users;
                        this.state.usersInTask.map(userTask =>{
                            usersOutTask = usersOutTask.filter(user => user._id !== userTask._id);
                        });
                        this.setState({usersOutTask});                   
                    })
                    .catch(err => console.log(err));
                break;
            case 'edit':

                break;
            default:
                break;
        }
    }
    returnRefresh(){
        this.fetchUsers();
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
                                <span type="button" className="badge badge-primary"
                                    id="edit" onClick={this.handleClick}>Edit</span>
                            </div>
                        </div>
                        <div className="tab-pane fade" id={`users-${id}`} role="tabpanel" aria-labelledby="users-tab">
                            <div className="card-body">
                                <div>
                                    <span id="assign" onClick={this.handleClick}
                                        data-toggle="modal" data-target={"#" + id}
                                        className="badge badge-primary" type="button">Assign User</span>
                                </div>
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