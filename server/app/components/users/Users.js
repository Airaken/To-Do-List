import React, { Component } from 'react';
class Users extends Component {
    constructor(){
        super();
        this.state = {
            users:[],
            tasks:[]
        }
        this.renderUser = this.renderUser.bind(this);
    }
    // function to render each user, show the name, email, rola and number of task they have 
    renderUser(user){
        return(
            <li className="list-group-item list-group-item-action col" key={user._id}>
                <ul className="list-group list-group-horizontal col">
                    <li className="list-group-item col">{user.name}</li>
                    <li className="list-group-item col">{user.email}</li>
                    <li className="list-group-item col">{user.role}</li>
                </ul>
            </li>
        );
    }
    componentDidMount(){
        this.fetchUsers();
    }
    // a fetch to get a list of users 
    fetchUsers() {
        fetch('/user')
            .then(res => res.json())
            .then(data => {
                this.setState({users:data.users});
            })
            .catch(err => console.log(err));
    }
    // main render of class User, organice the list and send the html code to App.js
    render() {
        let users = this.state.users.map(user => this.renderUser(user));
        return (
            <div className="container">
                <div className="row m2">
                    <ul className="list-group col mt-3">
                        <li className="list-group-item list-group-item-secondary list-group-item-action col">
                            <ul className="list-group list-group-horizontal col">
                                <li className="list-group-item list-group-item-secondary col"><h3>Name</h3></li>
                                <li className="list-group-item list-group-item-secondary col"><h3>Email</h3></li>
                                <li className="list-group-item list-group-item-secondary col"><h3>Role</h3></li>
                            </ul>
                        </li>
                        {users}
                    </ul>
                </div>
            </div>
        )
    }
}

export default Users;