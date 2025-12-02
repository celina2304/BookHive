import { Request, Response } from "express";
import BookModel from "../models/bookModel";

// (Google Books API)
interface GoogleBookResponse {
  items: {
    id: string;
    volumeInfo: {
      title?: string;
      authors?: string[];
      language?: string;
      publishedDate?: string;
      pageCount?: number;
      categories?: string[];
      publisher?: string;
      industryIdentifiers?: { type: string; identifier: string }[];
    };
  }[];
}

export const seedBooks = async (req: Request, res: Response) => {
  try {
    const { subject = "fiction", maxResults = 10 } = req.query;

    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:${subject}&maxResults=${maxResults}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch books" });
    }

    const data = (await response.json()) as GoogleBookResponse;

    const booksToInsert = data.items.map((item) => {
      const volume = item.volumeInfo;

      return {
        ISBN: volume.industryIdentifiers?.[0]?.identifier || Math.random().toString(),
        title: volume.title || "Untitled",
        authors: volume.authors || ["Unknown"],
        language: volume.language || "Unknown",
        pubDate: volume.publishedDate ? new Date(volume.publishedDate) : new Date(),
        numOfPage: volume.pageCount || 100,
        categories: volume.categories || [subject as string],
        publication: volume.publisher || "Unknown",

        borrowed: false,
        borrowedBy: null,
        borrowedDate: null,
        dueDate: null,
      };
    });

    // insertMany will skip duplicates if we add { ordered: false }
    await BookModel.insertMany(booksToInsert, { ordered: false });

    res.status(201).json({
      message: `Seeded ${booksToInsert.length} books for subject ${subject}`,
    });
  } catch (err) {
    console.error("Seeding error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
