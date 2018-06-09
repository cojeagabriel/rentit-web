import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap';
import { ReviewService } from '../../../services/review.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-rate-modal',
  templateUrl: './rate-modal.component.html',
  styleUrls: ['./rate-modal.component.scss']
})
export class RateModalComponent implements OnInit {

  message: String;
  _userId: String;
  userFirstName: String;
  userLastName: String;
  _productId: String;
  form: FormGroup;
  currentRate = 0;

  ctrl = new FormControl(null, Validators.required);

  constructor(
    private formBuilder: FormBuilder,
    config: NgbRatingConfig,
    public bsModalRef: BsModalRef,
    public reviewService: ReviewService
  ) { 
    config.max = 5;
  }

  ngOnInit() {
    this.form = this.createForm();
  }

  createForm() {
    return this.formBuilder.group({
      _userId: '',
      userFirstName: '',
      userLastName: '',
      _productId: '',
      rating: null,
      review: this.formBuilder.control('', Validators.compose([Validators.required, Validators.maxLength(10000)])),
      title: this.formBuilder.control('', Validators.compose([Validators.minLength(3), Validators.maxLength(50)])),
      dateYear: null,
      dateMonth: null,
      dateDay: null
    });
  }

  sendReview(){
    var today = moment(new Date());
    if (this.form.valid && this.currentRate) {
      this.form.patchValue({
        _userId: this._userId,
        userFirstName: this.userFirstName,
        userLastName: this.userLastName,
        _productId: this._productId,
        rating: this.currentRate,
        dateYear: today.year(),
        dateMonth: today.month(),
        dateDay: today.date()
      });
      this.reviewService.create(this.form.value)
        .catch(err => {
          return Observable.throw(new Error(`${err.status} ${err.msg}`));
        })
        .subscribe(review => {
          this.bsModalRef.hide();
        })
    }
  }

  toggle() {
    if (this.ctrl.disabled) {
      this.ctrl.enable();
    } else {
      this.ctrl.disable();
    }
  }

  hide(){
    this.bsModalRef.hide();
  }

}

  
