import { Routes } from "@angular/router";
import { ChatInterfaceComponent } from "./components/features/chat-interface/chat-interface.component";
import { MainDashboardComponent } from "./components/features/main-dashboard/main-dashboard.component";
import { CommunityFeedComponent } from "./components/features/community-feed/community-feed.component";
import { MarketplaceComponent } from "./components/features/marketplace/marketplace.component";
import { MyBusinessesComponent } from "./components/features/my-businesses/my-businesses.component";
import { UserProfileComponent } from "./components/features/user-profile/user-profile.component";
import { AuthFormComponent } from "./components/features/auth-form/auth-form.component";

export const routes: Routes = [
  { path: 'login', component: AuthFormComponent },  
  {
    path: '',
    component: MainDashboardComponent,
    children: [
      // { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed', component: CommunityFeedComponent },
      { path: 'chat', component: ChatInterfaceComponent },
      {path:'market',component:MarketplaceComponent},
      {path:'business',component:MyBusinessesComponent},
      {path:'profile',component:UserProfileComponent},
    ]
  }
];




// [
//   { path: '', redirectTo: 'home', pathMatch: 'full' },
//   {path:'chat',component:ChatInterfaceComponent},
//   { path: '**', redirectTo: 'home' }
// ];