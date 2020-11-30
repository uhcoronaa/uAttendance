import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { ToastrModule } from 'ngx-toastr';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { StudentsComponent } from './components/students/students.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { GroupsComponent } from './components/groups/groups.component';
import { DatePipe } from '@angular/common';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { HomeComponent } from './components/home/home.component';
import { Session } from '../environments/environment'

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    StudentsComponent,
    GroupsComponent,
    AttendanceComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    WebcamModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxDropzoneModule,
  ],
  providers: [
    DatePipe,
    Session,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
