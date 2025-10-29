"use client";

import React, { useEffect, useState } from "react";
import {
  Loader2,
  MapPin,
  DollarSign,
  Star,
  Info,
  Users,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Hotel {
  id: number;
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  imageUrl: string;
  guests: number;
  totalRating: number;
  ratingCount: number;
}

export const Show = () => {
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  const getAllHotels = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/GetAllHotels", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setHotels(data);
        setFilteredHotels(data);
      }

      setHasFetched(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      setHasFetched(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllHotels();
  }, []);

  // Filter hotels based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredHotels(hotels);
      return;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = hotels.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(lowercasedQuery) ||
        hotel.location.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredHotels(filtered);
  }, [searchQuery, hotels]);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const HotelCard = ({ hotel }: { hotel: Hotel }) => {
    // Calculate the average rating for the hotel
    const averageRating = hotel.totalRating / hotel.ratingCount;

    return (
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-gray-100">
        {/* Hotel Image Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
          <Image
            src={hotel.imageUrl}
            width={600}
            height={400}
            className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
            alt={`Image of ${hotel.name}`}
          />
        </div>

        {/* Hotel Info Header */}
        <CardHeader className="space-y-3 pb-2 pt-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold line-clamp-1">
              {hotel.name}
            </CardTitle>
            <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full shadow-sm">
              <Star className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
              <span className="text-base font-medium">
                {averageRating ? averageRating.toFixed(1) : 0}{" "}
                {/* Display the average rating */}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5 flex-shrink-0 text-blue-500" />
            <span className="text-base truncate">{hotel.location}</span>
          </div>
        </CardHeader>

        {/* Hotel Details and Pricing */}
        <CardContent className="space-y-6 pt-4 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <DollarSign className="w-6 h-6 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {hotel.pricePerNight}
                </span>
                <span className="text-base text-gray-500">/night</span>
              </div>

              <div className="flex items-center gap-2 text-base text-gray-600 mt-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span>For {hotel.guests} guests</span>
              </div>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => router.push(`/hotels/${hotel.id}`)}
                    size="lg"
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base px-6 shadow-md"
                  >
                    <Info className="w-5 h-5" />
                    View Details
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-base p-3">
                  <p>Click to view hotel details and booking</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 px-6 py-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-24 w-24 animate-spin rounded-full border-6 border-gray-200" />
            <div className="absolute top-0 left-0 h-24 w-24 animate-spin rounded-full border-t-6 border-blue-500" />
          </div>
          <span className="text-xl text-gray-600 font-medium">
            Discovering amazing hotels...
          </span>
          <Loader2 className="animate-spin" />
        </div>
      </div>
    );
  }

  // No Hotels State
  if (!hasFetched || hotels.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 px-6 py-16 flex items-center justify-center">
        <div className="text-center max-w-xl mx-auto bg-white p-10 rounded-xl shadow-lg">
          <Search className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            No hotels available
          </h1>
          <p className="text-gray-600 text-lg mt-4 mb-8">
            Please try again later or modify your search criteria
          </p>
          <Button
            onClick={() => getAllHotels()}
            className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8"
          >
            Refresh Results
          </Button>
        </div>
      </div>
    );
  }

  // No Search Results State
  if (filteredHotels.length === 0 && searchQuery.trim() !== "") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 px-8 py-16">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-12">
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-gray-800 mb-6">
                Discover Your Perfect Stay
              </h1>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto">
                Browse through our carefully curated selection of premium hotels
                and accommodations for an unforgettable experience
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                <Input
                  type="text"
                  placeholder="Search hotels by name or location..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-14 py-6 text-lg border-2 border-gray-200 rounded-full focus-visible:ring-blue-500 shadow-sm"
                />
                {searchQuery && (
                  <Button
                    onClick={() => setSearchQuery("")}
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-transparent"
                  >
                    ✕
                  </Button>
                )}
              </div>
            </div>

            {/* No Results Message */}
            <div className="text-center max-w-xl mx-auto bg-white p-10 rounded-xl shadow-lg">
              <Search className="w-16 h-16 text-blue-500 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                No matching hotels found
              </h1>
              <p className="text-gray-600 text-lg mt-4 mb-8">
                Try a different search term or browse all available hotels
              </p>
              <Button
                onClick={() => setSearchQuery("")}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              >
                Show All Hotels
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Hotel Listing with Search
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 px-8 py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-12">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Discover Your Perfect Stay
            </h1>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              Browse through our carefully curated selection of premium hotels
              and accommodations for an unforgettable experience
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
              <Input
                type="text"
                placeholder="Search hotels by name or location..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-14 py-6 text-lg border-2 border-gray-200 rounded-full focus-visible:ring-blue-500 shadow-sm"
              />
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-transparent"
                >
                  ✕
                </Button>
              )}
            </div>
          </div>

          {/* Search Results Count */}
          {searchQuery.trim() !== "" && (
            <div className="text-center mb-6">
              <p className="text-lg text-gray-600">
                Found {filteredHotels.length} hotels matching "{searchQuery}"
              </p>
            </div>
          )}

          {/* Hotel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-10">
            {filteredHotels.map((hotel: Hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Show;
