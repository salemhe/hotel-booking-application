// services/session.service.ts
interface Session {
   _id: string;
   userId: string;
   token: string;
   expiresAt: string;
   createdAt: string;
   updatedAt: string;
 }
 
 interface CreateSessionResponse {
   message: string;
   session: Session;
 }
 
 export class SessionService {
   private static BASE_URL = "https://hotel-booking-app-backend-30q1.onrender.com";
 
   static async createSession(userId: string, token: string): Promise<Session> {
     const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours from now
     
     const response = await fetch(`${this.BASE_URL}/api/sessions`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ userId, token, expiresAt }),
     });
 
     if (!response.ok) {
       throw new Error("Failed to create session");
     }
 
     const data: CreateSessionResponse = await response.json();
     return data.session;
   }
 
   static async getSession(sessionId: string): Promise<Session> {
     const response = await fetch(`${this.BASE_URL}/api/sessions/${sessionId}`);
     
     if (!response.ok) {
       throw new Error("Failed to get session");
     }
 
     return response.json();
   }
 
   static async deleteSession(sessionId: string): Promise<void> {
     const response = await fetch(`${this.BASE_URL}/api/sessions/delete/${sessionId}`, {
       method: "DELETE",
     });
 
     if (!response.ok) {
       throw new Error("Failed to delete session");
     }
   }
 
   static isSessionExpired(expiresAt: string): boolean {
     return new Date(expiresAt).getTime() < Date.now();
   }
 }
 
 