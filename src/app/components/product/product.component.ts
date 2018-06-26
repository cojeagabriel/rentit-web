import { AuthService } from './../../services/auth.service';
import { ImageService } from 'app/image.service';
import { ReviewService } from './../../services/review.service';
import { CommentService } from './../../services/comment.service';
import { OrderService } from './../../services/order.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './../../services/user.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, SimpleChanges, ViewChildren, QueryList } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../types/product';
import { switchMap } from 'rxjs/operators';
import { tap } from 'rxjs/operators/tap';
import { User } from '../../types/user';
import { NgbDateStruct, NgbCalendar, NgbDatepickerConfig, NgbDateParserFormatter, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import { BsModalService } from 'ngx-bootstrap';
import { RentModalComponent } from './rent-modal/rent-modal.component';
import { Order } from '../../types/order';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { NavigationEvent } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-view-model';
import * as moment from 'moment';
import { Comment } from '../../types/comment';
import { Review } from '../../types/review';
import { RateModalComponent } from './rate-modal/rate-modal.component';
import { Subscription } from 'rxjs';
import { LoginModalComponent } from '../login-modal/login-modal.component';


const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [NgbDatepickerConfig]
})

export class ProductComponent implements OnInit {
  [x: string]: any;

  user: User | null;
  me: User;
  product: Product;
  product$: any;
  user$: Observable<User>;
  userSubscribe: Subscription;
  authenticated: any;

  formComments: FormGroup;
  comments: Comment[];
  isCollapsed = true;
  reviews: Review[];
  rating: number;
  reviewd = false;
  stars5 = 0;
  stars4 = 0;
  stars3 = 0;
  stars2 = 0;
  stars1 = 0;

  hoveredDate: NgbDateStruct;

  today: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  from: Date;
  to: Date;
  count: any;
  quantity: number;
  one_day = 1000 * 60 * 60 * 24;
  one_hour = 1000 * 60 * 60;

  fromTime: NgbTimeStruct = { hour: 14, minute: 0, second: 0 };
  toTime: NgbTimeStruct = { hour: 14, minute: 0, second: 0 };
  hourStep = 1;
  minuteStep = 15;

  order: Order = {
    _rentorId: null,
    _clientId: null,
    _productId: null,
    quantity: null,
    fromDateYear: null,
    fromDateMonth: null,
    fromDateDay: null,
    fromDateHour: null,
    fromDateMinute: null,
    toDateYear: null,
    toDateMonth: null,
    toDateDay: null,
    toDateHour: null,
    toDateMinute: null,
    status: null
  };

  orders: Order[];
  points: any;
  intervals: any;
  disabledDates = [
    new Date(2017, 5, 13)];
  maxim: number;

  images: String[] = [];
  currentUrl: String = 'http://placehold.it/400x400?text=No+preview';

  constructor(
    private modalService: BsModalService,
    private productService: ProductService,
    private userService: UserService,
    private authService: AuthService,
    private commentService: CommentService,
    private reviewService: ReviewService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    calendar: NgbCalendar,
    config: NgbDatepickerConfig,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private imageService: ImageService,
  ) {
    this.today = calendar.getToday();
    config.minDate = { year: this.today.year, month: this.today.month, day: this.today.day };
    this.quantity = 1;
    this.formComments = this.createFormComments();
  }

