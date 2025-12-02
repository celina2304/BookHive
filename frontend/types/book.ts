export interface IBook extends Document {
    ISBN: string;
    title: string;
    authors: string[];
    language: string;
    pubDate: string; // stored as string (DD-MM-YYYY), but you could switch to Date
    numOfPage: number;
    categories: string[];
    publication: string;
    borrowedBy?: string | null; // User ID reference
    borrowedDate?: Date | null;
    dueDate?: Date | null;
  
    // methods
    borrow(userId: string, borrowDays?: number): void;
    returnBook(): void;
  }
  