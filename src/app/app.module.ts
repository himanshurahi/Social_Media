import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './dashboard/header/header.component';
import { SidebarComponent } from './dashboard/sidebar/sidebar.component';
import { PostsComponent } from './dashboard/posts/posts.component';
import { AddPostComponent } from './dashboard/posts/add-post/add-post.component'
import { AuthInterceptor } from './services/authInterceptor';
import { CommentsComponent } from './dashboard/comments/comments.component';
import { PeopleComponent } from './dashboard/people/people.component';
import { FollowingComponent } from './dashboard/following/following.component';
import { FollowersComponent } from './dashboard/followers/followers.component';
import { NotificationsComponent } from './dashboard/notifications/notifications.component';
import { ChatComponent } from './dashboard/chat/chat.component';
import { MessageComponent } from './dashboard/chat/message/message.component';
import { ImagesComponent } from './dashboard/images/images.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ViewUserComponent } from './dashboard/view-user/view-user.component';
import { ChangePasswordComponent } from './dashboard/change-password/change-password.component';
import { LoaderComponent } from './dashboard/loader/loader.component';
import { NgxAutoScrollModule } from "ngx-auto-scroll";

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    PostsComponent,
    AddPostComponent,
    CommentsComponent,
    PeopleComponent,
    FollowingComponent,
    FollowersComponent,
    NotificationsComponent,
    ChatComponent,
    MessageComponent,
    ImagesComponent,
    ViewUserComponent,
    ChangePasswordComponent,
    LoaderComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FileUploadModule,
    NgxAutoScrollModule

  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
