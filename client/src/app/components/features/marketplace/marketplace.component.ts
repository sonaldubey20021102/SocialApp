import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Business, User } from '../../../models';
import {
  ButtonComponent,
  BadgeComponent,
  AvatarComponent,
  CardComponent,
  CardContentComponent,
  InputComponent
} from '../../ui';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    BadgeComponent,
    AvatarComponent,
    CardComponent,
    CardContentComponent,
    InputComponent
  ],
  template: `
    <div class="h-full overflow-y-auto bg-background">
      <!-- Header -->
      <div class="border-b border-border bg-card">
        <div class="max-w-7xl mx-auto px-6 py-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-xl font-bold">Marketplace</h1>
              <p class="text-muted-foreground">
                Discover local services and connect with community businesses
              </p>
            </div>
            
            <div class="flex items-center gap-2">
              <app-button
                [variant]="viewMode() === 'grid' ? 'default' : 'outline'"
                size="sm"
                (click)="viewMode.set('grid')">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
              </app-button>
              <app-button
                [variant]="viewMode() === 'list' ? 'default' : 'outline'"
                size="sm"
                (click)="viewMode.set('list')">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                </svg>
              </app-button>
            </div>
          </div>

          <!-- Search and Filters -->
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="relative flex-1">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <app-input
                placeholder="Search services, businesses, or keywords..."
                [(ngModel)]="searchQuery"
                class="pl-10">
              </app-input>
            </div>
            
            <div class="flex gap-2">
              <select 
                [(ngModel)]="selectedCategory" 
                class="h-9 rounded-md border bg-background px-3 text-sm">
                @for (category of categories; track category) {
                  <option [value]="category">{{ category }}</option>
                }
              </select>

              <select 
                [(ngModel)]="selectedPriceRange" 
                class="h-9 rounded-md border bg-background px-3 text-sm">
                @for (range of priceRanges; track range) {
                  <option [value]="range">{{ range }}</option>
                }
              </select>

              <select 
                [(ngModel)]="sortBy" 
                class="h-9 rounded-md border bg-background px-3 text-sm">
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="newest">Newest</option>
                <option value="price">Price: Low to High</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-6">
        <!-- Featured Section -->
        @if (featuredBusinesses().length > 0) {
          <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold">Featured Businesses</h2>
              <app-button variant="ghost" size="sm">
                View All
                <svg class="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </app-button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (business of featuredBusinesses().slice(0, 3); track business.id) {
                <ng-container *ngTemplateOutlet="businessCard; context: { business: business, featured: true }"></ng-container>
              }
            </div>
          </div>
        }

        <!-- Results -->
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-semibold">
            All Services ({{ filteredBusinesses().length }})
          </h2>
          
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Updated 2 minutes ago</span>
          </div>
        </div>

        @if (filteredBusinesses().length > 0) {
          <div [class]="viewMode() === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'">
            @for (business of filteredBusinesses(); track business.id) {
              <ng-container *ngTemplateOutlet="businessCard; context: { business: business, featured: false }"></ng-container>
            }
          </div>
        } @else {
          <div class="text-center py-12">
            <div class="text-6xl mb-4">🔍</div>
            <h3 class="text-lg font-medium mb-2">No services found</h3>
            <p class="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <app-button (click)="clearFilters()">
              Clear Filters
            </app-button>
          </div>
        }
      </div>
    </div>

    <!-- Business Card Template -->
    <ng-template #businessCard let-business="business" let-featured="featured">
      <app-card [class]="'overflow-hidden hover:shadow-lg transition-shadow ' + (featured ? 'border-primary/20' : '')">
        @if (business.image) {
          <div class="relative">
            <img
              [src]="business.image"
              [alt]="business.title"
              class="w-full h-48 object-cover"
              (error)="onImageError($event)"
            />
            @if (featured) {
              <app-badge class="absolute top-2 left-2 bg-primary">
                Featured
              </app-badge>
            }
            <app-button
              variant="ghost"
              size="sm"
              class="absolute top-2 right-2 bg-white/80 hover:bg-white"
              (click)="toggleFavorite(business.id)">
              <svg 
                class="h-4 w-4" 
                [class.fill-current]="favorites().includes(business.id)"
                [class.text-red-500]="favorites().includes(business.id)"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </app-button>
          </div>
        }
        
        <app-card-content class="p-4">
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1">
              <h3 class="font-semibold mb-1">{{ business.title }}</h3>
              <app-badge variant="secondary" class="text-xs mb-2">
                {{ business.category }}
              </app-badge>
            </div>
            <div class="text-right">
              <div class="flex items-center gap-1 mb-1">
                <svg class="h-4 w-4 fill-current text-yellow-500" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span class="text-sm font-medium">{{ business.rating }}</span>
              </div>
              <p class="text-xs text-muted-foreground">({{ business.reviews }} reviews)</p>
            </div>
          </div>

          <p class="text-sm text-muted-foreground mb-3 line-clamp-2">
            {{ business.description }}
          </p>

          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-1 text-sm text-muted-foreground">
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>{{ business.location }}</span>
            </div>
            <span class="font-medium text-primary">{{ business.price }}</span>
          </div>

          <div class="flex items-center gap-2">
            <div class="flex items-center gap-2 flex-1">
              <app-avatar 
                [src]="business.user.avatar" 
                [alt]="business.user.name"
                [fallback]="getInitials(business.user.name)"
                class="h-6 w-6">
              </app-avatar>
              <span class="text-sm text-muted-foreground">{{ business.user.name }}</span>
              @if (business.user.isOnline) {
                <div class="h-2 w-2 bg-green-500 rounded-full"></div>
              }
            </div>
            
            <app-button size="sm" variant="outline">
              <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              Contact
            </app-button>
          </div>
        </app-card-content>
      </app-card>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      min-height: 0;
    }
  `]
})
export class MarketplaceComponent {
  private authService = inject(AuthService);

