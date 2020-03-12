import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import io from 'socket.io-client'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  loggedInUser;
  posts;
  following;
  followers
  socket
  constructor(private authService: AuthService, private userService: UserService) {
    this.socket = io(environment.api)
  }

  ngOnInit() {
    this.loggedInUser = this.authService.getUser().user
    this.getPost()
    this.socket.on('refreshPage', data => {
      this.getPost()
    })
  }

  getPost() {
    this.userService.getUserByName(this.loggedInUser.username).subscribe((data: any) => {
      this.posts = data.post
      this.following = data.following
      this.followers = data.followers
    })
  }

}
