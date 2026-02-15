import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "./services/auth.service";
import { AuthFormComponent } from "./components/features/auth-form/auth-form.component";
import { MainDashboardComponent } from "./components/features/main-dashboard/main-dashboard.component";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [CommonModule, AuthFormComponent, MainDashboardComponent,RouterOutlet],
    template: `
        <!-- Loading State -->
        @if (authService.isLoading()) {
            <div class="h-screen-safe w-full flex items-center justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        } @else if (!authService.isAuthenticated()) {
            <!-- Auth Form -->
            <div class="h-screen-safe w-full">
                <app-auth-form></app-auth-form>
            </div>
        } @else {
            <!-- Main Dashboard -->
            <div class="h-screen-safe w-full">
                <router-outlet></router-outlet>
            </div>
        }
        
    `,
    styles: [
        `
            :host {
                display: block;
                height: 100vh;
            }
        `,
    ],
})
export class AppComponent {
    authService = inject(AuthService);
}
