import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../../services/students/students.service'
import { Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  idFC = new FormControl(null, [
    Validators.required,
  ])

  files: File[] = [];
  students: any[] = [];

  constructor(
    private studentService: StudentsService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.list()
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);
  }
   
  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  register() {
    if(!this.idFC.valid){
      this.toastr.error("Se necesita que ingrese un Identificador")
      return
    }
    if(this.files.length == 0){
      this.toastr.error("Se necesita que ingrese una Fotografia")
      return
    }
    if(this.files.length > 1){
      this.toastr.error("Unicamente se puede subir una imagen a la vez")
      return
    }
    var r = new FileReader()
    var f = r.readAsDataURL(this.files[0])
    r.onload = function l(){
      this.send(r.result)
    }.bind(this);
  }

  send(base64: any){
    this.studentService.post({id: this.idFC.value, photoBase64: base64})
    .subscribe((data: any) => {
      this.toastr.success(data.message)
      this.list()
      this.files = []
      this.idFC.reset()
    }, err => {
      this.toastr.error(err.error.message)
      //console.log(err)
    })
  }

  list() {
    this.studentService.getAll().subscribe((data: any) => {
      this.students = data
    }, err => {
      this.toastr.error(err.error, "Imposible recuperar a los Estudiantes.")
    })
  }

}
