import { Injectable } from '@angular/core';
import { UserModel } from '@models/response/user-model.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: UserModel;

  // user$: Observable<UserModel> = this.userSubject.asObservable();

  setUserDetails(user: UserModel) {
    this.user = user;
  }

  getUserDetails(): UserModel {
    return this.user;
  }

  emptyQuizQuestions() {
    // this.userSubject.next(null);
  }
}
