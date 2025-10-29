"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  CircleDollarSign,
  Clock,
  Coffee,
  Home,
  Inbox,
  MapPin,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialogOpinion } from "./AlertDialog";

interface Booking {
  id: number;
  userId: string;
  hotelId: number;
  specialInfo?: string;
  daysCount: number;
  guests: number;
  allInclusive: boolean;
  totalPrice: number;
  checkInDate: string;
  checkOutDate: string;
  createdAt: string;
  name: string;
}

export const ShowBooking = ({ userId }: { userId: string }) => {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/GetBookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to load your bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (error) {
    return (
      <Card className="w-full max-w-3xl mx-auto bg-destructive/10 border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Inbox className="h-5 w-5" />
            Error Loading Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
        <CardFooter>
          <button
            onClick={() => {
              setError(null);
              fetchData();
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </CardFooter>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-200">Your Bookings</h2>
        </div>
        {[1, 2].map((i) => (
          <Card key={i} className="w-full overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-28" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-200">Your Bookings</h2>
        <Badge variant="outline" className="text-sm font-medium text-slate-200">
          {bookings?.length || 0} Total
        </Badge>
      </div>

      {bookings && bookings?.length === 0 ? (
        <Card className="w-full text-center p-8">
          <div className="flex flex-col items-center gap-4">
            <Inbox className="h-16 w-16 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold">No Bookings Found</h3>
            <p className="text-muted-foreground">
              You haven't made any hotel bookings yet.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings?.map((booking) => (
            <Card
              key={booking.id}
              className="w-full overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Hotel {booking.name}
                  </CardTitle>
                  <Badge variant={booking.allInclusive ? "default" : "outline"}>
                    {booking.allInclusive ? "All Inclusive" : "Room Only"}
                  </Badge>
                </div>
                <CardDescription>
                  Booking #{booking.id} • Created{" "}
                  {format(new Date(booking.createdAt), "PPP")}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div className="font-medium">Stay Details</div>
                    </div>
                    <Separator className="my-2" />
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">Check-in</div>
                        <div className="font-medium">
                          {format(new Date(booking.checkInDate), "PPP")}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">Check-out</div>
                        <div className="font-medium">
                          {format(new Date(booking.checkOutDate), "PPP")}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">Duration</div>
                        <div className="font-medium">
                          {booking.daysCount}{" "}
                          {booking.daysCount === 1 ? "day" : "days"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {booking.guests}{" "}
                        {booking.guests === 1 ? "Guest" : "Guests"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Total: ${booking.totalPrice}
                      </span>
                    </div>

                    {booking.allInclusive && (
                      <div className="flex items-center gap-2">
                        <Coffee className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          All meals and drinks included
                        </span>
                      </div>
                    )}

                    {booking.specialInfo && (
                      <div className="mt-3 text-sm bg-secondary/50 p-2 rounded-md">
                        <p className="font-medium mb-1">Special Requests:</p>
                        <p className="text-muted-foreground">
                          {booking.specialInfo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4">
                <AlertDialogOpinion
                  hotelId={booking.hotelId}
                  userId={booking.userId}
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
