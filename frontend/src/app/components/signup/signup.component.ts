import { Component, OnInit, createPlatformFactory } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignupService } from '../../services/signup/signup.service';
import { ToastrService } from 'ngx-toastr';
import { Session } from '../../../environments/environment'
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  singupform: FormGroup;
  private trigger: Subject<void> = new Subject<void>();
  public webcamImage: WebcamImage = null;
  formErrors = {
    username: '',
    password: '',
    password1: '',
  };
  validationMessages = {
    username: {
      required: 'Se requiere de un username',
      minlength: 'El username debe tener como minimo 5 caracteres',
    },
    password: {
      required: 'Se requiere de un password',
      minlength: 'El password debe tener como minimo 8 caracteres',
    },
    password1: {
      required: 'Se requiere de un password de confirmacion',
      minlength:
        'El password de confirmacion debe tener como minimo 8 caracteres',
    },
  };

  constructor(
    private fb: FormBuilder,
    private ss: SignupService,
    private toastr: ToastrService,
    public session: Session,
    private router: Router) {
    this.createforms();
    if(localStorage.getItem('token')){
      this.router.navigate(['/students'])
    }
  }

  ngOnInit(): void {}

  createforms(): void {
    this.singupform = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password1: ['', [Validators.required, Validators.minLength(8)]],
      screenshot: [''],
    });
    this.singupform.valueChanges.subscribe((data) => {
      this.onValueChanged(data);
    });
    this.onValueChanged();
  }

  onValueChanged(data?): void {
    if (!this.singupform) {
      return;
    }
    const form = this.singupform;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  signup(): void {
    this.ss.postuser(this.singupform.value).subscribe((data) => {
      this.toastr.success("Registro completo!")
        localStorage.setItem('token', this.singupform.value.username)
        this.session.session = true
        this.router.navigate(['/students'])
    }, err => {
      this.toastr.error("No se pudo completar el Registro.")
    });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.singupform.controls['screenshot'].setValue(webcamImage.imageAsDataUrl);
    this.webcamImage = webcamImage;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public handleInitError(error: WebcamInitError): void {
    console.log(error);
  }
}
