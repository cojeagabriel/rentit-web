import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule} from 'ngx-bootstrap';


import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { TokenService } from './services/token.service';
import { UserService } from './services/user.service';
import { RegisterModalComponent } from './components/register-modal/register-modal.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewProductComponent } from './components/dashboard/new-product/new-product.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginModalComponent,
    RegisterModalComponent,
    EditProfileComponent,
    ProfileComponent,
    DeleteModalComponent,
    DashboardComponent,
    NewProductComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: 'profile', component: ProfileComponent, 
        children: [
          { path: 'edit', component: EditProfileComponent }
      ]},
      { path: 'dashboard', component: DashboardComponent, 
        children: [
          { path: 'new-product', component: NewProductComponent}
      ]}
    ]),
    AngularFontAwesomeModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthService,
    TokenService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }    
  ],
  entryComponents: [
    LoginModalComponent,
    RegisterModalComponent,
    DeleteModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
