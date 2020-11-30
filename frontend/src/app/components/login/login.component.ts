import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { LoginService } from '../../services/login/login.service'
import { ToastrService } from 'ngx-toastr';
import { Session } from '../../../environments/environment'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  stateCamera: boolean = false

  loginFG = new FormGroup({
    username: new FormControl(null, [
      Validators.required,
    ]),
    password: new FormControl(null,
      Validators.required
    )
  })

  trigger: Subject<void> = new Subject<void>();
  webcamImage: WebcamImage = null;

  constructor(
    private loginService: LoginService,
    private toastr: ToastrService,
    public session: Session,
    private router: Router
  ) {
    if(localStorage.getItem('token')){
      this.session.session = true
      this.router.navigate(['/students'])
    }
  }

  ngOnInit(): void {
  }

  loginPerUser() {
    if (this.loginFG.valid) {
      this.loginService.loginPerUser(this.loginFG.value).subscribe((res: any) => {
        this.toastr.success(res.message)
        localStorage.setItem('token', res.token)
        this.session.session = true
        this.router.navigate(['/students'])
      }, err => {
        this.toastr.error(err.error.message)
      })
    }
  }

  loginPerPhoto() {
    this.triggerSnapshot()
    this.loginService.loginPerPhoto({ photoBase64: this.webcamImage.imageAsDataUrl })
      .subscribe((res: any) => {
        this.toastr.success(res.message)
        localStorage.setItem('token', res.token)
        this.session.session = true
        this.router.navigate(['/students'])
      }, err => {
        this.toastr.error(err.error.message)
      })
  }

  get userFC() {
    return this.loginFG.get('username');
  }
  get passwordFC() {
    return this.loginFG.get('password');
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public handleInitError(error: WebcamInitError): void {
    //console.log(error);
  }

}