  ngOnInit() {

    this.product$ = this.activatedRoute.params.pipe(
      switchMap(params => {
        return this.productService.getById(params.id)
      })
    );
    this.product$.subscribe(product =>{
      this.product = product[0];
      this.getImageUrl();
      if(this.product)
        this.currentUrl = this.imageService.getImageUrl(this.product.images[0]);

      this.commentService.getCommentsByProductId(this.product._id)
        .catch(err => {
          return Observable.throw(new Error(`${err.status} ${err.msg}`));
        })
        .subscribe(comments => {
          this.comments = comments.reverse();
        });

      this.reviewService.getReviewsByProductId(this.product._id)
        .catch(err => {
          return Observable.throw(new Error(`${err.status} ${err.msg}`));
        })
        .subscribe(reviews => {
          this.reviews = reviews.reverse();
          this.calculateRating();
        });

      this.formComments.patchValue({
        _productId: this.product._id
      });

      this.periodCount();
      this.userService.getById(this.product._ownerId)
        .catch(err => {
          return Observable.throw(new Error(`${err.status} ${err.msg}`));
        })
        .subscribe(user =>{
          this.user = user[0];

          this.orderService.getOrdersByProductId(this.product._id)
            .catch(err => {
              return Observable.throw(new Error(`${err.status} ${err.msg}`));
            })
            .subscribe(orders => {
              this.orders = orders;
              let points = [];

              this.orders.forEach(order => {
                if (order.status == 'reserved' || order.status == 'started') {
                  var t = new Date();
                  t.setHours(0,0,0,0);
                  var today = moment(t);
                  var from = moment(new Date(order.fromDateYear, order.fromDateMonth-1, order.fromDateDay));
                  var to = moment(new Date(order.toDateYear, order.toDateMonth-1, order.toDateDay));
                  var c = from.diff(today, 'days');
                  points.push({ node: c, count: order.quantity });
                  var c = to.diff(today, 'days');
                  points.push({ node: c, count: -order.quantity });
                }
              });

              function compare(a, b) {
                if (a.node > b.node) return 1;
                else if (a.node < b.node) return -1;
                else
                  if(a.count >= b.count) return -1;
                  else return 1;
              }
              points.sort(compare);

              this.points = points;

              this.buildIntervals();

              this.calculateIntervals();
              this.calculateIsDisabled();
            });
        });
    });

    this.user$ = this.userService.me$;
    this.userSubscribe = this.authService.authenticated()
      .switchMap(authenticated => {
        if (authenticated) {
          return this.userService.getMe();
        } else {
          return Observable.of(null);
        }
      })
      .subscribe(user => {
        this.me = user;
        if(user){
          this.authenticated = true;
          this.formComments.patchValue({
            _senderId: this.me._id,
            senderFirstName: this.me.firstName,
            senderLastName: this.me.lastName
          });
        }
      });
  }

  calculateRating(){
    let sum = 0;
    this.stars1 = 0;
    this.stars2 = 0;
    this.stars3 = 0;
    this.stars4 = 0;
    this.stars5 = 0;
    this.reviews.forEach(rev => {
      sum += rev.rating;
      if(this.me._id == rev._userId){
        this.reviewd = true;
      }
      switch (rev.rating) {
        case 5:
          this.stars5++;
          break;
        case 4:
          this.stars4++;
          break;
        case 3:
          this.stars3++;
          break;
        case 2:
          this.stars2++;
          break;
        case 1:
          this.stars1++;
          break;

        default:
          break;
      }
    });
    this.rating = sum/this.reviews.length;
  }

  createFormComments() {
    return this.formBuilder.group({
      _senderId: '',
      senderFirstName: '',
      senderLastName: '',
      _productId: '',
      comment: this.formBuilder.control('', Validators.compose([Validators.required, Validators.maxLength(10000)])),
      dateYear: null,
      dateMonth: null,
      dateDay: null
    });
  }

  showRateModal(){
    if(this.authenticated){
      const modalRef = this.modalService.show(RateModalComponent, {
        initialState: {
          message: "Share your opinion!",
          _userId: this.me._id,
          userFirstName: this.me.firstName,
          userLastName: this.me.lastName,
          _productId: this.product._id
        }
      });
      const modalContent = modalRef.content as RateModalComponent;
      modalContent.onResponse.subscribe(res => {
        if(res){
          this.reviewService.getReviewsByProductId(this.product._id)
            .catch(err => {
              return Observable.throw(new Error(`${err.status} ${err.msg}`));
            })
            .subscribe(reviews => {
              this.reviews = reviews.reverse();
              this.calculateRating();
              this.product.rating = this.rating;
              this.productService.update(this.product, this.product._id)
                .catch(err => {
                  return Observable.throw(new Error(`${err.status} ${err.msg}`));
                })
                .subscribe(() => {
                });
            });
        }
      });
    }
    else{
      this.modalService.show(LoginModalComponent);
    }
  }

