import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3001, {path: '/websockets', serveClient: true, namespace: '/'})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('AppGateway')

  afterInit(server: Server) {
    this.logger.log("Initialized")
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Clinet Connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Clinet Disconnected: ${client.id}`);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string): void { //WsResponse<string>
    this.wss.emit('msgToClient',text) // to send to all clients
    // return {event: 'msgToClient',data: text };
  }
}
