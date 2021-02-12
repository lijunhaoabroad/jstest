import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '././layout/layout.component';
import { ListComponent } from '././list/list.component';




const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: ListComponent },
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class UserRoutingModule { }
