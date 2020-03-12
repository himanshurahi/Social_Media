import { Component, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import * as M from 'materialize-css'
import { UserService } from 'src/app/services/user.service';
import io from 'socket.io-client'
import * as moment from 'moment'
import { MessageService } from 'src/app/services/message.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  user;
  notifications;
  socket
  count;
  chatList = []
  isReadMsg = []
  tempArr
  OnlineUsers
  image;
  Elem;
  @Output() OnUsers = new EventEmitter()
  constructor(private authService: AuthService, private router: Router, private userService: UserService, private messageService: MessageService) {
    this.socket = io(environment.api)
  }

  Logout() {
    console.log('logut')
    this.authService.clearAuthData()
    this.router.navigate(['/'])
  }

  ngOnInit() {
    console.log('header COmpo')
    this.user = this.authService.getUser()
    const elems = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(elems, {
      alignment: 'right',
      coverTrigger: false,
      constrainWidth: false
    });

    var elems1 = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems1);

    let body = document.querySelector('body')
    body.style.overflow = 'auto'
    // this.Elem = <any>document.querySelector('.sidenav-overlay')

    this.Elem = <any>document.getElementsByClassName('sidenav-overlay')
    for (let index = 0; index < this.Elem.length; index++) {
      this.Elem[index].style.display = 'none'
    }

    // this.Elem = <any>document.querySelector("my-dash")


    this.getUser()

    this.socket.on('refreshPage', data => {
      this.getUser()
    })

    this.socket.emit("online", { room: 'global', user: this.user.user.username, userId: this.user.user._id })


  }

  getUser() {

    this.userService.getUserById(this.user.user._id).subscribe((user: any) => {
      this.image = { picVersion: user.picVersion, picId: user.picId }

      // console.log(user.chatList)
      // user.chatList.filter(msg => {
      //   const temp = msg.messageId.message[msg.messageId.message.length - 1]
      //   console.log(new Date(temp.createdAt))
      // })

      this.chatList = user.chatList
      //  user.chatList.filter(msg => {
      //   const temp = msg.messageId.message[msg.messageId.message.length - 1]
      //   this.chatList.push(msg)
      // })

      // this.chatList.reverse()

      this.checkIfRead(user.chatList)
      this.notifications = user.notifications.reverse()
      // console.log(this.notifications)
      this.count = this.notifications.filter(count => {
        return count.read == false
      })
    })

  }

  goToChatPage(username) {
    this.router.navigate(['/chat', username])
    this.userService.getUserByName(username).subscribe((data: any) => {
      this.messageService.markMessages({ sender: this.user.user._id, reciever: data._id }).subscribe(data => {
        this.socket.emit('refresh', {})
      })
    })


  }

  checkIfRead(arr) {
    this.isReadMsg = []
    arr.filter(msg => {
      const temp = msg.messageId.message[msg.messageId.message.length - 1].isRead == false &&
        msg.messageId.message[msg.messageId.message.length - 1].recieverId == this.user.user._id
      if (temp) {
      
        this.isReadMsg.push(temp)
      }
    })

  }

  fromNowDate(date) {
    return moment(date).fromNow()
  }

  MarkAllRead() {
    console.log('mark all read')
    this.userService.markAllNotifications().subscribe(user => {
      this.socket.emit('refresh', {})
    })
  }



  ngAfterViewInit() {
    this.socket.on('users_online', data => {
      let usersArr = []
      data.forEach(i => {
        if (usersArr.indexOf(i.user) == -1) {
          usersArr.push(i.user)
        }
      })
      this.OnlineUsers = usersArr
      this.OnUsers.emit(this.OnlineUsers)

    })

  }



}
