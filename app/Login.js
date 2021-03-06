import React, { Component } from 'react';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email:'',
            password:''
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.signin = this.signin.bind(this);
    }
    // this function takes the form data to create the user in the data base
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
        .then(data =>{
            if(data.ok){
                this.props.callback('main')
            }else{
                alert(data.err.message)
            }
        })
        .catch(err => alert(err.message));
    }
    // this function change the states and keep it
    handleInputChange(e){
        const{name, value} = e.target;
        this.setState({
            [name]:value
        })
    }
    // this function retorn to the signin page
    signin(){
        this.props.callback('signin')
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card card-signin my-5">
                            <div className="card-body">
                                <h5 className="card-title text-center">Login</h5>
                                <form onSubmit={this.handleSubmit} className="form-signin">
                                    <div className="form-label-group">
                                        <label id="inputEmail" > Email address </label>
                                        <input name="email" type="email" id="inputEmail" className="m-1 form-control" onChange={this.handleInputChange} required autoFocus />
                                    </div>
                                    <div className="form-label-group">
                                        <label id="inputPassword" > Password </label>
                                        <input name="password" type="password" id="inputPassword" className="m-1  form-control" onChange={this.handleInputChange} required />
                                    </div>
                                    <button className="m-1  btn btn-lg btn-primary btn-block text-uppercase" type="submit"> Login </button>
                                </form>
                                <div className="d-flex justify-content-center p-2">
                                    <a href="#" className="badge badge-light" onClick={this.signin}>Sign In</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Login