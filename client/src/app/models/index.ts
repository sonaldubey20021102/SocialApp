export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roles: UserRole[];
  isOnline: boolean;
  lastSeen: Date;
}

export interface UserRole {
  id: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  location: string;
  price?: string;
  rating: number;
  reviews: number;
  isActive: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  type?: 'text' | 'image' | 'file';
  reactions?: MessageReaction[];
  replyTo?: string;
  isEdited?: boolean;
}

export interface MessageReaction {
  emoji: string;
  users: string[];
}

export interface ChatRoom {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isTyping?: boolean;
  isPinned?: boolean;
}

export interface Post {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    role?: string;
  };
  content: string;
  image?: string;
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
  type: 'post' | 'business' | 'event';
  location?: string;
  rating?: number;
  category?: string;
}

export interface Business extends UserRole {
  user: User;
  featured?: boolean;
}

export type ViewType = 'chat' | 'profile' | 'marketplace' | 'community' | 'business';
