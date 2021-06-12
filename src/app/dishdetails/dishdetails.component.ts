import { Component, OnInit, ViewChild , Inject} from '@angular/core';
import {Dish} from '../shared/dish'
import { Params,ActivatedRoute } from '@angular/router';
import { Location }from '@angular/common';
import {DishService} from '../services/dish.service';
import {switchMap} from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Comment} from '../shared/comment';

@Component({
  selector: 'app-dishdetails',
  templateUrl: './dishdetails.component.html',
  styleUrls: ['./dishdetails.component.scss']
})
export class DishdetailsComponent implements OnInit {

  @ViewChild('fform') commentFormDirective;

  commentForm!: FormGroup;

  formErrors = {
    'name': '',
    'comment':'',
  };
  validationMessages = {
    'name': {
      'required':      'Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
    },
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
  };


  dish!:Dish;
  dishIds!:string[];
  prev!:string;
  next!:string;
  date!:string;
  errMess?:string;
  dishcopy!:Dish;
  constructor( private dishService:DishService, private location:Location, private route:ActivatedRoute, private fb: FormBuilder, @Inject('BaseURL') public BaseURL) {
    this.createForm();
   }

  ngOnInit(): void {
    
    this.dishService.getDishIds().subscribe((dishIds)=>this.dishIds=dishIds)
    
     this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
     .subscribe(dish => { this.dish = dish; this.dishcopy=dish, this.setPrevNext(dish.id); },errmess=>this.errMess=<any>errmess);

     

   // this.route.params.subscribe(params=>{this.dishService.getDish(params['id'])}).add(dish=>{this.dish=dish;this.setPrevNext(dish.id);})
    
    // this.dishService.getDish(id.toString()).subscribe((dish)=>this.dish=dish);
  }

  createForm(){
    this.commentForm = this.fb.group({
      name: ['',[Validators.required,Validators.minLength(2), Validators.maxLength(25)]],
      comment: ['',[Validators.required]],
      rating:['5',[Validators.required]],
    });
    this.commentForm.valueChanges.subscribe(data=>this.onValueChanged(data));

    this.onValueChanged();
  }


  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
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

  setPrevNext(dishId:string){
    const index=this.dishIds!.indexOf(dishId);
    this.prev=this.dishIds[(this.dishIds!.length+index-1)%this.dishIds.length]
    this.next=this.dishIds[(this.dishIds!.length+index+1)%this.dishIds.length]
  }

  goBack():void{
    this.location.back();
  }
  onSubmit(){
    var months=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October','November','December'];
    var today=new Date();
    this.date=months[today.getMonth()]+' '+today.getDate().toString()+','+today.getFullYear().toString();
    var comment=new Comment();
    var value=this.commentForm.value
    comment.rating=value.rating;
    comment.author=value.name;
    comment.comment=value.comment;
    comment.date=this.date;
    this.dishcopy.comments.push(comment);
    this.dishService.putDish(this.dishcopy).subscribe(dish=>{
      this.dish=dish; this.dishcopy=dish;
    },
    errMess=>{
      this.dish!=null; this.dishcopy!=null; this.errMess=<any> errMess;
    });

    this.commentForm.reset({
      name:'',
      comment:'',
      rating:'5',
    })

    this.commentFormDirective.resetForm();
  }
}
