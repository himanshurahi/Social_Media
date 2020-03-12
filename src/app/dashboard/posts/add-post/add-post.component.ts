import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import io from 'socket.io-client'
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
  socket;
  posting;
  imagePrew;
  imageError;
  constructor(private postService: PostService) {
    this.socket = io(environment.api)
  }

  ngOnInit() {
  }

  FileSelected(event) {
    const file = event.target.files[0]
    console.log(file)
    const allowedType = ['image/png', 'image/jpg', 'image/jpeg']
    if (allowedType.includes(file.type)) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.imagePrew = reader.result
      }
      reader.onerror = function () {
        console.log(reader.error);
      };
      reader.readAsDataURL(file)

    } else {
      this.imageError = true
      console.log('Invalid Image')
    }
  }

  onSubmit(form: NgForm) {
    this.posting = true
    let body;
    let ImageHtml
    ImageHtml = <HTMLInputElement>document.getElementById('image')
    if (!this.imageError && this.imagePrew) {
      body = {
        ...form.value,
        'image': this.imagePrew
      }
    } else {
      body = {
        ...form.value,
      }
    }
    this.postService.savePost(body).subscribe(post => {
      form.reset()
      this.socket.emit('refresh', { data: 'refresh the posts' })
      this.posting = false
      ImageHtml.value = ""
      form.reset()
      console.log(post)
    }, error => {
      this.posting = false
      form.reset()
      ImageHtml.value = ""
      console.log(error)
    })
  }

}
