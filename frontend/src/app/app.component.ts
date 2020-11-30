import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../environments/environment'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'uAttendance';

  constructor(
    public session: Session,
    private router: Router
  ){
    if(localStorage.getItem('token')){
      this.session.session = true
    }
  }

  logout(){
    localStorage.removeItem('token')
    this.session.session = false
    this.router.navigate(['/'])
  }
}
