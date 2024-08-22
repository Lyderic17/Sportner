import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // Update with your backend API URL

  constructor(private http: HttpClient) { }

  signup(user : {username: string, email: string, password: string } ): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/signup`, user);
  }

  login(credential : {email: string, password: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/login`, credential);
  }

  logout(): Observable<any> {
    return this.http.get(`${this.apiUrl}/logout`);
  }
}
