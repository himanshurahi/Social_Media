import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import io from 'socket.io-client'
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, AfterViewInit {
  test
  comments;
  socket : any;
  posts;
  posting = false
  constructor(private router :  ActivatedRoute, private postService  : PostService) { 
    this.socket = io(environment.api)
  }
  
  ngOnInit() {
   this.test = document.getElementsByClassName('my-dash')
    this.getSinglePost()

    this.socket.on('refreshPage', data => {
      this.getSinglePost()
    })
    
  }


  getSinglePost(){
    this.postService.getSinglePost(this.router.snapshot.paramMap.get('id')).subscribe((comment:any) => {
      this.posts = comment.post
      this.comments = comment.comments
     })
  }

  onSubmit(form:NgForm){
    this.posting = true
    this.postService.addComment(this.router.snapshot.paramMap.get('id'), form.value).subscribe(data => {
      this.socket.emit('refresh', {})
      this.posting = false
    })
  }


  ngAfterViewInit(){
    this.test[0].style.display = 'none'
  }

}
