import React, { Component } from 'react';
class UserList extends Component {
    render() {
        return (
            <div>
                <div className="list-group">
                    <button type="button" className="list-group-item list-group-item-action">{this.props.value}</button>
                </div>
            </div>
        )
    }
}

export default UserList;