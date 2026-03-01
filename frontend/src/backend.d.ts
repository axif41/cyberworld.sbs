import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface Comment {
    id: UUID;
    content: string;
    authorId: Principal;
    timestamp: Time;
    postId: UUID;
}
export interface User {
    id: Principal;
    username: string;
    displayName: string;
    email: string;
    courseTrack: string;
    profilePic?: ExternalBlob;
}
export interface ChatSession {
    title: string;
    messages: Array<ChatMessage>;
    userId: Principal;
    createdAt: Time;
    lastUpdated: Time;
    sessionId: UUID;
}
export interface Course {
    id: string;
    title: string;
    courseModules: Array<CourseModule>;
    difficulty: string;
    description: string;
    durationWeeks: bigint;
}
export interface CourseModule {
    moduleId: string;
    title: string;
    description: string;
    slides: Array<string>;
    courseId: string;
}
export interface FriendRequest {
    id: UUID;
    status: Variant_pending_rejected_accepted;
    receiverId: Principal;
    senderId: Principal;
}
export interface Post {
    id: UUID;
    content: string;
    authorId: Principal;
    timestamp: Time;
}
export interface Notification {
    id: UUID;
    content: string;
    userId: Principal;
    read: boolean;
    timestamp: Time;
}
export interface Message {
    id: UUID;
    content: string;
    receiverId: Principal;
    timestamp: Time;
    senderId: Principal;
}
export type UUID = string;
export interface ChatMessage {
    content: string;
    role: MessageRole;
    timestamp: Time;
}
export interface Certificate {
    studentName: string;
    userId: Principal;
    certificateId: string;
    issuedAt: Time;
    courseId: string;
}
export enum MessageRole {
    user = "user",
    assistant = "assistant"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_pending_rejected_accepted {
    pending = "pending",
    rejected = "rejected",
    accepted = "accepted"
}
export interface backendInterface {
    addComment(postId: UUID, content: string): Promise<void>;
    adminIssueCertificate(userId: Principal, courseId: string, studentName: string): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createNotification(userId: Principal, content: string): Promise<void>;
    createPost(content: string): Promise<void>;
    deleteChatSession(sessionId: UUID): Promise<void>;
    getAIDevelopmentCourse(): Promise<Course>;
    getAIDevelopmentModules(): Promise<Array<CourseModule>>;
    getAllCertificates(): Promise<Array<Certificate>>;
    getAllUsers(): Promise<Array<User>>;
    getCallerUserProfile(): Promise<User | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCertificatesForUser(userId: Principal): Promise<Array<Certificate>>;
    getChatSession(sessionId: UUID): Promise<ChatSession>;
    getCommentsForPost(postId: UUID): Promise<Array<Comment>>;
    getEnrollmentStats(): Promise<{
        aiDev: bigint;
        gameDev: bigint;
        dappDev: bigint;
        mobileDev: bigint;
        webDev: bigint;
    }>;
    getFriendRequestsForUser(): Promise<Array<FriendRequest>>;
    getMessagesWithUser(userId: Principal): Promise<Array<Message>>;
    getNotificationsForUser(): Promise<Array<Notification>>;
    getPostsForUser(userId: Principal): Promise<Array<Post>>;
    getSavedChatsForCurrentUser(): Promise<Array<ChatSession>>;
    getUserProfile(userId: Principal): Promise<User>;
    initializeAIDevelopmentCourse(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    issueCertificate(userId: Principal, courseId: string, studentName: string): Promise<string>;
    likePost(postId: UUID): Promise<void>;
    markNotificationAsRead(notificationId: UUID): Promise<void>;
    registerUser(username: string, email: string, displayName: string, courseTrack: string): Promise<void>;
    respondToFriendRequest(requestId: UUID, accepted: boolean): Promise<void>;
    saveCallerUserProfile(profile: User): Promise<void>;
    saveChatSession(title: string, chatMessages: Array<ChatMessage>): Promise<UUID>;
    sendFriendRequest(receiverId: Principal): Promise<void>;
    sendMessage(receiverId: Principal, content: string): Promise<void>;
    updateProfilePic(profilePic: ExternalBlob | null): Promise<void>;
}
