import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import io from 'socket.io-client'
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {
  loggedInUser;
  followingUserArray;
  socket
  constructor(private userService : UserService, private authService : AuthService) { 
    this.socket = io(environment.api)
  }

  ngOnInit() {
    this.loggedInUser = this.authService.getUser()
    this.getUser()

    this.socket.on('refreshPage', data => {
      this.getUser()
    })
  }

  

  getUser(){
    this.userService.getUserById(this.loggedInUser.user._id).subscribe((data:any) => {
      this.followingUserArray = data.following
    })
  }

  UnfollowUser({_id}){
    this.userService.unfollowUser(_id).subscribe(data => {
      this.socket.emit('refresh', {})
    })
  }

}
