import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({namespace:"/chat"})
export class ChatGateway  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('ChatGateway')

  afterInit(server: Server) {
    this.logger.log("Initialized")
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Clinet Connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Clinet Disconnected: ${client.id}`);
  }

  @SubscribeMessage('ChatToServer')
  handleMessage(client: Socket, message:{sender: string, room:string, message:string})  {
    this.wss.to(message.room).emit('ChatToClient',message) // to send to all clients
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string){
    client.join(room);
    client.emit('joinedRoom', room)
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string){
    client.leave(room);
    client.emit('leftRoom', room)
  }




}
