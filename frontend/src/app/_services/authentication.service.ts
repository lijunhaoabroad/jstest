import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../_models/user.model';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<any>(environment.API_URL + `/login/`, { email, password })
      .pipe(map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);

        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out

    return this.http.get(`${environment.API_URL}/logout/`).subscribe(() => {

      localStorage.removeItem('user');

      this.userSubject.next(null);

      this.router.navigate(['/']);
    }
    );


  }


  register(user) {
    return this.http.post<any>(`${environment.API_URL}/register/`, user).pipe(map(user => {
      localStorage.setItem('user', JSON.stringify(user));
      this.userSubject.next(user);
      console.log(user)

      return user;
    }));
  }

  // getUserInfo() {
  //   return this.http.get<any>(`${environment.API_URL}/userinfo/`);
  // }

  updateUserInfo(params) {
    return this.http.put<any>(`${environment.API_URL}/userinfo/`, params)
      .pipe(map(x => {

        // update local storage
        localStorage.setItem('user', JSON.stringify(x));
        // publish updated user to subscribers
        this.userSubject.next(x);

        return x;
      }));

  }

  friendlist(params) {
    return this.http.put<any>(`${environment.API_URL}/friend/`, params)
      .pipe(map(x => {

        // update local storage
        localStorage.setItem('user', JSON.stringify(x));
        // publish updated user to subscribers
        this.userSubject.next(x);

        return x;
      }));

  }







}
