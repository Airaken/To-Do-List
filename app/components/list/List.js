import React, { Component } from 'react';
class List extends Component {
    constructor(){
        super();
        this.state={
            tasks:[],
            status:'all'
        }
        this.handleChange = this.handleChange.bind(this);
    }
    // function to render each task, show the name, user name,and statys
    renderTask(task){
        return(
            <li className="list-group-item list-group-item-action col" key={task._id}>
                <ul className="list-group list-group-horizontal col">
                    <li className="list-group-item col">{task.name}</li>
                    <li className="list-group-item col">{task.user.name}</li>
                    <li className="list-group-item col">{task.status}</li>
                </ul>
            </li>
        );
    }
    // this function executes the necessary code to load the data before assembling the elements
    componentDidMount() {
        this.fetchsTasks();
    }
    // this function unmount a fetch function to avoid state changes in disassembled elements
    componentWillUnmount(){
        this.fetchsTasks(null, true);
    }
    // a fetch to get a list of task 
    fetchsTasks(value,off) {
        if (!off) {
            if (value) {
                fetch('/task/search/' + value)
                    .then(res => res.json())
                    .then(data => {
                        if (data.ok) {
                            this.setState({ tasks: data.tasks })
                        } else {
                            alert(data.err.message)
                        }
                    })
                    .catch(err => alert(err.message));
            } else {
                fetch('/task')
                    .then(res => res.json())
                    .then(data => {
                        if (data.ok) {
                            this.setState({ tasks: data.tasks })
                        } else {
                            alert(data.err.message)
                        }
                    })
                    .catch(err => alert(err.message));
            }
        }
    }
    handleChange(e) {
        if(e.target.id==='value'){
            this.fetchsTasks(e.target.value);
        }else{
            this.setState({status:e.target.id})
        }
        
    }
    render() {
        let tasks = this.state.tasks
        if(this.state.status !== 'all') {
            tasks = this.state.tasks.filter(task => task.status === this.state.status)
        }
        return (
            <div className="container">
                <div className="row rounded-bottom bg-secondary">
                    <div className="pb-2 col d-flex justify-content-center">
                        <div className="input-group mt-2">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1"><i className="fas fa-search"></i></span>
                            </div>
                            <input id="value" className="form-control" onChange={this.handleChange} type="search" placeholder="Search task" aria-label="Search" />
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="input-group mb-3">
                            <div className="ml-1 my-1 mr-sm-2">
                                <label className="text-white" >Select status: </label>
                            </div>
                            <div className="custom-control custom-radio ml-1 my-1 mr-sm-2">
                                <input defaultChecked name="status" onChange={this.handleChange} type="radio" className="custom-control-input" id="all" />
                                <label value="all" className="text-white custom-control-label" htmlFor="all">ALL</label>
                            </div>
                            <div className="custom-control custom-radio ml-1 my-1 mr-sm-2">
                                <input name="status" onChange={this.handleChange} type="radio" className="custom-control-input" id="OPEN" />
                                <label value="OPEN" className="text-white custom-control-label" htmlFor="OPEN">OPEN</label>
                            </div>
                            <div className="custom-control custom-radio ml-1 my-1 mr-sm-2">
                                <input name="status" onChange={this.handleChange} type="radio" className="custom-control-input" id="IN-PROGRESS" />
                                <label value="IN-PROGRESS" className="text-white custom-control-label" htmlFor="IN-PROGRESS">IN-PROGRESS</label>
                            </div>
                            <div className="custom-control custom-radio ml-1 my-1 mr-sm-2">
                                <input name="status" onChange={this.handleChange} type="radio" className="custom-control-input" id="COMPLETED" />
                                <label value="COMPLETED" className="text-white custom-control-label" htmlFor="COMPLETED">COMPLETED</label>
                            </div>
                            <div className="custom-control custom-radio ml-1 my-1 mr-sm-2">
                                <input name="status" onChange={this.handleChange} type="radio" className="custom-control-input" id="ARCHIVED" />
                                <label value="ARCHIVED" className="text-white custom-control-label" htmlFor="ARCHIVED">ARCHIVED</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="m2">
                    <ul className="list-group mt-3">
                        <li className="list-group-item list-group-item-secondary list-group-item-action col">
                            <ul className="list-group list-group-horizontal col">
                                <li className="list-group-item list-group-item-secondary col"><h3>Name</h3></li>
                                <li className="list-group-item list-group-item-secondary col"><h3>Create by</h3></li>
                                <li className="list-group-item list-group-item-secondary col"><h3>Status</h3></li>
                            </ul>
                        </li>
                        {tasks.map(task => this.renderTask(task))}
                    </ul>
                </div>
            </div>
        )
    }
}

export default List;



