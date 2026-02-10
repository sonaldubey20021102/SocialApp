import { Component, HostListener, inject, signal, computed, effect, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User, Message, ChatRoom, MessageReaction } from '../../../models';
import {
  CardComponent,
  ButtonComponent,
  InputComponent,
  AvatarComponent,
  BadgeComponent,
  ScrollAreaComponent
} from '../../ui';

const COMMON_EMOJIS = [
  '\u{1F44D}',
  '\u{2764}\u{FE0F}',
  '\u{1F602}',
  '\u{1F62E}',
  '\u{1F622}',
  '\u{1F621}',
  '\u{1F44F}',
  '\u{1F525}'
];

@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    ButtonComponent,
    InputComponent,
    AvatarComponent,
    BadgeComponent,
    ScrollAreaComponent
  ],
  template: `
    @if (currentUser(); as user) {
      <div class="h-full min-h-0 max-h-screen-safe flex bg-background overflow-hidden">
        <!-- Chat List -->
        <div [class]="(isMobile() && showMobileChat()) ? 'hidden w-full md:w-80 border-r border-border flex-col bg-card min-h-0' : 'block w-full md:w-80 border-r border-border flex flex-col bg-card min-h-0'">
          <!-- Header -->
          <div class="p-3 border-b border-border shrink-0">
            <div class="flex items-center justify-between mb-3">
              <h2 class="font-semibold">Messages</h2>
              <div class="flex gap-1">
                <app-button variant="ghost" size="sm" class="h-8 w-8 p-0">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm8 4a8 8 0 01-1.2 4.2l1.4 4.3-4.3-1.4A8 8 0 1112 4a8 8 0 018 8z" />
                  </svg>
                </app-button>
                <app-button variant="ghost" size="sm" class="h-8 w-8 p-0">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12h.01M12 5h.01M12 19h.01" />
                  </svg>
                </app-button>
              </div>
            </div>

            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <app-input
                placeholder="Search conversations..."
                [ngModel]="searchQuery()"
                (ngModelChange)="searchQuery.set($event)"
                class="pl-10 h-9">
              </app-input>
            </div>
          </div>
          <!-- Chat List -->
          <app-scroll-area class="flex-1 min-h-0">
            <div class="p-1">
              @if (filteredChats().length === 0) {
                <div class="text-center py-8 text-muted-foreground">
                  <svg class="h-12 w-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p class="text-sm">No conversations found</p>
                </div>
              } @else {
                @for (chat of filteredChats(); track chat.id) {
                  @if (getOtherUser(chat, user.id); as otherUser) {
                    <app-card
                      [class]="'mb-1 cursor-pointer transition-all hover:shadow-sm ' + (selectedChat() === chat.id ? 'bg-primary/10 shadow-sm border-primary/20' : 'hover:bg-accent/50 border-transparent')"
                      (click)="selectChat(chat.id)">
                      <div class="p-3">
                        <div class="flex items-center gap-3">
                          <div class="relative">
                            <app-avatar
                              [src]="otherUser.avatar || ''"
                              [alt]="otherUser.name"
                              [fallback]="getInitials(otherUser.name)"
                              class="h-11 w-11">
                            </app-avatar>
                            @if (otherUser.isOnline) {
                              <div class="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                            }
                            @if (chat.isPinned) {
                              <svg class="absolute -top-1 -right-1 h-3 w-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 17v5M5 9l7-7 7 7-7 7-7-7z" />
                              </svg>
                            }
                          </div>

                          <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between mb-1">
                              <h3 [class]="'truncate ' + (chat.unreadCount > 0 ? 'font-semibold' : 'font-medium')">
                                {{ otherUser.name }}
                              </h3>
                              <div class="flex items-center gap-2">
                                @if (chat.lastMessage) {
                                  <span class="text-xs text-muted-foreground">
                                    {{ formatMessageTime(chat.lastMessage.timestamp) }}
                                  </span>
                                }
                                @if (chat.unreadCount > 0) {
                                  <app-badge class="h-5 w-5 text-xs rounded-full p-0 flex items-center justify-center bg-primary">
                                    {{ chat.unreadCount > 9 ? '9+' : chat.unreadCount }}
                                  </app-badge>
                                }
                              </div>
                            </div>

                            @if (otherUser.roles.length > 0) {
                              <div class="flex items-center gap-1 mb-1">
                                <app-badge variant="secondary" class="text-xs px-1.5 py-0.5">
                                  {{ otherUser.roles[0].title }}
                                </app-badge>
                              </div>
                            }

                            @if (chat.lastMessage) {
                              <p [class]="'text-sm truncate ' + (chat.unreadCount > 0 ? 'text-foreground' : 'text-muted-foreground')">
                                {{ chat.lastMessage.senderId === user.id ? 'You: ' : '' }}{{ chat.lastMessage.content }}
                              </p>
                            } @else {
                              <p class="text-sm text-muted-foreground">Start a conversation</p>
                            }
                          </div>
                        </div>
                      </div>
                    </app-card>
                  }
                }
              }
            </div>
          </app-scroll-area>
        </div>

        <!-- Chat Area -->
        <div [class]="(isMobile() && !selectedChat()) ? 'hidden flex-1 flex-col min-h-0 max-h-full' : 'flex flex-1 flex-col min-h-0 max-h-full'">
          @if (selectedUser(); as activeUser) {
            <!-- Chat Header -->
            <div class="p-3 border-b border-border bg-card shrink-0">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  @if (isMobile()) {
                    <app-button
                      variant="ghost"
                      size="sm"
                      class="h-8 w-8 p-0 md:hidden"
                      (click)="onBackToList()">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 18l-6-6 6-6" />
                      </svg>
                    </app-button>
                  }

                  <div class="relative">
                    <app-avatar
                      [src]="activeUser.avatar || ''"
                      [alt]="activeUser.name"
                      [fallback]="getInitials(activeUser.name)"
                      class="h-9 w-9">
                    </app-avatar>
                    @if (activeUser.isOnline) {
                      <div class="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-background"></div>
                    }
                  </div>

                  <div>
                    <h3 class="font-medium">{{ activeUser.name }}</h3>
                    <p class="text-xs text-muted-foreground">
                      {{ activeUser.isOnline ? 'Online' : formatLastSeen(activeUser.lastSeen) }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-1">
                  <app-button variant="ghost" size="sm" class="h-8 w-8 p-0">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 16.92v3a2 2 0 01-2.18 2A19.86 19.86 0 013 5.18 2 2 0 015 3h3a2 2 0 012 1.72c.18 1.02.42 2 .7 2.81a2 2 0 01-.45 2.11L9 11a16 16 0 006 6l1.36-1.36a2 2 0 012.11-.45c.81.28 1.79.52 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </app-button>
                  <app-button variant="ghost" size="sm" class="h-8 w-8 p-0">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M23 7l-7 5 7 5V7zM1 5h15a2 2 0 012 2v10a2 2 0 01-2 2H1z" />
                    </svg>
                  </app-button>
                  <app-button variant="ghost" size="sm" class="h-8 w-8 p-0">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12h.01M12 5h.01M12 19h.01" />
                    </svg>
                  </app-button>
                </div>
              </div>
            </div>

            <!-- Messages -->
            <app-scroll-area class="flex-1 min-h-0 px-3 py-2">
              <div class="space-y-2 pb-4">
                @for (message of chatMessages(); track message.id; let i = $index) {
                  <div class="flex gap-2 group mb-1" [class.flex-row-reverse]="isOwn(message)">
                    <div class="flex flex-col" [class.items-end]="isOwn(message)" [class.items-start]="!isOwn(message)">
                      @if (shouldShowAvatar(i)) {
                        @if (getSender(message); as sender) {
                          <app-avatar
                            [src]="sender.avatar || ''"
                            [alt]="sender.name"
                            [fallback]="getInitials(sender.name)"
                            class="h-6 w-6 mb-1">
                          </app-avatar>
                        }
                      }
                    </div>

                    <div class="flex flex-col max-w-[70%]" [class.items-end]="isOwn(message)" [class.items-start]="!isOwn(message)">
                      @if (message.replyTo) {
                        <div class="text-xs text-muted-foreground mb-1 px-2 py-1 bg-muted/50 rounded-md">
                          Replying to message...
                        </div>
                      }

                      <div class="relative group">
                        <div [class]="getBubbleClasses(message)">
                          {{ message.content }}
                          @if (message.isEdited) {
                            <span class="text-xs opacity-70 ml-2">(edited)</span>
                          }
                        </div>

                        <div class="absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1" [class.-left-20]="isOwn(message)" [class.-right-20]="!isOwn(message)">
                          <div class="relative" (click)="$event.stopPropagation()">
                            <app-button
                              variant="ghost"
                              size="sm"
                              class="h-6 w-6 p-0 bg-background shadow-sm"
                              (click)="toggleEmojiPicker(message.id, $event)">
                              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10h.01M15 10h.01M8 14s1.5 2 4 2 4-2 4-2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </app-button>

                            @if (activeEmojiMessageId() === message.id) {
                              <div class="absolute z-10 mt-2 w-auto p-2 bg-popover text-popover-foreground rounded-md border shadow-md" (click)="$event.stopPropagation()">
                                <div class="flex gap-1">
                                  @for (emoji of commonEmojis; track emoji) {
                                    <app-button
                                      variant="ghost"
                                      size="sm"
                                      class="h-8 w-8 p-0 hover:bg-accent"
                                      (click)="handleReaction(message.id, emoji); $event.stopPropagation()">
                                      {{ emoji }}
                                    </app-button>
                                  }
                                </div>
                              </div>
                            }
                          </div>

                          <app-button
                            variant="ghost"
                            size="sm"
                            class="h-6 w-6 p-0 bg-background shadow-sm"
                            (click)="replyingTo.set(message)">
                            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17l-5-5 5-5M4 12h11a4 4 0 014 4v1" />
                            </svg>
                          </app-button>

                          <div class="relative" (click)="$event.stopPropagation()">
                            <app-button
                              variant="ghost"
                              size="sm"
                              class="h-6 w-6 p-0 bg-background shadow-sm"
                              (click)="toggleMessageMenu(message.id, $event)">
                              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12h.01M12 5h.01M12 19h.01" />
                              </svg>
                            </app-button>

                            @if (activeMenuMessageId() === message.id) {
                              <div class="absolute z-10 mt-2 w-40 bg-popover text-popover-foreground rounded-md border shadow-md" (click)="$event.stopPropagation()">
                                <button class="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent">
                                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17l5-5-5-5M4 12h16" />
                                  </svg>
                                  Forward
                                </button>
                                @if (isOwn(message)) {
                                  <button class="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent">
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                                    </svg>
                                    Edit
                                  </button>
                                  <div class="my-1 h-px bg-border"></div>
                                  <button class="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent">
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6" />
                                    </svg>
                                    Delete
                                  </button>
                                }
                              </div>
                            }
                          </div>
                        </div>
                      </div>

                      @if (message.reactions && message.reactions.length > 0) {
                        <div class="flex gap-1 mt-1">
                          @for (reaction of message.reactions; track reaction.emoji) {
                            <app-button
                              variant="secondary"
                              size="sm"
                              class="h-6 px-2 text-xs rounded-full"
                              (click)="handleReaction(message.id, reaction.emoji)">
                              {{ reaction.emoji }} {{ reaction.users.length }}
                            </app-button>
                          }
                        </div>
                      }

                      <div class="flex items-center gap-1 mt-1 text-xs text-muted-foreground" [class.flex-row-reverse]="isOwn(message)">
                        <span>{{ formatMessageTime(message.timestamp) }}</span>
                        @if (isOwn(message)) {
                          <div class="flex">
                            @if (message.isRead) {
                              <svg class="h-3 w-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 13l3 3 7-7M3 13l3 3" />
                              </svg>
                            } @else {
                              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                              </svg>
                            }
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                }
                <div #messagesEnd></div>
              </div>
            </app-scroll-area>
            @if (replyingTo(); as reply) {
              <div class="px-3 py-2 bg-muted/50 border-t border-border shrink-0">
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center gap-2">
                    <svg class="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17l-5-5 5-5M4 12h11a4 4 0 014 4v1" />
                    </svg>
                    <span class="text-muted-foreground">Replying to</span>
                    <span class="font-medium truncate max-w-48">
                      {{ reply.content }}
                    </span>
                  </div>
                  <app-button
                    variant="ghost"
                    size="sm"
                    class="h-6 w-6 p-0"
                    (click)="clearReply()">
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </app-button>
                </div>
              </div>
            }

            <div class="p-3 border-t border-border bg-card shrink-0">
              <div class="flex items-end gap-2">
                <app-button variant="ghost" size="sm" class="h-9 w-9 p-0 shrink-0">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21.44 11.05l-8.49 8.49a5.5 5.5 0 01-7.78-7.78l8.49-8.49a3.5 3.5 0 014.95 4.95l-8.49 8.49a1.5 1.5 0 01-2.12-2.12l8.49-8.49" />
                  </svg>
                </app-button>

                <app-button variant="ghost" size="sm" class="h-9 w-9 p-0 shrink-0">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 15l-5-5L5 21" />
                  </svg>
                </app-button>

                <div class="flex-1 relative">
                  <app-input
                    placeholder="Type a message..."
                    [ngModel]="newMessage()"
                    (ngModelChange)="newMessage.set($event)"
                    (keypress)="handleKeyPress($event)"
                    class="pr-10 resize-none h-9">
                  </app-input>
                  <app-button
                    variant="ghost"
                    size="sm"
                    class="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10h.01M15 10h.01M8 14s1.5 2 4 2 4-2 4-2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </app-button>
                </div>

                <app-button
                  (click)="handleSendMessage()"
                  [disabled]="!newMessage().trim()"
                  size="sm"
                  class="h-9 w-9 p-0 rounded-full shrink-0">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 2L11 13" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 2L15 22l-4-9-9-4 20-7z" />
                  </svg>
                </app-button>
              </div>
            </div>
          } @else {
            <div class="flex-1 flex items-center justify-center bg-muted/30">
              <div class="text-center">
                <svg class="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 class="mb-2">Select a conversation</h3>
                <p class="text-sm text-muted-foreground max-w-sm">
                  Choose a chat from the sidebar to start messaging with community members
                </p>
              </div>
            </div>
          }
        </div>
      </div>
    } @else {
      <div class="h-full flex items-center justify-center">Loading...</div>
    }
  `
})
export class ChatInterfaceComponent {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;

