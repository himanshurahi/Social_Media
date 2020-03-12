import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import io from 'socket.io-client'
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {
  socket;
  followers = []
  loggedInUser;
  constructor(private userService: UserService, private authService: AuthService) {
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
      this.followers = user.followers
    })
  }

}