  postComment() {
    if(this.authenticated){
      var t = new Date();
      var today = moment(t);
      if (this.formComments.valid) {
        this.formComments.patchValue({
          dateYear: today.year(),
          dateMonth: today.month(),
          dateDay: today.date()
        });
        this.commentService.create(this.formComments.value)
          .catch(err => {
            return Observable.throw(new Error(`${err.status} ${err.msg}`));
          })
          .subscribe(comment => {
          });
        this.commentService.getCommentsByProductId(this.product._id)
          .catch (err => {
            return Observable.throw(new Error(`${err.status} ${err.msg}`));
          })
          .subscribe(comments => {
            this.comments = comments.reverse();
          });
      }
    }
    else{
      this.modalService.show(LoginModalComponent);
    }
  }

  isDisabled = (date: NgbDateStruct) => {
    const d = new Date(date.year, date.month - 1, date.day);
    var idx = this.disabledDates.map(Number).indexOf(+d);
    return idx != -1;
  }


  buildIntervals(): void{
    var intervals = [];
    var s = 0;
    var last = {
      node: 0,
      count: 0
    }
    var i, j;
    if(this.points.length)
      last={node: this.points[0].node, count: this.points[0].count};
    i=1;
    while(i < this.points.length){
      if(this.points[i].count > 0){
        while (this.points[i].node == last.node && this.points[i].count > 0) {
          last.count += this.points[i].count;
          i++;
        }
        if (this.points[i].node == last.node) {
          s=0;
          while (this.points[i].node == last.node && this.points[i].count < 0) {
            s += this.points[i].count;
            i++;
          }
          intervals.push({ start: last.node, end: last.node, count: last.count });
          last = {node: last.node+1, count: last.count+s};
        }
        else if (this.points[i].count > 0){
          intervals.push({ start: last.node, end: this.points[i].node - 1, count: last.count });
          last = { node: this.points[i].node, count: last.count};
        }
        else if (this.points[i].count < 0){
          s = this.points[i].count;
          i++;
          while (i < this.points.length && this.points[i].node == this.points[i-1].node) {
            s += this.points[i].count;
            i++;
          }
          intervals.push({ start: last.node, end: this.points[i-1].node, count: last.count });
          last = { node: this.points[i-1].node + 1, count: last.count + s};
        }

      }
      else{
        s = this.points[i].count;
        i++;
        while (i < this.points.length && this.points[i].node == this.points[i-1].node && this.points[i].count < 0) {
          s += this.points[i].count;
          i++;
        }
        intervals.push({ start: last.node, end: this.points[i-1].node, count: last.count });
        last = { node: last.node + 1, count: last.count + s };
      }

    }
    this.intervals = intervals;
  }

  calculateIntervals(): void{
    this.intervals.forEach(interval => {
      for (var i = interval.start; i <= interval.end; i++)
        if (this.product.quantity - interval.count < this.quantity) {
          var t = new Date();
          t.setHours(0, 0, 0, 0);
          var disabledDate = moment(t);
          disabledDate.add(i,'day');
          this.disabledDates.push(disabledDate.toDate());
        }
    });
  }

  calculateIsDisabled(): void{
    this.isDisabled = (date: NgbDateStruct) => {
      const d = new Date(date.year, date.month - 1, date.day);
      var idx = this.disabledDates.map(Number).indexOf(+d);
      return idx != -1;
    }
  }

  calculateIntersection(from: NgbDateStruct, to: NgbDateStruct): boolean{
    let parsedFrom = moment(this.ngbDateParserFormatter.format(from));
    let parsedTo = moment(this.ngbDateParserFormatter.format(to));
    let t = new Date();
    t.setHours(0, 0, 0, 0);
    let today = moment(t);
    let node1 = parsedFrom.diff(today, 'days');
    let node2 = parsedTo.diff(today, 'days');
    this.maxim = 0;
    let ok = true;
    this.intervals.forEach(interval => {
      if ((interval.start >= node1 && interval.start <= node2) || (interval.end >= node1 && interval.end <= node2))
        if(interval.count > this.maxim)
          this.maxim = interval.count;
      if ((this.product.quantity - this.quantity < interval.count) && ((interval.start >= node1 && interval.start <= node2) || (interval.end >= node1 && interval.end <= node2)))
        ok = false;
    });
    return ok;
  }

