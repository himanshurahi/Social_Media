import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import * as M from 'materialize-css'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.loader.subscribe(data => {
      this.loading = data
    })
  }
  onSubmit(form: NgForm) {

    this.authService.loginUser(form.value)

    this.authService.authStatus.subscribe(user => {

      this.router.navigate(['/dashboard'])
      form.reset()
    })
  }

}
