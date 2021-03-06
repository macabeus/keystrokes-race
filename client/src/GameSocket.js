import io from 'socket.io-client';

import config from './config';

class GameSocket {
  constructor(roomName, userName) {
    this.socket = io(config.webSocketAddress);

    this.socket.on('connected', () => {
      console.log('socket connected');
      this.socket.emit('join room', roomName, userName)
    });

    this.socket.on('room users', (users) => {
      if (this.hookUpdateMembersList !== undefined) {
        this.hookUpdateMembersList(users)
      }
    });

    this.socket.on('join in room', (data) => {
      if (this.hookJoinInRoom !== undefined) {
        const isNewRoom = data.isNewRoom;
        const roomText = data.roomText;
        const secondsRemaining = data.secondsRemaining;

        this.hookJoinInRoom(isNewRoom, roomText, secondsRemaining)
      }
    });
  }

  updateKeystrokesInLastMinute(newValue) {
    this.socket.emit('update kpm in last minute', newValue);
  }

  updateKpmMaximum(newScore) {
    this.socket.emit('update kpm maximum', newScore);
  }
}

export default GameSocket;
