import { Inject } from "@nestjs/common";
import { CredentialsBodySchema } from "../controllers/event-auth.controller";
import { ClientProxy } from "@nestjs/microservices";

export class EventAuthService {
    constructor(@Inject('AUTH_SERVICE') private eventClient: ClientProxy){}

    execute(userCredentials: CredentialsBodySchema){
        //this.eventClient.emit('auth-request', userCredentials)
        //return {message: 'Auth Request!'}
        const response = this.eventClient.send({cmd: 'auth-request'}, userCredentials)
        return this.eventClient.send({cmd: 'auth-request'}, userCredentials)
        
    }
    
}