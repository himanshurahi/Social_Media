import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  savePost(post) {
    return this.http.post(environment.api + '/post/addpost', post)
  }

  getPosts() {
    return this.http.get(environment.api + '/post/posts')
  }


  likePost(post) {
    return this.http.post(environment.api + '/post/addlike', post)
  }

  addComment(postID, comment) {
    return this.http.post(environment.api + '/post/addcomment', { postID, comment })
  }

  getSinglePost(postID) {
    return this.http.get(environment.api + '/post/' + postID)
  }
}
