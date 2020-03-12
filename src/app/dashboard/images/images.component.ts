import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import io from 'socket.io-client'
import { environment } from 'src/environments/environment';

const URL = 'http://localhost:3000/chatapp/upload-image';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {
  imagePrew
  file
  imageError = false
  user;
  images;
  socket;
  uploading = false
  ProfileImage;
  public uploader: FileUploader = new FileUploader({ url: URL, disableMultipart: true });
  constructor(private userService: UserService, private authService: AuthService) {
    this.socket = io(environment.api)
  }

  ngOnInit() {
    this.getUser()

    this.socket.on('refreshPage', data => {
      this.getUser()
    })
  }


  getUser() {
    const user = this.authService.getUser()
    this.userService.getUserById(user.user._id).subscribe((data: any) => {
      this.images = data.images
      this.ProfileImage = data.picId
    })
  }


  onFileSelected(event) {
    this.imageError = false
    const file = event[0]
    const allowedType = ['image/png', 'image/jpg', 'image/jpeg']
    this.file = file
    if (allowedType.includes(file.type)) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.imagePrew = reader.result
      }
      reader.onerror = function () {
      };
      reader.readAsDataURL(file)
    } else {
      this.imageError = true
      console.log('Invalid Image')
    }

  }

  UploadFile() {
    this.uploading = true
    const imageHtml = <HTMLInputElement>document.getElementById('image')
    imageHtml.value = ""
    if (!this.imageError) {
      this.userService.UploadImage(this.imagePrew).subscribe(data => {
        this.socket.emit('refresh', {})
        this.uploading = false
      }, error => {
        this.uploading = false
        console.log(error)
      })
    }
  }

  setDefault(image) {
    this.userService.setDefault(image).subscribe(data => {
      this.socket.emit('refresh', {})
    })
  }

  deleteImage(image) {
    this.userService.deleteImage(image).subscribe(data => {
      this.socket.emit('refresh', {})
    })
  }

  search(data) {
    console.log(data.target.value)
    this.userService.search(data.target.value).subscribe(data => {
    })
  }

}
