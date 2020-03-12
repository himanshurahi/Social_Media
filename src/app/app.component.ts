import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import * as M from 'materialize-css'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService : AuthService){
    this.authService.autoAuthData()
  }
  title = 'chatappfinal';

}
