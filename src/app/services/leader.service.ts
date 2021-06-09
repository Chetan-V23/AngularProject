import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import {Leader } from '../shared/leader';
import {LEADERS} from '../shared/leaders';
import {delay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }
  getLeaders():Observable<Leader[]>{
    return of(LEADERS).pipe(delay(2000));
  }

  getFeaturedLeader( ):Observable<Leader>{
    //return Promise.resolve(LEADERS.filter((ldr)=>(ldr.featured))[0]);
    return of(LEADERS.filter((ldr)=>(ldr.featured))[0]);
  }
}
