import React, { Component } from 'react';
import './Task.css'
class Task extends Component{
    constructor(){
        super();
        this.state = {
            // usersSelect validates if the list of users of task cards is selected
            usersSelect:false
        }
        this.renderBodyCard = this.renderBodyCard.bind(this);
    }
    renderBodyCard(){
        switch(this.state.usersSelect){
            case false:
            return(
                <div className="card-body">
                    <h5 className="card-title">{this.props.task.name}</h5>
                     <p className="card-text mb-3">{this.props.task.description}</p>             
                    <a className="btn btn-primary"
                        id="edit" onClick={(e) => this.handleClick(e)}>Edit</a>
                </div>
            );
            case true:
            return(
                <div className="card-body">
                    
                </div>
            );
        }
    }
    // this function change usersSelect depending on which link is selected
    handleClick(body) {
        switch(body){
            case 'task':
            this.setState({
                usersSelect:false
            });
            break;
            case 'users':
            this.setState({
                usersSelect:true
            });
            break;
        }
    }
    render(){
        const bodyCard = this.renderBodyCard();
        let selectTask = 'active',selectUsers='';
        if (!this.state.usersSelect) {
            selectTask = 'active';           
        }else{
            selectUsers = 'active'; 
        }
        return (
            <div className="col-lg-4 col-md-6 col-sm-12 col-12 mt-3">
                <div className="card" key={this.props.task._id}>
                    <div className="card-header">
                        <ul className="nav nav-tabs card-header-tabs">
                            <li className="nav-item">
                                <a className={`nav-link ${selectTask}`}
                                    id="task" onClick={() => this.handleClick('task')}>Task</a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${selectUsers}`}
                                    id="users" onClick={() => this.handleClick('users')}>Users</a>
                            </li>
                        </ul>
                    </div>
                    {bodyCard}
                </div>
            </div>
            
        )
    }
}

export default Task;