  searchQuery = '';
  selectedCategory = 'All';
  selectedPriceRange = 'All';
  sortBy = 'rating';
  viewMode = signal<'grid' | 'list'>('grid');
  favorites = signal<string[]>([]);

  categories = ['All', 'Food & Beverage', 'Personal Care', 'Home & Garden', 'Technology', 'Health & Fitness'];
  priceRanges = ['All', '$', '$$', '$$$'];

  mockBusinesses: Business[] = [
    {
      id: '1',
      title: "Sarah's Artisan Bakery",
      category: 'Food & Beverage',
      description: 'Fresh bread, pastries, and custom cakes made daily with locally sourced ingredients. Specializing in sourdough and European-style breads.',
      image: 'https://images.unsplash.com/photo-1555507036-ab794f27c1c4?w=500&h=300&fit=crop',
      location: 'Downtown District',
      price: '$$',
      rating: 4.8,
      reviews: 23,
      isActive: true,
      featured: true,
      user: {
        id: '2',
        name: 'Sarah Miller',
        email: 'sarah@bakery.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b86b8b9e?w=100&h=100&fit=crop&crop=face',
        roles: [],
        isOnline: true,
        lastSeen: new Date()
      }
    },
    {
      id: '2',
      title: "Mike's Classic Barbershop",
      category: 'Personal Care',
      description: 'Professional haircuts and grooming services. Traditional barbering techniques combined with modern styles.',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&h=300&fit=crop',
      location: 'Main Street',
      price: '$',
      rating: 4.9,
      reviews: 45,
      isActive: true,
      user: {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@barbershop.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        roles: [],
        isOnline: false,
        lastSeen: new Date(Date.now() - 30 * 60 * 1000)
      }
    },
    {
      id: '3',
      title: 'Green Thumb Garden Center',
      category: 'Home & Garden',
      description: 'Complete gardening supplies, plants, and landscaping consultation. Seasonal flowers and year-round plant care.',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=300&fit=crop',
      location: 'Garden District',
      price: '$$',
      rating: 4.7,
      reviews: 31,
      isActive: true,
      user: {
        id: '4',
        name: 'Emma Wilson',
        email: 'emma@greenthumb.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        roles: [],
        isOnline: true,
        lastSeen: new Date()
      }
    },
    {
      id: '4',
      title: 'TechFix Computer Repair',
      category: 'Technology',
      description: 'Fast and reliable computer repair services. Hardware troubleshooting, software installation, and data recovery.',
      image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500&h=300&fit=crop',
      location: 'Tech Quarter',
      price: '$$$',
      rating: 4.6,
      reviews: 18,
      isActive: true,
      user: {
        id: '5',
        name: 'David Chen',
        email: 'david@techfix.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        roles: [],
        isOnline: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    },
    {
      id: '5',
      title: 'Fitness First Personal Training',
      category: 'Health & Fitness',
      description: 'Certified personal training and nutrition coaching. Customized workout plans and one-on-one sessions.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop',
      location: 'Sports Complex',
      price: '$$$',
      rating: 4.9,
      reviews: 27,
      isActive: true,
      user: {
        id: '6',
        name: 'Lisa Rodriguez',
        email: 'lisa@fitnessfirst.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b86b8b9e?w=100&h=100&fit=crop&crop=face',
        roles: [],
        isOnline: true,
        lastSeen: new Date()
      }
    }
  ];

  featuredBusinesses = signal<Business[]>(
    this.mockBusinesses.filter(b => b.featured)
  );

  filteredBusinesses = signal<Business[]>(this.mockBusinesses);

  constructor() {
    // Watch for filter changes and update filteredBusinesses
    // In a real app, this would be done with computed signals or RxJS
  }

  ngDoCheck() {
    this.updateFilteredBusinesses();
  }

  updateFilteredBusinesses(): void {
    let filtered = this.mockBusinesses.filter(business => {
      const matchesSearch = business.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                           business.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory === 'All' || business.category === this.selectedCategory;
      const matchesPrice = this.selectedPriceRange === 'All' || business.price === this.selectedPriceRange;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    filtered = filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        case 'price':
          return (a.price?.length || 0) - (b.price?.length || 0);
        default:
          return 0;
      }
    });

    this.filteredBusinesses.set(filtered);
  }

  toggleFavorite(businessId: string): void {
    this.favorites.update(favs => 
      favs.includes(businessId)
        ? favs.filter(id => id !== businessId)
        : [...favs, businessId]
    );
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'All';
    this.selectedPriceRange = 'All';
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