  selectedChat = signal<string | null>(null);
  newMessage = signal('');
  searchQuery = signal('');
  replyingTo = signal<Message | null>(null);
  showMobileChat = signal(false);
  isMobile = signal(false);
  activeEmojiMessageId = signal<string | null>(null);
  activeMenuMessageId = signal<string | null>(null);

  @ViewChild('messagesEnd') messagesEndRef?: ElementRef<HTMLDivElement>;

  mockUsers: User[] = [
    {
      id: '2',
      name: 'Sarah Miller',
      email: 'sarah@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b86b8b9e?w=100&h=100&fit=crop&crop=face',
      roles: [{ id: '1', title: 'Artisan Baker', category: 'Food', description: 'Fresh breads daily', location: 'Downtown', price: '$$', rating: 4.8, reviews: 23, isActive: true }],
      isOnline: true,
      lastSeen: new Date()
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      roles: [{ id: '2', title: 'Classic Barber', category: 'Personal Care', description: 'Professional cuts', location: 'Main St', price: '$', rating: 4.9, reviews: 45, isActive: true }],
      isOnline: false,
      lastSeen: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      roles: [],
      isOnline: true,
      lastSeen: new Date()
    },
    {
      id: '5',
      name: 'David Chen',
      email: 'david@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      roles: [{ id: '3', title: 'Tech Repair', category: 'Technology', description: 'Fast repairs', location: 'Tech Quarter', price: '$$$', rating: 4.7, reviews: 12, isActive: true }],
      isOnline: false,
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '6',
      name: 'Lisa Rodriguez',
      email: 'lisa@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b86b8b9e?w=100&h=100&fit=crop&crop=face',
      roles: [],
      isOnline: true,
      lastSeen: new Date()
    }
  ];

