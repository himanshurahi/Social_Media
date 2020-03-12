import { Component, OnInit, AfterViewInit, Input, OnChanges, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked, SimpleChange, AfterContentChecked, DoCheck, AfterContentInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import io from 'socket.io-client'
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewInit, DoCheck {
  username;
  Ruser;
  messages;
  socket;
  noMessageError;
  loggedInUser;
  typing = false
  rec;
  typingMessage
  MyScroll;
  // scroll
  @Output() isTyping = new EventEmitter()
  @Input() users;
  // @ViewChild('scrollme', { static: false }) MyScroll: ElementRef
  constructor(private messageService: MessageService, private authService: AuthService, private userService: UserService, private route: ActivatedRoute, private router: Router) {
    this.socket = io(environment.api)
  }

  ngOnInit() {
    this.scrollToBottom();
    this.MyScroll = document.querySelector('.srollme')
    // this.username = this.route.snapshot.paramMap.get('username')
    this.route.paramMap.subscribe((data: any) => {
      this.username = data.params.username

      this.getUser()
    })
    this.loggedInUser = this.authService.getUser()



    this.socket.on('refreshPage', data => {
      this.getAllMessage(this.Ruser._id)
    })

    this.socket.on('is_typing', data => {
      if (data.receiver != this.username)
        this.typing = true
      this.isTyping.emit({ data, isTyping: true })
    })

    this.socket.on('stoped_typing', data => {
      if (data.receiver != this.username)
        this.isTyping.emit({ data, isTyping: false })
      this.typing = false
    })

  }

  // ngOnChanges() {
  //   console.log(this.users)

  // }

  getUser() {
    this.userService.getUserByName(this.username).subscribe(user => {
      if (!user) {
        return this.router.navigate(['/dashboard'])
      }
      this.Ruser = user
      this.getAllMessage(this.Ruser._id)
    })
  }

  getAllMessage(rid) {
    this.messageService.getAllMessage(this.Ruser._id).subscribe(msg => {

      this.messages = msg
    })
  }

  onSubmit(form: NgForm) {
    this.messageService.sendMessage(this.Ruser._id, form.value).subscribe(data => {
      this.socket.emit('refresh', {})
      form.reset()
    })

  }

  onTyping() {
    this.socket.emit('starts_typing', {
      sender: this.loggedInUser.user.username,
      receiver: this.username
    })

    if (this.typingMessage) {
      clearTimeout(this.typingMessage)
    }

    this.typingMessage = setTimeout(() => {
      this.socket.emit('stop_typing', {
        sender: this.loggedInUser.user.username,
        receiver: this.username
      })
    }, 3000)
  }



  ngAfterViewInit() {
    const params = {
      room1: this.loggedInUser.user.username,
      room2: this.username
    }

    this.socket.emit('join_chat', params)

    // this.scrollToBottom();  
  }



  ngDoCheck() {
    this.scrollToBottom();
  }


  scrollToBottom(): void {
    try {
      this.MyScroll.scrollTop = this.MyScroll.scrollHeight;
    } catch (err) { }
  }




}
