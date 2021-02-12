import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '../_models/user.model';
import { AuthenticationService } from '../_services/authentication.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  user: User;

  constructor(private authenticationService: AuthenticationService) {
    this.user = this.authenticationService.userValue;
  }


}
