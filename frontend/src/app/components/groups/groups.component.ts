import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services/groups/groups.service'
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  idFC = new FormControl(null, [
    Validators.required,
  ])

  files: File[] = [];
  groups: any[] = [];

  constructor(
    private groupService: GroupsService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {
    this.idFC.setValue(this.datePipe.transform(new Date(),'dd-MM-yyyy'))
  }

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
    if(this.idFC.invalid){
      this.toastr.error("Se necesita que ingrese un identificador")
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
    this.groupService.post({id: this.idFC.value, photoBase64: base64})
    .subscribe((data: any) => {
      this.toastr.success(data.message)
      this.list()
      this.files = []
    }, err => {
      this.toastr.error(err.error.message)
      //console.log(err)
    })
  }

  list() {
    this.groupService.getAll().subscribe((data: any) => {
      this.groups = data
    }, err => {
      this.toastr.error(err.error, "Imposible recuperar a los Estudiantes.")
    })
  }

}
