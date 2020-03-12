import { Component, OnInit, AfterViewInit } from '@angular/core';
import io from 'socket.io-client'
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {
  myElem;
  socket;
  typing;
  onlineUsers = []
  username
  images;
  constructor(private route: ActivatedRoute, private userService : UserService) {
    this.socket = io(environment.api)
  }

  ngOnInit() {
    this.myElem = document.querySelector('.my-dash')

    this.route.params.subscribe(data => {
      this.username = data.username
      this.getUser()
    })

   
  }

  ngAfterViewInit() {
    this.myElem.style.display = 'none'
  }

  online(event) {
    this.onlineUsers = event
  }

  checkIfOnline(username) {
    return this.onlineUsers.find(i => i == username)
  }

  getUser(){
    this.userService.getUserByName(this.username).subscribe((data:any) => {
      this.images = {picVersion : data.picVersion,  picId : data.picId}
    })
  }

  istyping(event) {
   
    if (this.username != event.data.receiver) {
      this.typing = event.isTyping

    }
  }

 


}