  revertFromDate(newValue) {
    let parsedFrom = moment(this.ngbDateParserFormatter.format(this.fromDate));
    let t = new Date();
    t.setHours(0, 0, 0, 0);
    let today = moment(t);
    let c = parsedFrom.diff(today, 'days');

    if(c<0){
      this.fromDate = null;
    }
    let ok = true;
    this.intervals.forEach(interval => {
      if ((this.product.quantity - this.quantity < interval.count) && (c >= interval.start && c <= interval.end))
        ok = false;
    });
    if(!ok)
      this.fromDate = null;
  }

  revertToDate(newValue) {
    if(!this.fromDate){
      this.toDate = null;
    }
    else{
      let parsedFrom = moment(this.ngbDateParserFormatter.format(this.fromDate));
      let parsedTo = moment(this.ngbDateParserFormatter.format(this.toDate));
      let t = new Date();
      t.setHours(0, 0, 0, 0);
      let today = moment(t);
      let c = parsedTo.diff(today, 'days');

      if (c < 0) {
        this.toDate = null;
      }
      if (parsedTo.diff(parsedFrom, 'days') < 0) {
        this.toDate = this.fromDate;
      }

      let c2 = parsedFrom.diff(today, 'days');
      let ok = true;
      this.intervals.forEach(interval => {
        if ((this.product.quantity - this.quantity < interval.count) && (c >= interval.start && c <= interval.end))
          ok = false;
        if ((this.product.quantity - this.quantity < interval.count) && ((interval.start >= c2 && interval.start <= c) || (interval.end >= c2 && interval.end <= c)))
          ok = false;
      });
      if (!ok)
        this.toDate = null;
    }
  }

  onNavigateEvent(event: NavigationEvent) {

    this.calculateIsDisabled();

    switch (event) {
      case NavigationEvent.PREV:
        this._service.open(this._calendar.getPrev(this.model.firstDate, 'm', 1));
        break;
      case NavigationEvent.NEXT:
        this._service.open(this._calendar.getNext(this.model.firstDate, 'm', 1));
        break;
    }
  }

