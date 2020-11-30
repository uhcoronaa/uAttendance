import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services/groups/groups.service';
import { StudentsService } from '../../services/students/students.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {
  items = [];
  students = [];

  constructor(
    private groupService: GroupsService,
    private studentService: StudentsService
  ) {}

  ngOnInit(): void {
    this.groupService.getAll().subscribe(
      (data: any) => {
        this.items = data;
      },
      (err) => {}
    );
    this.studentService.getAll().subscribe((data: any) => {
      this.students = data;
    });
  }

  asistio(group, identifier) {
    console.log(group)
    for (var i = 0; i < group.matches.length; i++) {
      if (group.matches[i] == identifier) {
        return 'Asistio';
      }
    }
    return 'No Asistio';
  }
}
