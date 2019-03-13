import React, { Component } from 'react';
import './login.css';
class Login extends Component {
    constructor() {
        super();
        this.state = {
            email:'',
            password:''
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e){
        e.preventDefault();
        const data = new URLSearchParams("email="+this.state.email+"&password="+this.state.password);
        fetch('/login',{
            method:'POST',
            body: data,
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            }
        })
        .then(res => res.json())
        .then(data => this.props.callback(data.ok))
        .catch(err => console.log(err));
    }
    handleInputChange(e){
        const{name, value} = e.target;
        this.setState({
            [name]:value
        })
    }
    render() {
        return (
            //code https://startbootstrap.com/snippets/login/
        <div className="container">
            <div className="row">
                <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                    <div className="card card-signin my-5">
                        <div className="card-body">
                            <h5 className="card-title text-center">Sign In</h5>
                            <form onSubmit={this.handleSubmit} className="form-signin">
                                <div className="form-label-group">
                                    <input name="email" type="email" id="inputEmail" className="form-control" placeholder="Email address" onChange={this.handleInputChange} required autoFocus/>
                                    <label id="inputEmail" > Email address </label>
                                </div>
                                <div className="form-label-group">
                                    <input name="password" type="password" id="inputPassword" className="form-control" placeholder="Password" onChange={this.handleInputChange} required/>
                                    <label id="inputPassword" > Password </label>
                                </div>
                                <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit"> Sign in </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}
export default Login