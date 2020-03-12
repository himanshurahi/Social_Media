import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import io from 'socket.io-client'
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  users;
  loggedInUser;
  userFollowArr;
  socket;
  OnlineUsers;
  constructor(private userService: UserService, private authService: AuthService, private router: Router) {
    this.socket = io(environment.api)
  }

  ngOnInit() {
    this.loggedInUser = this.authService.getUser()
    this.getUser()
    this.getAllUsers()

    this.socket.on('refreshPage', data => {
      this.getUser()
      this.getAllUsers()

    })
  }


  getAllUsers() {
    this.userService.getAllUser().subscribe((user: any) => {
      const nUser = user.filter(u => {
        return u._id != this.authService.getUser().user._id
      })
      this.users = nUser
    })
  }

  FollowUser(id) {
    this.userService.followUser(id).subscribe((user: any) => {
      this.socket.emit('refresh', {})
    })
  }

  getUser() {
    this.userService.getUserById(this.loggedInUser.user._id).subscribe((user: any) => {
      this.userFollowArr = user.following
    })
  }


  checkIsFollowing(userFollowArr, userID) {
    return userFollowArr && userFollowArr.some(user => {
      return user.userFollowed._id == userID
    })
  }

  online(event) {
    this.OnlineUsers = event
  }

  checkIfOnline(username) {
    return this.OnlineUsers && this.OnlineUsers.find(i => i == username)

  }

  viewUser(user) {
    this.router.navigate([user.username])

  }


}
