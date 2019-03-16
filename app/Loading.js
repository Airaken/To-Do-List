import React, { Component } from 'react';
import './App.css';
//change page for load page
class Loading extends Component {
  render() {
    return (
      <div className="Loading">
        <div className="Loading-div">
          <div className="spinner-grow text-primary Loading-spinner">
            <span className="sr-only">Loading...</span>
          </div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
}

export default Loading;