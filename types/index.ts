export interface User {
    _id: string;
    telegramId: string;
    username: string;
    firstName: string;
    lastName: string;
    dailyBestScore: number;
    weeklyBestScore: number;
    bestScore: number;
    updatedAt: string;
  }
  
  export interface GameSession {
    _id: string;
    user: User;
    score: number;
    startTime: string;
    endTime: string;
  }
  
  export interface LeaderboardData {
    userlist: User[];
    sessions: GameSession[];
    currentTime: string;
  }
  