import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:6000/auth';
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private usernameSubject = new BehaviorSubject<string | null>(null);
  private tokenKey = 'SecretKeyManual';

  constructor(private http: HttpClient) {
    this.initializeAuthState();
  }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  get username(): Observable<string | null> {
    return this.usernameSubject.asObservable();
  }

  get authToken(): string | null {
    return this.tokenSubject.value;
  }

  register(user: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        const token = response.token;
        const userId = response.userId;
        const username = response.username;
        console.log('server response', response)
        if (token) {
          const decodedToken = this.decodeToken(token);
          
          this.updateAuthState(token, userId, username);
          this.storeTokenInLocalStorage(token);
        }
      })
    );
  }

  logout(): void {
    this.clearAuthState();
    this.removeTokenFromLocalStorage();
    // Additional cleanup logic if needed
  }

  private initializeAuthState(): void {
    const storedToken = localStorage.getItem(this.tokenKey);
    if (storedToken) {
      const decodedToken: any = this.decodeToken(storedToken);
      const username = decodedToken?.username;
      this.updateAuthState(storedToken, decodedToken?.userId, username);
    }
  }

  private updateAuthState(token: string, userId: string | null, username: string | null): void {
    console.log('Decoded token:', this.decodeToken(token));
    console.log('Updating auth state:', token, userId, username);
    this.tokenSubject.next(token);
    this.loggedInSubject.next(true);
    localStorage.setItem('userId', userId || ''); // Store the user ID
/*     const decodedToken = this.decodeToken(token);
    const username = decodedToken?.username */
    this.usernameSubject.next(username);
  }

  private clearAuthState(): void {
    this.tokenSubject.next(null);
    this.loggedInSubject.next(false);
    this.usernameSubject.next(null);
  }

  private storeTokenInLocalStorage(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private removeTokenFromLocalStorage(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private decodeToken(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  }

  getUserSportsInterests(): Observable<string[]> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID not found in local storage');
    }
    console.log(userId, "usersportintetrestin in authservice")
    // Assume you have an endpoint in your backend to fetch user's sports interests based on user ID
    return this.http.get<string[]>(`${this.apiUrl}/${userId}/sports-interests`);
  }


  // Assume you have a method to get the user's ID
  getUserId(): string | null {
    // Replace this with your actual logic to get the user's ID
    // For example, you might store the user's ID in localStorage during login
    return localStorage.getItem('userId');
  }
}
