import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as M from 'materialize-css'
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment'
import io from 'socket.io-client'
import { PostService } from 'src/app/services/post.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit, AfterViewInit {
  headerEl
  fix
  posts = []
  followings = []
  followers = []
  username: any;
  socket;
  loggedInUser;
  currentUserFollowing = []
  constructor(private userService: UserService, private route: ActivatedRoute, private router : Router ,private postService: PostService, private authService: AuthService) {
    this.socket = io(environment.api)
  }

  ngOnInit() {
    this.loggedInUser = this.authService.getUser().user
    // console.log(this.loggedInUser)
    this.headerEl = document.getElementsByClassName("my-dash")
    var elems = document.querySelectorAll('.tabs');
    M.Tabs.init(elems);

    this.getCurrentUser()

    this.route.params.subscribe((data: any) => {
      this.getUser(data.name)
    })



    this.socket.on('refreshPage', data => {
      this.getUser(this.username)
      this.getCurrentUser()
    })
  }

  getCurrentUser() {
    this.userService.getUserById(this.loggedInUser._id).subscribe((data: any) => {
      this.currentUserFollowing = data.following
    })
  }

  dateFromNow(date) {
    return moment(date).fromNow()
  }

  likePost(post) {
    this.postService.likePost(post).subscribe(data => {
      this.socket.emit('refresh', { data: 'refresh the postss' })
    })
  }

  isLiked(likes) {
    return likes.some(id => {
      return id.userID == this.loggedInUser._id
    })
  }

  isCurrenUser(user) {
    return user.id == this.loggedInUser._id
  }

  isFollowing(user) {
    return this.currentUserFollowing.some(id => {
      return id.userFollowed._id == user.id
    })
  }

  FollowUser(user) {
    this.userService.followUser(user._id).subscribe(data => {
      this.socket.emit('refresh', {})
    })
  }

  UnfollowUser(user){
    this.userService.unfollowUser(user._id).subscribe(data => {
      this.socket.emit('refresh', {})
    })
  }


  getUser(name) {
    this.userService.getUserByName(name).subscribe((data: any) => {
      this.username = data.username
      this.posts = data.post.reverse()
      this.followers = data.followers
      this.followings = data.following
    }, error => {
      console.log(error)
      this.router.navigate(['/dashboard'])
    
    })
  }


  ngAfterViewInit() {
    this.headerEl[0].style.display = 'none'

  }

}
