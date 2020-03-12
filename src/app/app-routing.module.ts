import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './authGuard/auth.guard';
import { AuthComponent } from './auth/auth.component';
import { CommentsComponent } from './dashboard/comments/comments.component';
import { PeopleComponent } from './dashboard/people/people.component';
import { FollowingComponent } from './dashboard/following/following.component';
import { FollowersComponent } from './dashboard/followers/followers.component';
import { NotificationsComponent } from './dashboard/notifications/notifications.component';
import { ChatComponent } from './dashboard/chat/chat.component';
import { ImagesComponent } from './dashboard/images/images.component';
import { ViewUserComponent } from './dashboard/view-user/view-user.component';
import { ChangePasswordComponent } from './dashboard/change-password/change-password.component';


const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', component: AuthComponent },
  { path: 'post/:id', component: CommentsComponent, canActivate : [AuthGuard] },
  { path: 'people', component: PeopleComponent, canActivate : [AuthGuard] },
  { path: 'following', component: FollowingComponent,canActivate : [AuthGuard] },
  { path: 'followers', component: FollowersComponent,canActivate : [AuthGuard] },
  { path: 'notifications', component: NotificationsComponent,canActivate : [AuthGuard] },
  { path: 'chat/:username', component: ChatComponent,canActivate : [AuthGuard] },
  { path: 'images', component: ImagesComponent, canActivate: [AuthGuard] },
  { path: ':name', component: ViewUserComponent, canActivate : [AuthGuard] },
  { path: 'account/change_password', component: ChangePasswordComponent, canActivate : [AuthGuard] },
  { path: "**", redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
