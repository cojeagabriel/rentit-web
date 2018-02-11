import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../types/user';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { BsModalService } from 'ngx-bootstrap';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  user: User | null;
  userSubscribe: Subscription;
  formPersonalInfo: FormGroup;

  constructor(
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.formPersonalInfo = this.createForm();
    this.getUser();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      firstName: this.formBuilder.control('', Validators.required),
      lastName: this.formBuilder.control('', Validators.required),
      email: this.formBuilder.control('', Validators.required),
      telephone: this.formBuilder.control('', Validators.required)
    });
  }

  getUser():void{
    this.userService.getMe()
      .catch(err => {
        return Observable.throw(err);
      })
      .subscribe(user => {
        this.user = user;
        this.formPersonalInfo.patchValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
        });
        if(user.telephone){
          this.formPersonalInfo.patchValue({
            telephone: user.telephone
          });
        }
        console.log(this.user);
      });
  }

  save(){
    if (this.formPersonalInfo.valid) {
      this.userService.update({
        ...this.formPersonalInfo.value
      })
        .catch(err => {
          return Observable.throw(err);
        })
        .subscribe((data) => {
          this.userService.getMe().subscribe();
          console.log(data);
        });
    }
    else {
      alert("Fill all the fields");
    }
  }

  showDeleteModal() {
    this.modalService.show(DeleteModalComponent);
  }

  back() {
    this.location.back();
  }

}
