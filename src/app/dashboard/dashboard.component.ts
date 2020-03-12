import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import * as M from 'materialize-css'
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user
  constructor(private authService :  AuthService) { }

  ngOnInit() {
    this.authService.authStatus.subscribe(user => {
      this.user = user
    })

   
  }

 

}
