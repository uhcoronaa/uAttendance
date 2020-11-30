import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { baseServerless } from '../../shared/baseURL';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get(baseServerless + 'groups')
  }

  post(group: any){
    return this.http.post(baseServerless + 'groups/insert',group)
  }
}
