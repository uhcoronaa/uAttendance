import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { StudentsComponent } from './components/students/students.component';

import { AttendanceComponent } from './components/attendance/attendance.component';

import { AuthGuard } from './guards/auth.guard';
import { GroupsComponent } from './components/groups/groups.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'students',
    component: StudentsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'groups',
    component: GroupsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'attendance',
    component: AttendanceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '*',
    redirectTo: "",
    //canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