  messages = signal<Message[]>([]);

  chatRooms = computed<ChatRoom[]>(() => {
    const user = this.currentUser();
    if (!user) return [];

    return this.mockUsers.map(otherUser => {
      const userMessages = this.messages().filter(m =>
        (m.senderId === otherUser.id && m.receiverId === user.id) ||
        (m.senderId === user.id && m.receiverId === otherUser.id)
      );

      const lastMessage = userMessages.slice().sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
      const unreadCount = userMessages.filter(m => m.senderId === otherUser.id && !m.isRead).length;

      return {
        id: otherUser.id,
        participants: [user, otherUser],
        lastMessage,
        unreadCount,
        isPinned: otherUser.id === '2'
      };
    }).sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      const aTime = a.lastMessage?.timestamp.getTime() || 0;
      const bTime = b.lastMessage?.timestamp.getTime() || 0;
      return bTime - aTime;
    });
  });

  filteredChats = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return this.chatRooms();

    const user = this.currentUser();
    if (!user) return [];

    return this.chatRooms().filter(chat => {
      const otherUser = chat.participants.find(p => p.id !== user.id);
      return otherUser?.name.toLowerCase().includes(query) ||
        chat.lastMessage?.content.toLowerCase().includes(query);
    });
  });

  selectedChatData = computed(() => {
    const id = this.selectedChat();
    if (!id) return null;
    return this.chatRooms().find(c => c.id === id) || null;
  });

  selectedUser = computed(() => {
    const user = this.currentUser();
    if (!user) return null;
    return this.selectedChatData()?.participants.find(p => p.id !== user.id) || null;
  });

  chatMessages = computed(() => {
    const user = this.currentUser();
    const id = this.selectedChat();
    if (!user || !id) return [];

    return this.messages()
      .filter(m =>
        (m.senderId === id && m.receiverId === user.id) ||
        (m.senderId === user.id && m.receiverId === id)
      )
      .slice()
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  });

  commonEmojis = COMMON_EMOJIS;

  constructor() {
    this.setIsMobile(window.innerWidth < 768);

    effect(() => {
      const user = this.currentUser();
      if (user && this.messages().length === 0) {
        this.messages.set(this.buildInitialMessages(user.id));
      }
    });

    effect(() => {
      this.chatMessages();
      this.scrollToBottom();
    });

    effect(() => {
      if (this.isMobile() && this.selectedChat() && !this.showMobileChat()) {
        this.showMobileChat.set(true);
      }
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.setIsMobile(window.innerWidth < 768);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.activeEmojiMessageId.set(null);
    this.activeMenuMessageId.set(null);
  }

  private setIsMobile(value: boolean): void {
    this.isMobile.set(value);
    if (!value) {
      this.showMobileChat.set(false);
    }
  }

  private buildInitialMessages(currentUserId: string): Message[] {
    return [
      {
        id: '1',
        senderId: '2',
        receiverId: currentUserId,
        content: `Hi! I saw you were interested in our fresh bread. We have some amazing sourdough available today! ${String.fromCodePoint(0x1F35E)}`,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true,
        reactions: [{ emoji: String.fromCodePoint(0x1F44D), users: [currentUserId] }]
      },
      {
        id: '2',
        senderId: currentUserId,
        receiverId: '2',
        content: 'That sounds great! What time do you usually have fresh loaves ready?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
        isRead: true
      },
      {
        id: '3',
        senderId: '2',
        receiverId: currentUserId,
        content: 'We bake fresh every morning around 6 AM, so by 7 AM we have everything ready. Would you like me to reserve a loaf for you?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 10 * 60 * 1000),
        isRead: true
      },
      {
        id: '4',
        senderId: currentUserId,
        receiverId: '2',
        content: 'Perfect! Yes, please reserve one sourdough loaf for me. I\'ll pick it up around 8 AM.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 15 * 60 * 1000),
        isRead: true
      },
      {
        id: '5',
        senderId: '3',
        receiverId: currentUserId,
        content: 'Thanks for reaching out! I can fit you in tomorrow at 2 PM if that works for you.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        isRead: false
      },
      {
        id: '6',
        senderId: '4',
        receiverId: currentUserId,
        content: 'Hey! Just wanted to let you know I had a great experience at Sarah\'s bakery. The bread was incredible!',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false,
        reactions: [{ emoji: String.fromCodePoint(0x2764, 0xFE0F), users: ['2'] }]
      }
    ];
  }

  selectChat(chatId: string): void {
    this.selectedChat.set(chatId);
    if (this.isMobile()) {
      this.showMobileChat.set(true);
    }
  }

  handleSendMessage(): void {
    const user = this.currentUser();
    const chatId = this.selectedChat();
    if (!user || !chatId || !this.newMessage().trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: chatId,
      content: this.newMessage().trim(),
      timestamp: new Date(),
      isRead: false,
      replyTo: this.replyingTo()?.id
    };

    this.messages.update(prev => [...prev, message]);
    this.newMessage.set('');
    this.replyingTo.set(null);
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleSendMessage();
    }
  }

  toggleEmojiPicker(messageId: string, event?: Event): void {
    event?.stopPropagation();
    this.activeEmojiMessageId.set(this.activeEmojiMessageId() === messageId ? null : messageId);
    this.activeMenuMessageId.set(null);
  }

  toggleMessageMenu(messageId: string, event?: Event): void {
    event?.stopPropagation();
    this.activeMenuMessageId.set(this.activeMenuMessageId() === messageId ? null : messageId);
    this.activeEmojiMessageId.set(null);
  }

  handleReaction(messageId: string, emoji: string): void {
    const user = this.currentUser();
    if (!user) return;

    this.messages.update(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;

      const reactions = msg.reactions || [];
      const existingReaction = reactions.find(r => r.emoji === emoji);

      if (existingReaction) {
        const hasReacted = existingReaction.users.includes(user.id);
        return {
          ...msg,
          reactions: hasReacted
            ? reactions.map(r => r.emoji === emoji
                ? { ...r, users: r.users.filter(u => u !== user.id) }
                : r
              ).filter(r => r.users.length > 0)
            : reactions.map(r => r.emoji === emoji
                ? { ...r, users: [...r.users, user.id] }
                : r
              )
        };
      }

      return {
        ...msg,
        reactions: [...reactions, { emoji, users: [user.id] }]
      };
    }));
  }

  formatMessageTime(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString();
  }

  formatLastSeen(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Active now';
    if (diffInMinutes < 60) return `Active ${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `Active ${Math.floor(diffInMinutes / 60)}h ago`;
    return `Last seen ${date.toLocaleDateString()}`;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }

  getOtherUser(chat: ChatRoom, currentUserId: string): User | null {
    return chat.participants.find(p => p.id !== currentUserId) || null;
  }

  getSender(message: Message): User | null {
    const user = this.currentUser();
    if (!user) return null;
    return message.senderId === user.id ? user : this.selectedUser();
  }

  isOwn(message: Message): boolean {
    const user = this.currentUser();
    return !!user && message.senderId === user.id;
  }

  shouldShowAvatar(index: number): boolean {
    const messages = this.chatMessages();
    if (index === 0) return true;
    return messages[index - 1]?.senderId !== messages[index]?.senderId;
  }

  getBubbleClasses(message: Message): string {
    const base = 'px-3 py-2 rounded-2xl text-sm leading-relaxed break-words overflow-wrap-anywhere';
    const own = this.isOwn(message)
      ? 'bg-primary text-primary-foreground rounded-br-md'
      : 'bg-muted rounded-bl-md';
    return `${base} ${own}`;
  }

  clearReply(): void {
    this.replyingTo.set(null);
  }

  onBackToList(): void {
    this.showMobileChat.set(false);
    this.selectedChat.set(null);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.messagesEndRef?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }
}
