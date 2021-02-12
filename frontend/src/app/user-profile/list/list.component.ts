import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../_services/authentication.service';
import { User } from 'src/app/_models/user.model';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService } from '../../_services/alert.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit {
  form: FormGroup;
  amiform: FormGroup;

  loading = false;
  aloading = false;
  rloading = false;
  submitted = false;
  asubmitted = false;
  user: User;
  non_ami: User;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private alertService: AlertService,

  ) {

    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({

      age: ['', Validators.pattern("^[0-9]*$")],
      famille: [''],
      race: [''],
      nourriture: ['']

    });

    this.amiform = this.formBuilder.group({

      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],

    });

    if (this.user) {
      this.f.age.setValue(this.user.age);
      this.f.famille.setValue(this.user.famille);
      this.f.nourriture.setValue(this.user.nourriture);
      this.f.race.setValue(this.user.race);

    }

    this.getNonAmi();



  }
  get f() { return this.form.controls; }
  get f2() { return this.amiform.controls; }


  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.updateUser();

  }
  friend(event) {
    this.asubmitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.amiform.invalid) {
      return;
    }

    this.aloading = true;


    this.updateFriend(event);

  }

  getNonAmi() {
    this.authService.getNon()
      .pipe(first())
      .subscribe(
        data => {

          //    this.alertService.success(' friend successful', { keepAfterRouteChange: true });
          this.router.navigate(['..', { relativeTo: this.route }]);
          //this.user = JSON.parse(localStorage.getItem('user'));
          this.non_ami = data;


        },
        error => {
          this.alertService.error(error);

          //    this.aloading = false;
        });
  }

  ajoute(obj) {

    this.updateFriend(event, { email: obj.email, op: "add" });
  }



  private updateUser() {

    this.authService.updateUserInfo(this.form.value)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;

          this.alertService.success('Update successful', { keepAfterRouteChange: true });
          this.router.navigate(['..', { relativeTo: this.route }]);
          this.user = JSON.parse(localStorage.getItem('user'));

        },
        error => {
          this.alertService.error(error);
          this.loading = false;

        });
  }

  private updateFriend(event, obj = {}) {
    let op = ""
    let em = "";
    if ('op' in obj) {
      op = obj["op"];
      em = obj["email"];

    } else {
      if (event.submitter.name == "add") {
        op = "add";
      }
      else if (event.submitter.name == "delete") {
        op = "delete";
      }

      em = this.amiform.value.email;
    }



    this.authService.friendlist({ op: op, email: em })
      .pipe(first())
      .subscribe(
        data => {
          this.aloading = false;
          this.alertService.success(op + ' friend successful', { keepAfterRouteChange: true });
          this.router.navigate(['..', { relativeTo: this.route }]);
          this.user = JSON.parse(localStorage.getItem('user'));

          this.getNonAmi();


        },
        error => {
          this.alertService.error(error);

          this.aloading = false;
        });
  }

}
