import { Component, OnInit } from '@angular/core';
import * as M from 'materialize-css'
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  Elem;
  constructor() { }

  ngOnInit() {
    var elems = document.querySelectorAll('.tabs');
    M.Tabs.init(elems, {swipeable : true, responsiveThreshold : Infinity});

    this.Elem = <any>document.getElementsByClassName('sidenav-overlay')
    for (let index = 0; index < this.Elem.length; index++) {
      this.Elem[index].style.display = 'none'
    }
  }

}
