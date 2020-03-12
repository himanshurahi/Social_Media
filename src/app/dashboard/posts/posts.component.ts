import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import * as moment from 'moment'
import io from 'socket.io-client'
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts;
  socket;
  user;
  loading = false
  constructor(private authService: AuthService, private postService: PostService, private router : Router) {
    this.socket = io(environment.api)
  }

  fromNowDate(date) {
    return moment(date).fromNow()
  }
  ngOnInit() {
    this.user = this.authService.getUser()
    this.getAllPost()
    this.socket.on('refreshPage', data => {
      this.getAllPost()
    })
  }

  getAllPost() {
    this.loading = true
    this.postService.getPosts().subscribe((post:any) => {
      this.posts = post
      this.loading = false
    }, error => {
      this.loading = false
      this.router.navigate(['/'])
    })
  }

  likePost(post) {
    this.postService.likePost(post).subscribe(data => {
      this.socket.emit('refresh', { data: 'refresh the postss' })
    })
  }

  isLikedPost(post, userID) : boolean{
    return post.some(like => {
     return like.userID == userID
    })
  }

  isCommented(comments, userID){
    return comments.some(comment => {
      return comment.userID == userID
    })
  }

  onCommentClick(post){
    this.router.navigate(['/post', post._id])
  }





}
