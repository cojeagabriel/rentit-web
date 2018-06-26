import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { AbstractControl } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss']
})
export class RegisterModalComponent implements OnInit {

  form: FormGroup;
  errors: string;
  submitted: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private bsModalRef: BsModalRef
  ) { }

  ngOnInit() {
    this.form = this.createForm();
  }

  createForm(): FormGroup{
    this.submitted = true;
    return this.formBuilder.group({
      firstName: this.formBuilder.control('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern('^[a-zA-Z]{2,20}$')])),
      lastName: this.formBuilder.control('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern('^[a-zA-Z]{2,20}$')])),
      email: this.formBuilder.control('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.email])),
      telephone: this.formBuilder.control('', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]*')])),
      password: this.formBuilder.control('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)]))
    });
  }

  register(): void{
    this.submitted = true;
    this.errors = null;
    if (this.form.valid) {
      this.authService.register(this.form.value)
        .catch(err => {
          this.errors = err.error.msg;
          return Observable.throw(new Error(`${err.status} ${err.msg}`));
        })
        .subscribe(() => {
          this.bsModalRef.hide();
        });
    }
  }

}
