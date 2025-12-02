"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { IBook } from "@/types/book"
import Loading from "./loading"

export default function BooksList() {
  const [books, setBooks] = useState<IBook[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get("/books");
        setBooks(res.data.books)
      } catch (error) {
        console.error("Error fetching books:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  if (loading) return <Loading />

  if (books.length === 0) {
    return <p className="text-center">No books found</p>
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <Card key={book.ISBN} className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>{book.title}</CardTitle>
            <p className="text-sm text-gray-500">ISBN: {book.ISBN}</p>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="font-semibold">Authors:</span> {book.authors.join(", ")}</p>
            <p><span className="font-semibold">Language:</span> {book.language}</p>
            <p><span className="font-semibold">Published:</span> {book.pubDate}</p>
            <p><span className="font-semibold">Pages:</span> {book.numOfPage}</p>
            <p><span className="font-semibold">Categories:</span> {book.categories.join(", ")}</p>
            <p><span className="font-semibold">Publication:</span> {book.publication}</p>

            {book.borrowedBy ? (
              <p className="text-red-500 font-medium">
                Borrowed until {book.dueDate ? new Date(book.dueDate).toDateString() : "N/A"}
              </p>
            ) : (
              <Button className="w-full">Borrow</Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
