import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import * as  M from 'materialize-css'
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  loading = false
  constructor(private authService: AuthService, private router : Router) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.loading = true
    this.authService.registerUser(form.value).subscribe(user => {
      form.reset()
      this.loading = false
      M.toast({ html: 'You Can Login Now' })
      // this.router.navigate(['/'])
    }, error => {
      this.loading = false
      const Error = error.error.errors ? error.error.errors[0].msg : error.error.error_msg
      M.toast({ html: Error })
    })
  }

}
