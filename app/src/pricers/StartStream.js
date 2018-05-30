import React from 'react';

class StartStream extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      messageToSend: 100,
      delayBtwMessageInMs: 50
    }
}

  askForStream = (e) => {
    fetch(this.props.fetchUrl + "?messageToSend=" + this.state.messageToSend + "&delayBtwMessageInMs=" + this.state.delayBtwMessageInMs)
      .then(function (response) {
      });
  }

  changeMessageCount = (e) => {
    this.setState({
      messageToSend: e.target.value,
      delayBtwMessageInMs: this.state.delayBtwMessageInMs
    })
  }

  changeDelay = (e) => {
    this.setState({
      messageToSend: this.state.messageToSend,
      delayBtwMessageInMs: e.target.value
    })
  }

  render() {
    return (<form>
      <div className="form-row">
        <div className="form-group col-md-3">
          <label for="inputEmail4">Message Count (Default 100)</label>
          <input type="number" value={this.state.messageToSend} onChange={this.changeMessageCount} class="form-control form-control-sm" id="inputEmail4" placeholder="Count" />
        </div>
        <div className="form-group col-md-3">
          <label for="inputPassword4">Delay between Message (Default 50ms)</label>
          <input type="number" value={this.state.delayBtwMessageInMs} onChange={this.changeDelay} class="form-control form-control-sm" id="inputPassword4" placeholder="Delay" />
        </div>
        <div class="form-group col-md-2">
          <button className="btn btn-success" type="button" onClick={this.askForStream} >Start streaming</button>
        </div>
      </div>
    </form>)
  }
}

export { StartStream }