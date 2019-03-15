import React, { Component } from 'react';
import './Task.css'
class Task extends Component{
    constructor(){
        super();
         // usersSelect validates if the list of users of task cards is selected
        this.state = {  
            usersSelect:false,
            user:'',
            users:[],
            listUsers:[]
        }
        this.handleClick = this.handleClick.bind(this);
    }  
    componentDidMount(){
        this.fetchUsers();
    }
    // a fetch to get a list of users 
    fetchUsers() {
        fetch('/user')
            .then(res => res.json())
            .then(data => {        
                let listUsers = data.users;
                this.setState({listUsers})   
                let taskUsers = this.props.task.users;
                let users = []
                taskUsers.map(taskUser => {
                    listUsers.map(user => {
                        if (JSON.stringify(user._id) === JSON.stringify(taskUser)) {
                            users.push(user);
                        }
                    })
                });
                this.setState({ users });
            })
            .catch(err => console.log(err));
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
    listUser(user) {
        return (
            <div key={user._id} className=" list-group-item list-group-item-action list-group-item-light" >
                <div className="row">
                    <div className="col-9">
                        <span>{user.name}</span>
                    </div>
                    <div className="col-3">
                        <span className="badge badge-danger" type="button"> Assign</span>
                    </div>
                </div>
            </div>
        )
    }
    // this function change usersSelect depending on which link is selected
    handleClick(e) {
        switch (e.target.id) {
            case 'task':
                this.setState({
                    usersSelect: false
                });
                break;
            case 'users':
                this.setState({
                    usersSelect: true
                });
                break;
            case 'edit':
                break;
            case 'assign':
                fetch('/task/assignTask/' + this.props.task._id + "&" + this.state.user, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(res => res.json())
                    .then(data => console.log(data))
                    .catch(err => console.log(err));
                break;
        }
    }
    render() {
        let users = this.state.users.map(user => this.renderUser(user) );
        let listUsers = this.state.listUsers.map(user => this.listUser(user) );
        let id = `id-${this.props.task._id}`;
        return (
            <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3 mt-3">
                <div className="card" key={this.props.task._id}>
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
                                <h5 className="card-title">{this.props.task.name}</h5>
                                <p className="card-text mb-3">{this.props.task.description}</p>
                                <span type="button" className="badge badge-primary"
                                    id="edit" onClick={this.handleClick}>Edit</span>
                            </div>
                        </div>
                        <div className="tab-pane fade" id={`users-${id}`} role="tabpanel" aria-labelledby="users-tab">
                            <div className="card-body">
                                <div>
                                    <span id="assign"
                                        data-toggle="collapse" data-target={"#" + id}
                                        className="badge badge-primary" type="button">Assign User</span>
                                </div>
                                <div id={id} className="collapse">
                                    {listUsers}
                                </div>
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