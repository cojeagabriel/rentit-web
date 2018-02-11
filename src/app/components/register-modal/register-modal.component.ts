import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss']
})
export class RegisterModalComponent implements OnInit {

  form: FormGroup;
  errors: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private bsModalRef: BsModalRef
  ) { }

  ngOnInit() {
    this.form = this.createForm();
  }

  createForm(): FormGroup{
    return this.formBuilder.group({
      firstName: this.formBuilder.control('tttt', Validators.required),
      lastName: this.formBuilder.control('ttt%', Validators.required),
      email: this.formBuilder.control('test', Validators.required),
      password: this.formBuilder.control('parola', Validators.required)
    });
  }

  register(): void{
    this.errors = null;
    if (this.form.valid) {
      this.authService.register(this.form.value)
        .catch(err => {
          this.errors = err.error.msg;
          console.log(err);
          return Observable.throw(new Error(`${err.status} ${err.msg}`));
        })
        .subscribe(() => {
          console.log("Registre success");
          this.bsModalRef.hide();
        });
    } else {
      this.errors = 'Fill all the fields';
    }
  }

}
