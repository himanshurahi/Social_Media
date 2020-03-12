import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import * as M from 'materialize-css'
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private userService :  UserService) { }

  ngOnInit() {
  }

  onSubmit(form : NgForm){
    this.userService.changePassword(form.value).subscribe((data:any) => {
      M.toast({ html: data.msg })
      form.reset()
    }, error => {
      M.toast({ html: error.error.error_msg })
    })
  }

}
