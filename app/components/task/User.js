import React, { Component } from 'react';
class User extends Component {
    render() {
        let name = this.props.name;
        let style = '';
        switch (name) {
            case 'Assign':
                style='primary'
                break;
            case 'Remove':
                style='danger';              
                break;
            default:
                break;
        }
        return (
            <div className=" list-group-item list-group-item-action list-group-item-light" >
                <div className="row">
                    <div className="col-8">
                        <span>{this.props.user.name}</span>
                    </div>
                    <div className="col-4">
                        <div>
                            <button name={name} id={this.props.user._id} onClick={this.props.onClick} className={`badge badge-${style} pl-2`} type="button"> {this.props.name}</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default User;