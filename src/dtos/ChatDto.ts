import type { Role, ChatSenderType } from '@prisma/client';
import { AttachmentType } from '../constants';

export interface ICreateChatMessageRequest {
  currentUserId: string;
  currentUserRole: Role;
  userId?: string;
  content?: string | null;
  attachments?: {
    url: string;
    mimeType: string;
    sizeBytes: number;
    type: AttachmentType;
    width?: number | null;
    height?: number | null;
  }[];
}

export interface IChatAttachmentDTO {
  id: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  type: AttachmentType;
  width?: number | null;
  height?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatMessageDTO {
  id: string;
  roomId: string;
  senderId: string;
  senderType: ChatSenderType;
  content?: string | null;
  hasAttachments: boolean;
  isReadByUser: boolean;
  isReadByAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  attachments: IChatAttachmentDTO[];
}

export interface ICreateChatMessageResponse {
  roomId: string;
  message: IChatMessageDTO;
}
