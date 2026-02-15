import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import {
  ButtonComponent,
  InputComponent,
  LabelComponent,
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
  TabsComponent,
  TabsListComponent,
  TabsTriggerComponent,
  TabsContentComponent
} from '../../ui';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    InputComponent,
    LabelComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    TabsComponent,
    TabsListComponent,
    TabsTriggerComponent,
    TabsContentComponent
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- Welcome Section -->
        <div class="text-center mb-8">
          <div class="flex justify-center mb-4">
            <div class="p-3 bg-primary rounded-xl">
              <svg class="h-8 w-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
          </div>
          <h1 class="mb-2 text-2xl font-bold">Welcome to CommunityHub</h1>
          <p class="text-muted-foreground">
            Connect, chat, and discover local services in your community
          </p>
          
          <!-- Features Preview -->
          <div class="flex justify-center gap-4 mt-6">
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <span>Chat</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              <span>Marketplace</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <span>Community</span>
            </div>
          </div>
        </div>

        <app-card>
          <app-card-header>
            <app-card-title>Get Started</app-card-title>
            <app-card-description>
              Join our community or sign in to your account
            </app-card-description>
          </app-card-header>
          <app-card-content>
            <app-tabs [defaultValue]="'login'" class="w-full">
              <app-tabs-list class="grid w-full grid-cols-2">
                <app-tabs-trigger 
                  value="login" 
                  [isActive]="activeTab() === 'login'"
                  (tabClick)="activeTab.set($event)">
                  Sign In
                </app-tabs-trigger>
                <app-tabs-trigger 
                  value="register" 
                  [isActive]="activeTab() === 'register'"
                  (tabClick)="activeTab.set($event)">
                  Sign Up
                </app-tabs-trigger>
              </app-tabs-list>
              
              <app-tabs-content value="login" [isActive]="activeTab() === 'login'">
                <form (ngSubmit)="handleLogin()" class="space-y-4">
                  <div class="space-y-2">
                    <app-label for="email">Email</app-label>
                    <app-input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      [(ngModel)]="loginData.email"
                      name="email"
                      [required]="true">
                    </app-input>
                  </div>
                  <div class="space-y-2">
                    <app-label for="password">Password</app-label>
                    <app-input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      [(ngModel)]="loginData.password"
                      name="password"
                      [required]="true">
                    </app-input>
                  </div>
                  <app-button 
                    type="submit" 
                    class="w-full" 
                    [disabled]="isLoading()">
                    {{ isLoading() ? 'Signing In...' : 'Sign In' }}
                  </app-button>
                </form>
                
                <div class="mt-4 text-center">
                  <p class="text-sm text-muted-foreground">
                    Demo: Use any email and password to continue
                  </p>
                </div>
              </app-tabs-content>
              
              <app-tabs-content value="register" [isActive]="activeTab() === 'register'">
                <form (ngSubmit)="handleRegister()" class="space-y-4">
                  <div class="space-y-2">
                    <app-label for="name">Full Name</app-label>
                    <app-input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      [(ngModel)]="registerData.name"
                      name="name"
                      [required]="true">
                    </app-input>
                  </div>
                  <div class="space-y-2">
                    <app-label for="register-email">Email</app-label>
                    <app-input
                      id="register-email"
                      type="email"
                      placeholder="Enter your email"
                      [(ngModel)]="registerData.email"
                      name="registerEmail"
                      [required]="true">
                    </app-input>
                  </div>
                  <div class="space-y-2">
                    <app-label for="register-password">Password</app-label>
                    <app-input
                      id="register-password"
                      type="password"
                      placeholder="Create a password"
                      [(ngModel)]="registerData.password"
                      name="registerPassword"
                      [required]="true">
                    </app-input>
                  </div>
                  <div class="space-y-2">
                    <app-label for="confirm-password">Confirm Password</app-label>
                    <app-input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      [(ngModel)]="registerData.confirmPassword"
                      name="confirmPassword"
                      [required]="true">
                    </app-input>
                  </div>
                  <app-button 
                    type="submit" 
                    class="w-full" 
                    [disabled]="isLoading()">
                    {{ isLoading() ? 'Creating Account...' : 'Create Account' }}
                  </app-button>
                </form>
              </app-tabs-content>
            </app-tabs>
          </app-card-content>
        </app-card>
      </div>
    </div>
  `
})
export class AuthFormComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  activeTab = signal('login');
  isLoading = signal(false);
  
  
  loginData = {
    email: '',
    password: ''
  };
  
  registerData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  handleLogin(): void {
    this.isLoading.set(true);
    
    this.authService.login(this.loginData).subscribe({
      next: (user) => {
        console.log('Login successful:', user);
        this.router.navigate(['/feed']);
      },
      error: err => {
        console.log('Login error:', err)
        this.isLoading.set(false);
      }
    });
    
  }

  async handleRegister(): Promise<void> {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    this.isLoading.set(true);
    try {
      await this.authService.register(
        this.registerData.name,
        this.registerData.email,
        this.registerData.password
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}

