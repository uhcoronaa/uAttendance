import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { baseURL } from '../../shared/baseURL';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get(baseURL+'students')
  }

  post(student: any){
    return this.http.post(baseURL+'students/insert',student)
  }
}
