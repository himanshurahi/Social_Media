import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as M from 'materialize-css'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authStatus = new EventEmitter()
  token;
  user;
  loader = new EventEmitter()
  constructor(private http: HttpClient) { }

  registerUser(user: any) {
    return this.http.post(environment.api + '/auth/signup', user)
  }

  loginUser(user: any) {
    this.loader.emit(true)
    this.http.post(environment.api + '/auth/login', user).subscribe((user: any) => {
      this.token = user.token
      this.user = user
      delete user.user.images
      delete user.user.chatList
      delete user.user.following
      delete user.user.followers
      this.saveAuthData(user)
      this.authStatus.emit(user)
      this.loader.emit(false)
    }, error => {
      M.toast({ html: error.error.error_msg })
      this.loader.emit(false)
      console.log(error)
    })
  }

  isAuth() {
    return this.token != null
  }


  autoAuthData() {
    const token = localStorage.getItem('token')
    const UserID = localStorage.getItem('UserID')
    const userData = localStorage.getItem('userData')
    if (token) {
      this.token = token
      this.user = userData
    }
  }


  saveAuthData(user) {
    localStorage.setItem('token', user.token)
    localStorage.setItem('UserID', user.user._id)
    localStorage.setItem('userData', JSON.stringify(user))
  }

  clearAuthData() {
    this.token = null
    localStorage.removeItem('token')
    localStorage.removeItem('UserID')
    localStorage.removeItem('userData')
  }

  getUser() {
    if (typeof (this.user) == 'string') {
      this.user = JSON.parse(this.user)
    } else {
      this.user = this.user
    }
    return this.user
  }



}
