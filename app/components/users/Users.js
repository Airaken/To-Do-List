import React, { Component } from 'react';
class Users extends Component {
    constructor(){
        super();
        this.state = {
            users:[],
            tasks:[],
            email:'',
            password:'',
            ppassword:'',
            name:'',
            role:'USER_ROLE'
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
    // this function executes the necessary code to load the data before assembling the elements
    componentDidMount() {
        this.fetchUsers();
    }
    // this function unmount a fetch function to avoid state changes in disassembled elements
    componentWillUnmount(){
        this.fetchUsers(true);
    }
    // this function takes the form data to create the user in the data base
    handleSubmit(e){
        e.preventDefault();
        if(this.state.ppassword!==this.state.password){
            alert('passwords does not match');
        }else{
            const data = new URLSearchParams("email="+this.state.email+"&password="+this.state.password+"&name="+this.state.name+"&role="+this.state.role);
            fetch('/user', {
                method: 'POST',
                body: data,
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            })
            .then(res => res.json())
            .then(data =>{
                console.log(data.ok);
                let users = this.state.users;
                users.push(data.user);
                this.setState({email:'', password:'', ppassword:'', name:'', role:'USER_ROLE',users});
            })
            .catch(err => alert(err.message));
        }
    }
    // this function change the states and keep it
    handleInputChange(e){
        const{name, value} = e.target;
        this.setState({
            [name]:value
        })
    }    
    // a fetch to get a list of users 
    fetchUsers(off) {
        if (!off) {
        fetch('/user')
            .then(res => res.json())
            .then(data => {
                if(data.ok){
                    this.setState({ users: data.users });
                }else{
                    alert(data.err.message)
                }
            })
            .catch(err => alert(err.message));
        }
    }
    // main render of class User, organice the list and send the html code to App.js
    render() {
        let users = this.state.users.map(user => this.renderUser(user));
        return (
            <div className="container">
                <div className="row m2">
                    <div className="col-lg-5 col-md-12 col-sm-12 col-12">
                        <div className="card mt-3">
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit} className="form">
                                    <h1 className="p-1 h3 mb-3 font-weight-normal">Create a new user</h1>
                                    <div className="form-label-group">
                                        <label className="sr-only">Email address</label>
                                        <input name="email" value={this.state.email} onChange={this.handleInputChange} type="email" id="email" className="m-1 form-control" placeholder="Email address" required autoFocus />
                                    </div>
                                    <div className="form-label-group">
                                        <label className="sr-only">Password</label>
                                        <input name="password" value={this.state.password} onChange={this.handleInputChange} type="password" id="password" className="m-1 form-control" placeholder="Password" required />
                                    </div>
                                    <div className="form-label-group">
                                        <label className="sr-only">Re-Password</label>
                                        <input name="ppassword" value={this.state.ppassword} onChange={this.handleInputChange} type="password" id="ppassword" className="m-1 form-control" placeholder="Re-Password" required />
                                    </div>
                                    <div className="form-label-group">
                                        <label className="sr-only">Name</label>
                                        <input name="name" value={this.state.name} onChange={this.handleInputChange} type="test" id="name" className="m-1 form-control" placeholder="Name" required />
                                    </div>
                                    <div className="form-label-group">
                                        <label className="sr-only">Role</label>
                                        <select name="role" value={this.state.role} onChange={this.handleInputChange} id="role" className="m-1 form-control">
                                            <option value="USER_ROLE">USER_ROLE</option>
                                            <option value="ADMIN_ROLE">ADMIN_ROLE</option>
                                        </select>
                                    </div>
                                    <button className="m-1 btn btn-lg btn-primary btn-block" type="submit">Create</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7 col-md-12 col-sm-12 col-12">
                        <ul className="list-group mt-3">
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
            </div>
        )
    }
}

export default Users;