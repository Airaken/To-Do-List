import React, { Component } from 'react';
import Task from '../task/Task';

class Board extends Component{
    constructor(){
        super();
        this.state = {
            tasks:[],
            name:'',
            description:''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    // this function executes the necessary code to load the data before assembling the elements
    componentDidMount(){
        this.fetchsTasks();
    }
    // this function unmount a fetch function to avoid state changes in disassembled elements
    componentWillUnmount(){
        this.fetchsTasks(null, true);
    }
    // this function returns the list of tasks that have a name similar to the value
    fetchsTasks(value, off) {
        if(!off){
            if (value) {
                fetch('/task/search/' + value)
                    .then(res => res.json())
                    .then(data => {
                        if(data.ok){
                            this.setState({ tasks: data.tasks })
                        }else{
                            alert(data.err.message)
                        }
                    })
                    .catch(err => alert(err.message));
            } else {
                fetch('/task')
                    .then(res => res.json())
                    .then(data => {
                    if(data.ok){
                        this.setState({ tasks: data.tasks })
                    }else{
                        alert(data.err.message)
                    }
                })
                    .catch(err => alert(err.message));
            }
        }  
    }
    // this function update hte list of task in the state
    handleChange(e){
        this.fetchsTasks(e.target.value);
    }
    // this funciton create a new task in the data base
    handleSubmit(e){
        e.preventDefault();
        const data = new URLSearchParams("name="+this.state.name+"&description="+this.state.description+"&status=OPEN");
        fetch('/task', {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(res => res.json())
            .then(data =>{
                if(data.ok){
                    this.setState({name:'',description:''})
                    this.fetchsTasks()
                }else{
                    alert(data.err.message)
                }
            })
            .catch(err => alert(err.message));
    }
    // this function change the states and keep it
    handleInputChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }
    render() {   
        return (
            <div className="container">
                <div className="row rounded-bottom bg-secondary">
                    <div className="col-12">
                        <form onSubmit={this.handleSubmit} >
                            <fieldset className="text-light">
                                <legend>Create a new Task</legend>
                                <div className="form-row">
                                    <div className="col-12 col-sm-4 col-md-3 col-lg-3 pb-2 ">
                                        <input name="name" onChange={this.handleInputChange} value={this.state.name} className="form-control" type="text" placeholder="Name task" />
                                    </div>
                                    <div className="col pb2 ">
                                        <input name="description" onChange={this.handleInputChange} value={this.state.description} className="form-control" type="text" placeholder="Description task" />
                                    </div>
                                    <div className="d-flex justify-content-center pb-2 col-12 col-sm-12 col-md-3 col-lg-2">
                                        <button type="submit" className="btn btn-dark" >Create Task</button>
                                    </div>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                    <div className="pb-2 col d-flex justify-content-center">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1"><i className="fas fa-search"></i></span>
                            </div>
                            <input className="form-control" onChange={this.handleChange} type="search" placeholder="Search task" aria-label="Search" />
                        </div>
                    </div>
                </div>
                <div className="row m2">
                    {this.state.tasks.map(task => <Task task={task} key={task._id}/>)}
                </div>
            </div>
        )
    }
}

export default Board;