import { ImageService } from './image.service';
import { CommentService } from './services/comment.service';
import { MessageService } from './services/message.service';
import { MyOrdersComponent } from './components/dashboard/my-orders/my-orders.component';
import { OrderService } from './services/order.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule} from 'ngx-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


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
import { MatSidenavModule } from '@angular/material/sidenav';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/home/search/search.component';
import { ProductsComponent } from './components/home/products/products.component';
import { ProductService } from './services/product.service';
import { ProductComponent } from './components/product/product.component';
import { MyProductsComponent } from './components/dashboard/my-products/my-products.component';
import { EditProductComponent } from './components/dashboard/edit-product/edit-product.component';
import { RentModalComponent } from './components/product/rent-modal/rent-modal.component';
import { OrderComponent } from './components/order/order.component';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import * as moment from 'moment';
import { MyRentalsComponent } from './components/dashboard/my-rentals/my-rentals.component';
import { RentalComponent } from './components/rental/rental.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { NewMessageModalComponent } from './components/new-message-modal/new-message-modal.component';
import { MyMessagesComponent } from './components/dashboard/my-messages/my-messages.component';
import { ReviewService } from './services/review.service';
import { RateModalComponent } from './components/product/rate-modal/rate-modal.component';
import { NgxUploaderModule } from 'ngx-uploader';
import { ProductImagePreviewComponent } from './product-image-preview/product-image-preview.component';
import { ProductImageUploadComponent } from './product-image-upload/product-image-upload.component';

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
    NewProductComponent,
    HomeComponent,
    SearchComponent,
    ProductsComponent,
    ProductComponent,
    MyProductsComponent,
    EditProductComponent,
    RentModalComponent,
    MyOrdersComponent,
    OrderComponent,
    MyRentalsComponent,
    RentalComponent,
    MyProfileComponent,
    NewMessageModalComponent,
    MyMessagesComponent,
    RateModalComponent,
    ProductImagePreviewComponent,
    ProductImageUploadComponent
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
      { path: '', component: HomeComponent},
      { path: 'product/:id', component: ProductComponent},
      { path: 'profile/:id', component: ProfileComponent},
      { path: 'my-profile', component: MyProfileComponent,
        children: [
          { path: 'edit', component: EditProfileComponent }
      ]},
      { path: 'dashboard', component: DashboardComponent,
        children: [
          { path: 'new-product', component: NewProductComponent},
          { path: 'my-products', component: MyProductsComponent},
          { path: 'my-products/:id', component: EditProductComponent},
          { path: 'my-orders', component: MyOrdersComponent},
          { path: 'my-orders/:id', component: OrderComponent},
          { path: 'my-rentals', component: MyRentalsComponent },
          { path: 'my-rentals/:id', component: RentalComponent },
          { path: 'my-messages', component: MyMessagesComponent },
      ]}
    ]),
    AngularFontAwesomeModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    NgbModule.forRoot(),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger'
    }),
    NgxUploaderModule
  ],
  providers: [
    AuthService,
    TokenService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    ProductService,
    OrderService,
    MessageService,
    CommentService,
    ReviewService,
    ImageService
  ],
  entryComponents: [
    LoginModalComponent,
    RegisterModalComponent,
    DeleteModalComponent,
    RentModalComponent,
    NewMessageModalComponent,
    RateModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
