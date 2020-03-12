import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }


  getAllUser() {
    return this.http.get(environment.api + "/users")
  }

  followUser(id) {
    return this.http.post(environment.api + "/users/follow-user", { id })
  }


  unfollowUser(id) {
    return this.http.post(environment.api + "/users/unfollow-user", { id })
  }

  getUserById(id) {
    return this.http.get(environment.api + "/users/id/" + id)
  }

  getUserByName(username) {
    return this.http.get(environment.api + "/users/" + username)
  }

  markNotification(notification) {
    return this.http.patch(environment.api + "/users/notification/mark", { id: notification._id })
  }

  deleteNotification(notification) {
    return this.http.patch(environment.api + "/users/notification/delete", { id: notification._id })
  }

  markAllNotifications() {
    return this.http.post(environment.api + "/users/notifications/markall", {})
  }

  UploadImage(image) {
    return this.http.post(environment.api + "/image/image-upload", { upload: true, image })
  }

  setDefault(data) {
    // set-default
    return this.http.post(environment.api + "/image/set-default", data)
  }

  search(username) {
    return this.http.post(environment.api + "/image/search", { username: username })
  }

  deleteImage(image) {
    return this.http.post(environment.api + "/image/delete", image)
  }

  changePassword(user) {
    return this.http.patch(environment.api + "/users/change-password", user)
  }
}
