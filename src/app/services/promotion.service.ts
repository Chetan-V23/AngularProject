import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';
import { Observable, observable, of } from 'rxjs';
import {delay, filter} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor() { }

  getPromotions(): Observable<Promotion[]> {
   // return Promise.resolve(PROMOTIONS);
    return of(PROMOTIONS).pipe(delay(2000));
  }
  getPromotion(id: string): Observable<Promotion> {
    //return Promise.resolve(PROMOTIONS.filter((promo) => ( promo.id === id ))[0]);
    return of(PROMOTIONS.filter((promo)=>(promo.id==id))[0]);
  }
  getFeaturedPromotion(): Observable<Promotion> {
    //return Promise.resolve(PROMOTIONS.filter((promo) => ( promo.featured === true ))[0])
  return of(PROMOTIONS.filter((promo)=>(promo.featured==true))[0]);
  }
}
