import React, { Component } from 'react';

import GameSocket from '../../GameSocket';

import TyperacerText from './TyperacerText';
import Members from './Members';
import KeystrokesPerMinutes from './KeystrokesPerMinutes';
import NotificationGame from './NotificationGame';
import Countdown from './Countdown';
import TyperacerTextField from './TyperacerTextField';

import { Grid, Col, Panel } from 'react-bootstrap';


class RoomPanels extends Component {
  constructor(props) {
    super(props);

    const roomname = this.props.match.params.roomname;
    this.username = this.props.match.params.username;
    this.socket = new GameSocket(roomname, this.username);
    this.socket.hookJoinInRoom = this.handleJoinInRoom.bind(this);

    this.state = {
      text: '',
      secondsInitial: 0,
      textTypedHistory: [],
      lastWordIsIncorrect: false,
      timeout: false
    }

    this.handleUpdatedUserList = this.handleUpdatedUserList.bind(this);
    this.handleOnTyperacerTextFieldChange = this.handleOnTyperacerTextFieldChange.bind(this);
    this.handleGameTimeout = this.handleGameTimeout.bind(this);
  }

  componentWillUnmount() {
    this.socket.socket.disconnect();
    this.socket.hookNewRoom = undefined;
  }

  handleJoinInRoom(isNewRoom, roomText, secondsRemaining) {
    NotificationGame.notificationJoinInRoom(isNewRoom);

    this.setState({
      text: roomText,
      secondsInitial: secondsRemaining,
      timeout: false
    })
  }

  handleUpdatedUserList(oldUsersList, newUsersList) {
    this.refs.notification.notificationUpdatedUserList(oldUsersList, newUsersList);
  }

  handleOnTyperacerTextFieldChange(textTypedHistory, lastWordIsIncorrect) {
    this.setState({
      textTypedHistory: textTypedHistory,
      lastWordIsIncorrect: lastWordIsIncorrect
    })
  }

  handleGameTimeout() {
    NotificationGame.notificationTimeout();

    this.setState({
      timeout: true
    })
  }

  render() {
    return (
      <Grid fluid={true}>
        <Col xs={4}>
          <Panel header="Text to type">
            <TyperacerText
              text={this.state.text}
              wordsTypedCount={this.state.textTypedHistory.length}
              lastWordIsIncorrect={this.state.lastWordIsIncorrect} />
          </Panel>
        </Col>

        <Col xs={4}>
          <Panel header="Your text">
            <TyperacerTextField
              text={this.state.text}
              timeout={this.state.timeout}
              onChange={this.handleOnTyperacerTextFieldChange} />
          </Panel>
        </Col>

        <Col xs={4}>
          <Col xs={12}>
            <Panel header="Your score">
              <KeystrokesPerMinutes
                socket={this.socket}
                textTypedHistory={this.state.textTypedHistory} />
            </Panel>
          </Col>

          <Col xs={12}>
            <Panel header="Time">
              <Countdown
                secondsInitial={this.state.secondsInitial}
                onTimeout={this.handleGameTimeout} />
            </Panel>
          </Col>

          <Col xs={12}>
            <Panel header="Ranking">
              <Members
                socket={this.socket}
                username={this.username}
                onUpdateMemberList={this.handleUpdatedUserList} />
            </Panel>
          </Col>
        </Col>

        <NotificationGame ref='notification'/>
      </Grid>
    )
  }
}

export default RoomPanels;