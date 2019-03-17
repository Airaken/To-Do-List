import React,{Component} from 'react';

class Modal extends Component{
    constructor(){
        super();
        this.state={
            idUsersAssign:[]
        }
        this.handleClick = this.handleClick.bind(this);    
    }
    componentDidMount(){
        this.props.returnRefresh(this.state.idUsersAssign);
    }
    handleClick(e){
        fetch('/task/assignTask/' + e.target.id + '&' + this.props.task._id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.message);
                let idUsersAssign = this.state.idUsersAssign.filter(userId => userId._id!==data.userAdd);
                console.log(idUsersAssign);
                this.setState({idUsersAssign});
            })
            .catch(err => console.log(err));       
    }
    // function to render each user that is not assigned to the task
    listUser(user) {
        return (
            <div className="input-group mb-3" key={user._id}>
                <input value={user.name} disabled type="text" className="form-control" aria-label="Text input with checkbox" />
                <div className="input-group-prepend">
                    <div>
                        <button name="remove" id={user._id} onClick={this.handleClick} className="badge badge-primary pl-2" type="button"> Assign</button>
                    </div>
                </div>
            </div>
        )
    }
    render(){
        let users = this.props.users.map(user => this.listUser(user) );
        if(users.length===0){
            users = 'there are no users to show'
        }
        let task = this.props.task
        return(            
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
                            {users}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button onClick={this.handleClick} type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Modal;