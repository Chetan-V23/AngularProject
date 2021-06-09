import { Component, OnInit } from '@angular/core';
import {Dish} from '../shared/dish'
import { Params,ActivatedRoute } from '@angular/router';
import { Location }from '@angular/common';
import {DishService} from '../services/dish.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-dishdetails',
  templateUrl: './dishdetails.component.html',
  styleUrls: ['./dishdetails.component.scss']
})
export class DishdetailsComponent implements OnInit {


  dish!:Dish;
  dishIds!:string[];
  prev!:string;
  next!:string;
  constructor( private dishService:DishService, private location:Location, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.dishService.getDishIds().subscribe((dishIds)=>this.dishIds=dishIds)
    
     this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
     .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });

   // this.route.params.subscribe(params=>{this.dishService.getDish(params['id'])}).add(dish=>{this.dish=dish;this.setPrevNext(dish.id);})
    
    // this.dishService.getDish(id.toString()).subscribe((dish)=>this.dish=dish);
  }

  setPrevNext(dishId:string){
    const index=this.dishIds!.indexOf(dishId);
    this.prev=this.dishIds[(this.dishIds!.length+index-1)%this.dishIds.length]
    this.next=this.dishIds[(this.dishIds!.length+index+1)%this.dishIds.length]
  }

  goBack():void{
    this.location.back();
  }

}
