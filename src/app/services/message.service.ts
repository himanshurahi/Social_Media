import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  sendMessage(recieverId, message) {
    return this.http.post(environment.api + '/message/sendmessage', { recieverId, message })
  }

  getAllMessage(recieverId) {
    return this.http.get(environment.api + '/message/getmessages/' + recieverId)
  }

  markMessages(data) {
    console.log(data)
    return this.http.post(environment.api + "/message/mark-message", data)
  }
}