  onDateSelection(date: NgbDateStruct) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && this.isAfterOrSame(date, this.fromDate)) {
      this.toDate = date;
      if(this.calculateIntersection(this.fromDate, this.toDate)==false){
        this.toDate = null;
        this.fromDate = null;
      }
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    this.intervalIntersect();
    this.periodCount();
  }

  intervalIntersect(){
    var t = new Date();
    t.setHours(0, 0, 0, 0);
    var today = moment(t);
    var from = moment(new Date(this.from));
    var to = moment(new Date(this.to));
    var c = from.diff(today, 'days');
  }

  private isAfterOrSame(one: NgbDateStruct, two: NgbDateStruct) {
    if (!one || !two) {
      return false;
    }

    let parsedFrom = this.ngbDateParserFormatter.format(one);
    let parsedTo = this.ngbDateParserFormatter.format(two);
    if (moment(parsedFrom).isAfter(parsedTo) || moment(parsedFrom).isSame(parsedTo)) {
      return true;
    }

    return false;
  }

  periodCount():void{
    this.from = new Date(this.ngbDateParserFormatter.format(this.fromDate));
    this.to = new Date(this.ngbDateParserFormatter.format(this.toDate));
    if(this.product.pricePer=='Day'){
      var from = moment(this.from);
      var to = moment(this.to);
      var t = new Date();
      t.setHours(0, 0, 0, 0);
      var today = moment(t);
      this.count = to.diff(from, 'days') + 1;
      // this.count = (this.to.getTime() - this.from.getTime()) / this.one_day ;
    }
    else if (this.product.pricePer =='Hour'){
      this.count = (this.to.getTime() - this.from.getTime()) / this.one_hour;
    }
    else{
      this.count = 0;
    }
  }

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);


  doSomething(newValue){
    if(newValue > this.product.quantity)
      this.quantity = this.product.quantity;
    if(parseInt(newValue) < 1)
      this.quantity = 1;
  }

  quantityPlus(): void {
    if (this.quantity < this.product.quantity)
        this.quantity= this.quantity + 1
    

    this.disabledDates = [];

    this.calculateIntervals();
    this.calculateIsDisabled();
    if(this.calculateIntersection(this.fromDate, this.toDate)==false){
        this.toDate = null;
        this.fromDate = null;
      }
  }

  quantityMinus(): void {
    if (this.quantity > 1) {
        this.quantity= this.quantity - 1
    }

    this.disabledDates = [];

    this.calculateIntervals();
    this.calculateIsDisabled();
    if(this.calculateIntersection(this.fromDate, this.toDate)==false){
        this.toDate = null;
        this.fromDate = null;
      }
  }

  showRentModal() {
    if(this.authenticated == true){
      if(this.fromDate && this.toDate){
        this.order._rentorId = this.product._ownerId;
        this.order._clientId = this.me._id;
        this.order._productId = this.product._id;
        this.order.quantity = this.quantity;
        this.order.fromDateYear = this.fromDate.year;
        this.order.fromDateMonth = this.fromDate.month;
        this.order.fromDateDay = this.fromDate.day;
        this.order.fromDateHour = this.fromTime.hour;
        this.order.fromDateMinute = this.fromTime.minute;
        this.order.toDateYear = this.toDate.year;
        this.order.toDateMonth = this.toDate.month;
        this.order.toDateDay = this.toDate.day;
        this.order.toDateHour = this.toTime.hour;
        this.order.toDateMinute = this.toTime.minute;
        this.orderService.setOrder(this.order);
        const modalRef = this.modalService.show(RentModalComponent);
        const modalContent = modalRef.content as RentModalComponent;
        modalContent.onResponse.subscribe(res => {
          if (res) {
            this.orderService.getOrdersByProductId(this.product._id)
              .catch(err => {
                return Observable.throw(new Error(`${err.status} ${err.msg}`));
              })
              .subscribe(orders => {
                this.orders = orders;
                let points = [];

                this.orders.forEach(order => {
                  if (order.status == 'reserved' || order.status == 'started') {
                    var t = new Date();
                    t.setHours(0, 0, 0, 0);
                    var today = moment(t);
                    var from = moment(new Date(order.fromDateYear, order.fromDateMonth - 1, order.fromDateDay));
                    var to = moment(new Date(order.toDateYear, order.toDateMonth - 1, order.toDateDay));
                    var c = from.diff(today, 'days');
                    points.push({ node: c, count: order.quantity });
                    var c = to.diff(today, 'days');
                    points.push({ node: c, count: -order.quantity });
                  }
                });

                function compare(a, b) {
                  if (a.node > b.node) return 1;
                  else if (a.node < b.node) return -1;
                  else
                    if (a.count >= b.count) return -1;
                    else return 1;
                }
                points.sort(compare);

                this.points = points;

                this.buildIntervals();

                this.calculateIntervals();
                this.calculateIsDisabled();
                this.quantity = 1;
                if (this.calculateIntersection(this.fromDate, this.toDate) == false) {
                  this.toDate = null;
                  this.fromDate = null;
                }
              });
          }
        });
      }
    }
    else{
      this.modalService.show(LoginModalComponent);
    }
  }

  get mainImageUrl(): string {
    return this.product ? this.imageService.getImageUrl(this.product.images[0]) : '';
  }

  

  getImageUrl(){
    this.product.images.forEach(img => {
      this.images.push(this.imageService.getImageUrl(img))
    });
  }

  @ViewChildren('allTheseThings') things: QueryList<any>;

  ngAfterViewInit() {
    this.things.changes.subscribe(t => {
      var swiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        spaceBetween: 0,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    })
  }

}
