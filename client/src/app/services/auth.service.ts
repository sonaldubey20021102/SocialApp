import { Injectable, signal, computed, inject } from '@angular/core';
import { User } from '../models';
import { HttpClient } from '@angular/common/http';
import { LoginCreds } from '../types/user';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private currentUserSignal = signal<User | null>(null);
  private isLoadingSignal = signal(true);

  currentUser = this.currentUserSignal.asReadonly();
  isLoading = this.isLoadingSignal.asReadonly();
  isAuthenticated = computed(() => this.currentUserSignal() !== null);

    baseUrl = 'https://localhost:5001/api/';

  constructor() {
    this.checkSession();
  }

  private checkSession(): void {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        user.lastSeen = new Date(user.lastSeen);
        this.currentUserSignal.set(user);
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
    this.isLoadingSignal.set(false);
  }


   login(cred:LoginCreds): Observable<User> {
    // Simulate API call
   // await new Promise(resolve => setTimeout(resolve, 1000));
    return this.http.post<User>(this.baseUrl+'Auth/login', cred).pipe(
      tap((user: User)=>{
        this.currentUserSignal.set(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    )
    // const mockUser: User = {
    //   id: '1',
    //   name: email.split('@')[0],
    //   email: email,
    //   avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=0D8ABC&color=fff`,
    //   roles: [],
    //   isOnline: true,
    //   lastSeen: new Date()
    // };
    
  }

  async register(name: string, email: string, password: string): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: Date.now().toString(),
      name: name,
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff`,
      roles: [],
      isOnline: true,
      lastSeen: new Date()
    };
    
    this.currentUserSignal.set(mockUser);
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('currentUser');
  }

  updateUser(user: User): void {
    this.currentUserSignal.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
