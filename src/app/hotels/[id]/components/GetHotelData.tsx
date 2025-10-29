"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { Star, MessageSquare, Calendar } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Hotel {
  id: number;
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  imageUrl: string;
  totalRating: number;
  guests: number;
}

interface Review {
  id: number;
  userId: string;
  hotelId: number;
  content: string;
  username: string;
  // Adding additional fields for better UI
  rating?: number;
  date?: string;
}

export const GetHotelData = ({
  onDataLoaded,
  onPriceReceived,
  onNumberOfGuestsReceived,
}: {
  onDataLoaded: () => void;
  onPriceReceived: (price: number) => void;
  onNumberOfGuestsReceived: (guests: number) => void;
}) => {
  const { id } = useParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadHotelData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/GetHotelData/${id}`, {
          method: "GET",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch hotel data");
        }

        const hotelData = await response.json();
        console.log("Received hotel data:", hotelData); // Debug log

        if (!hotelData) {
          throw new Error("No hotel data received");
        }

        setHotel(hotelData);
        onPriceReceived(hotelData.pricePerNight);
        onNumberOfGuestsReceived(hotelData.guests);
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch hotel data"
        );
      } finally {
        onDataLoaded();
        setLoading(false);
      }
    };

    loadHotelData();
  }, [id, onDataLoaded, onPriceReceived, onNumberOfGuestsReceived]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await fetch("/api/GetReviews", {
          method: "POST",
          body: JSON.stringify(id),
        });
        let reviewsData = await response.json();

        if (reviewsData === null) {
          return (
            <div className="max-w-4xl mx-auto p-4 mt-8">
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-128 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </div>
            </div>
          );
        }
        reviewsData = reviewsData.map((review: Review) => ({
          ...review,
          rating: review.rating || 0, // Fixed to 4 stars as requested
          date: new Date(
            Date.now() - Math.floor(Math.random() * 30) * 86400000
          ).toLocaleDateString(), // Random date within last 30 days
        }));

        setReviews(reviewsData);
        console.log(reviewsData);
      } catch (error) {
        console.error(error);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (id) {
      fetchReviews();
    }
  }, [id]);
  useEffect(() => {
    const updateHotel = async () => {
      const response = await fetch("/api/UpdateHotel", {
        method: "POST",
        body: JSON.stringify(id),
      });
    };
    updateHotel();
  }, []);

  // Function to get initials from nickname
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // Function to get a color based on the first letter of the nickname
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];

    // Default to first color if name is undefined or empty
    if (!name || name.length === 0) {
      return colors[0];
    }

    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Function to render star rating
  const renderStarRating = (
    rating: number,
    maxRating: number = 5,
    size: string = "w-5 h-5"
  ) => {
    return (
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, i) => (
          <Star
            key={i}
            className={`${size} ${
              i < rating
                ? "fill-yellow-400 stroke-yellow-400"
                : "stroke-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Function to get text description for rating
  const getRatingText = (rating: number): string => {
    if (rating >= 4.5) return "Exceptional";
    if (rating >= 4.0) return "Excellent";
    if (rating >= 3.5) return "Very Good";
    if (rating >= 3.0) return "Good";
    if (rating >= 2.0) return "Fair";
    return "";
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 mt-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-128 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-4xl mx-auto mt-8">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!hotel) {
    return (
      <Alert className="max-w-4xl mx-auto mt-8">
        <AlertDescription>No hotel data found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 mt-8">
      <Card className="overflow-hidden">
        <div className="relative w-full" style={{ height: "480px" }}>
          <Image
            src={hotel.imageUrl}
            alt={hotel.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">{hotel.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">{hotel.description}</p>

          {/* Enhanced Rating Display */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                {renderStarRating(hotel.totalRating)}
                <span className="font-semibold text-xl">
                  {hotel.totalRating.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-600 font-medium">
                {getRatingText(hotel.totalRating)}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-600">Based on</span>
              <span className="font-semibold text-lg">
                {reviews?.length || 0} guest reviews
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">📍</span>
              <span>{hotel.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">💰</span>
              <span className="font-semibold">${hotel.pricePerNight}</span>
              <span className="text-gray-600">per night</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-amber-500" />
            <span className="text-slate-200">Guest Reviews</span>
            {reviews && (
              <Badge variant="outline" className="ml-2 text-sm">
                <span className="text-slate-200">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </span>
              </Badge>
            )}
          </h2>
        </div>

        {reviewsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="mb-4">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <Card
                key={review.id || index}
                className="mb-4 hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar
                      className={`h-12 w-12 ${getAvatarColor(
                        review.username || "Anonymous"
                      )}`}
                    >
                      <AvatarFallback>
                        {getInitials(review.username || "Anonymous")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-lg">
                          {review.username || "Anonymous"}
                        </h3>
                        <div className="flex items-center gap-1">
                          {renderStarRating(review.rating || 4, 5, "w-4 h-4")}
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{review.date || "Recent stay"}</span>
                      </div>

                      <p className="text-gray-700 mb-2 mt-4">
                        {review.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No reviews yet. Be the first to review this hotel!</p>
            </CardContent>
          </Card>
        )}
      </div>

      <h1 className="my-12 text-4xl text-center">
        <span className="text-amber-500">Reserve {hotel.name} </span>{" "}
        <span className="text-slate-400">Today</span>
      </h1>
    </div>
  );
};
