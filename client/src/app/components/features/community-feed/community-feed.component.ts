import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Post } from '../../../models';
import {
  ButtonComponent,
  BadgeComponent,
  AvatarComponent,
  CardComponent,
  CardHeaderComponent,
  CardContentComponent
} from '../../ui';

@Component({
  selector: 'app-community-feed',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    BadgeComponent,
    AvatarComponent,
    CardComponent,
    CardHeaderComponent,
    CardContentComponent
  ],
  template: `
    <div class="h-full bg-background">
      <!-- Header -->
      <div class="border-b border-border bg-card">
        <div class="max-w-2xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl font-bold">Community Feed</h1>
              <p class="text-muted-foreground">
                Discover what's happening in your neighborhood
              </p>
            </div>
            <app-button size="sm">
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              New Post
            </app-button>
          </div>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="border-b border-border bg-card">
        <div class="max-w-2xl mx-auto px-4 py-3">
          <div class="flex items-center gap-6 text-sm text-muted-foreground">
            <div class="flex items-center gap-1">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <span>1,234 members</span>
            </div>
            <div class="flex items-center gap-1">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
              <span>52 active today</span>
            </div>
            <div class="flex items-center gap-1">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <span>23 new posts</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Feed -->
      <div class="flex-1 overflow-y-auto">
        <div class="max-w-2xl mx-auto px-4 py-6">
          <div class="space-y-6">
            @for (post of posts(); track post.id) {
              <app-card class="overflow-hidden">
                <app-card-header class="pb-3">
                  <div class="flex items-start gap-3">
                    <app-avatar
                      [src]="post.user.avatar"
                      [alt]="post.user.name"
                      [fallback]="getInitials(post.user.name)"
                      class="h-10 w-10">
                    </app-avatar>
                    
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-1">
                        <h3 class="font-medium">{{ post.user.name }}</h3>
                        @if (post.user.role) {
                          <app-badge variant="secondary" class="text-xs">
                            {{ post.user.role }}
                          </app-badge>
                        }
                        @if (post.type === 'business') {
                          <app-badge variant="outline" class="text-xs">
                            Business
                          </app-badge>
                        }
                      </div>
                      
                      <div class="flex items-center gap-3 text-sm text-muted-foreground">
                        <div class="flex items-center gap-1">
                          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <span>{{ formatTimeAgo(post.timestamp) }}</span>
                        </div>
                        @if (post.location) {
                          <div class="flex items-center gap-1">
                            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <span>{{ post.location }}</span>
                          </div>
                        }
                        @if (post.rating) {
                          <div class="flex items-center gap-1">
                            <svg class="h-3 w-3 fill-current text-yellow-500" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <span>{{ post.rating }}</span>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </app-card-header>

                <app-card-content class="pt-0">
                  <p class="mb-4 leading-relaxed">{{ post.content }}</p>
                  
                  @if (post.image) {
                    <div class="mb-4 rounded-lg overflow-hidden">
                      <img
                        [src]="post.image"
                        alt="Post image"
                        class="w-full h-48 object-cover"
                        (error)="onImageError($event)"
                      />
                    </div>
                  }

                  @if (post.category) {
                    <div class="mb-4">
                      <app-badge variant="outline" class="text-xs">
                        {{ post.category }}
                      </app-badge>
                    </div>
                  }

                  <!-- Actions -->
                  <div class="flex items-center justify-between pt-2 border-t border-border">
                    <div class="flex items-center gap-4">
                      <app-button
                        variant="ghost"
                        size="sm"
                        (click)="handleLike(post.id)"
                        [class]="post.isLiked ? 'text-red-500' : ''">
                        <svg 
                          class="h-4 w-4 mr-1" 
                          [class.fill-current]="post.isLiked"
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                        {{ post.likes }}
                      </app-button>
                      
                      <app-button variant="ghost" size="sm">
                        <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                        {{ post.comments }}
                      </app-button>
                    </div>
                    
                    <app-button variant="ghost" size="sm">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                      </svg>
                    </app-button>
                  </div>
                </app-card-content>
              </app-card>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class CommunityFeedComponent {
  private authService = inject(AuthService);

  posts = signal<Post[]>([
    {
      id: '1',
      user: {
        id: '2',
        name: "Sarah's Bakery",
        avatar: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop&crop=face',
        role: 'Baker'
      },
      content: 'Fresh croissants and artisan bread available now! Made with locally sourced ingredients. Perfect for your morning coffee ☕',
      image: 'https://images.unsplash.com/photo-1555507036-ab794f27c1c4?w=500&h=300&fit=crop',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 24,
      comments: 8,
      isLiked: false,
      type: 'business',
      location: 'Downtown District',
      rating: 4.8,
      category: 'Food & Beverage'
    },
    {
      id: '2',
      user: {
        id: '3',
        name: 'Mike Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        role: 'Barber'
      },
      content: 'New haircut styles for the season! Book your appointment this week and get 20% off. Specializing in modern cuts and classic styles.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      likes: 12,
      comments: 3,
      isLiked: true,
      type: 'business',
      location: 'Main Street',
      rating: 4.9,
      category: 'Personal Care'
    },
    {
      id: '3',
      user: {
        id: '4',
        name: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b86b8b9e?w=100&h=100&fit=crop&crop=face'
      },
      content: "Had an amazing experience at Mike's barbershop! Highly recommend for anyone looking for a professional cut. The attention to detail is incredible.",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      likes: 18,
      comments: 5,
      isLiked: false,
      type: 'post'
    },
    {
      id: '4',
      user: {
        id: '5',
        name: 'Green Thumb Garden Center',
        avatar: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop',
        role: 'Plant Nursery'
      },
      content: 'Spring is here! 🌱 New arrivals of seasonal plants and flowers. Perfect time to start your garden. Free consultation with every purchase over $50.',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=300&fit=crop',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      likes: 31,
      comments: 12,
      isLiked: true,
      type: 'business',
      location: 'Garden District',
      rating: 4.7,
      category: 'Home & Garden'
    }
  ]);

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }

  handleLike(postId: string): void {
    this.posts.update(posts => 
      posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
