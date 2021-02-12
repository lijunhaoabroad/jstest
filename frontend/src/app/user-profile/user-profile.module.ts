import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { ListComponent } from './list/list.component';
import { UserRoutingModule } from './user-routing.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [LayoutComponent, ListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserRoutingModule,
  ]
})
export class UserProfileModule { }
