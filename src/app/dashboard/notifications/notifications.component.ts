import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import io from 'socket.io-client'
import * as moment from 'moment'
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  loggedInUser;
  notifications;
  socket;
  address = [{}]
  constructor(private authService: AuthService, private userService: UserService) {
    this.socket = io(environment.api)
  }

  ngOnInit() {
    this.loggedInUser = this.authService.getUser()
    this.getUser()

    this.socket.on('refreshPage', data => {
      this.getUser()
    })

  }

  getUser() {
    this.userService.getUserById(this.loggedInUser.user._id).subscribe((user: any) => {
      this.notifications = user.notifications.reverse()
    })
  }
  fromNowDate(date) {
    return moment(date).fromNow()
  }

  read(notification) {
    this.userService.markNotification(notification).subscribe(data => {
      this.socket.emit('refresh', {})
    })
  }

  deleteNotification(notification) {
    this.userService.deleteNotification(notification).subscribe(data => {
      this.socket.emit('refresh', {})
    })
  }

}
