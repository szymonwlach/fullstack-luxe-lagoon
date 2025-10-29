"use client";
import { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Calendar, Loader2, Lock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { redirect, useParams } from "next/navigation";
import { toast } from "sonner";

export default function Booking({
  pricePerNight,
  numberOfGuestsReceived,
}: {
  pricePerNight: number;
  numberOfGuestsReceived: number;
}) {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [allInclusive, setAllInclusive] = useState(false);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [guestsFivePlus, setGuestsFivePlus] = useState<null | number>(null);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  const [invalidGuest, setInvalidGuest] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGuestCountInvalid, setIsGuestCountInvalid] = useState(false); // Nowy stan

  const getNumberOfDays = () => {
    const timeDiff = range[0].endDate.getTime() - range[0].startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  };

  const getPercent = () => {
    if (!allInclusive) return 0;
    // Ensure the number of guests includes "guestsFivePlus" if applicable
    const totalGuests =
      numberOfGuests === 5 && guestsFivePlus !== null
        ? guestsFivePlus
        : numberOfGuests;
    if (totalGuests === 1) return 20;
    if (totalGuests >= 5) return 20 + (totalGuests - 1) * 10;
    return 20 + (totalGuests - 1) * 10;
  };

  const getPriceByDays = () => {
    const days = getNumberOfDays();
    let basePrice = days * pricePerNight;

    const percentIncrease = getPercent() / 100;
    return basePrice * (1 + percentIncrease);
  };

  useEffect(() => {
    const totalGuests =
      numberOfGuests === 5 && guestsFivePlus !== null
        ? guestsFivePlus
        : numberOfGuests;

    if (totalGuests > numberOfGuestsReceived) {
      setIsGuestCountInvalid(true);
      setInvalidGuest(
        `Too many guests for this room. Maximum: ${numberOfGuestsReceived}`
      );
    } else {
      setIsGuestCountInvalid(false);
      setInvalidGuest(null);
    }
  }, [numberOfGuests, guestsFivePlus, numberOfGuestsReceived]);

  const formatDate = (date: any) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const numberOfDays = getNumberOfDays();
  const totalPrice = getPriceByDays();

  const { user } = useUser();
  const userId = user?.id;
  const isLoggedIn = !!userId;
  const { id } = useParams();

  // Common class for non-logged-in form elements
  const disabledFormClass = !isLoggedIn ? "opacity-50 cursor-not-allowed" : "";

  const sendData = async () => {
    setIsLoading(true);
    setInvalidGuest("");
    setErrorMessage(null);
    if (isGuestCountInvalid) return;

    try {
      // Format dates as ISO strings manually
      const formatDateString = (date: any) => {
        if (!date) return null;
        const d = new Date(date);
        if (isNaN(d.getTime())) return null;
        return d.toISOString().split("T")[0]; // Returns just the YYYY-MM-DD part
      };

      const checkInDate = formatDateString(range[0]?.startDate);
      const checkOutDate = formatDateString(range[0]?.endDate);

      if (!checkInDate || !checkOutDate) {
        throw new Error("Invalid date selection");
      }

      const totalGuests =
        numberOfGuests === 5 && guestsFivePlus !== null
          ? guestsFivePlus
          : numberOfGuests;

      const bookingData = {
        userId: userId,
        hotelId: Number(id),
        specialInfo: additionalInfo,
        checkInDate: checkInDate, // Send as YYYY-MM-DD string
        checkOutDate: checkOutDate, // Send as YYYY-MM-DD string
        daysCount: numberOfDays,
        guests: totalGuests,
        allInclusive: allInclusive,
        totalPrice: totalPrice,
      };

      console.log("Sending booking data:", bookingData);

      const response = await fetch("/api/Booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      toast.success("Your Booking has been successfully updated!", {
        style: { backgroundColor: "#86efac", color: "#14532d" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || "Failed to create booking");
        } catch (e) {
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`
          );
        }
      }

      // Success handling
      console.log("Booking created successfully!");

      // Add redirection or success message
    } catch (error) {
      console.error("Error in sendData:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
      redirect("/guest-area");
    }
  };

  return (
    <Card className="shadow-md max-w-md mx-auto">
      <CardHeader className="border-b bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg font-medium">
              Book Your Stay
            </CardTitle>
          </div>
          {!isLoggedIn && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm">
              <Lock className="h-3.5 w-3.5" />
              <span className="font-medium">Login to book</span>
            </div>
          )}
        </div>
        {!isLoggedIn && (
          <CardDescription className="text-slate-500 mt-2">
            Preview booking details below. Log in to complete your reservation.
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex justify-center mb-6">
          <DateRange
            editableDateInputs={true}
            onChange={(item: any) => setRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={range}
            className="border rounded-md"
          />
        </div>

        <div className="space-y-4">
          {/* Additional information section */}
          <div>
            <Label htmlFor="additional-info" className="block mb-2">
              Additional information:
            </Label>
            <Textarea
              id="additional-info"
              placeholder="Special requests or requirements"
              className={`w-full ${disabledFormClass}`}
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              disabled={!isLoggedIn}
            />
          </div>

          {/* Guests selection section */}
          <div>
            <Label htmlFor="number-of-guests" className="block mb-2">
              How many guests?
            </Label>
            <Select
              value={numberOfGuests.toString()}
              onValueChange={(value) => setNumberOfGuests(parseInt(value))}
              disabled={!isLoggedIn}
            >
              <SelectTrigger
                className={`w-[180px] ${disabledFormClass}`}
                id="number-of-guests"
              >
                <SelectValue placeholder="Select number of guests" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Number of Guests</SelectLabel>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem
                      key={num}
                      value={num.toString()}
                      className={`${
                        num <= numberOfGuestsReceived ? "" : "hidden"
                      }`}
                    >
                      {num === 5 ? "5+" : num} {num === 1 ? "Guest" : "Guests"}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Additional guests input for 5+ selection */}
          {numberOfGuests === 5 && (
            <div>
              <Label htmlFor="guestsPlusFive" className="block mb-2">
                Exact number of guests
              </Label>
              <Input
                type="number"
                id="guestsPlusFive"
                placeholder="Enter number of guests"
                value={guestsFivePlus !== null ? guestsFivePlus.toString() : ""}
                onChange={(e) =>
                  setGuestsFivePlus(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                min={1}
                disabled={!isLoggedIn}
                className={disabledFormClass}
              />
            </div>
          )}

          {invalidGuest && (
            <h1 className="mt-4 text-red-600">{invalidGuest}</h1>
          )}
          {/* All-inclusive option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all-inclusive"
              checked={allInclusive}
              onCheckedChange={(checked) => setAllInclusive(checked as boolean)}
              disabled={!isLoggedIn}
              className={disabledFormClass}
            />
            <Label
              htmlFor="all-inclusive"
              className={`cursor-pointer ${!isLoggedIn ? "opacity-50" : ""}`}
            >
              All-inclusive meals +{getPercent() === 0 ? "20" : getPercent()}%
            </Label>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 border-t p-4 bg-slate-50">
        {/* Pricing information - always shown but with reduced opacity when not logged in */}
        <div className={`w-full ${!isLoggedIn ? "opacity-70" : ""}`}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Check-in</span>
            <span className="text-gray-700">
              {formatDate(range[0].startDate)}
            </span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Check-out</span>
            <span className="text-gray-700">
              {formatDate(range[0].endDate)}
            </span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Duration</span>
            <span className="text-gray-700">
              {numberOfDays} {numberOfDays === 1 ? "day" : "days"}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-medium">Price per night</span>
            <span className="text-gray-700">
              ${pricePerNight.toLocaleString()}
            </span>
          </div>

          {allInclusive && (
            <div className="flex justify-between items-center mt-2">
              <span className="font-medium">All-inclusive meals</span>
              <span className="text-gray-700">
                +{getPercent() === 0 ? "20" : getPercent()}%
              </span>
            </div>
          )}

          <div className="flex justify-between items-center font-bold text-lg mt-3 pt-2 border-t">
            <span>Total</span>
            <span>${totalPrice.toLocaleString()}</span>
          </div>
        </div>
        {errorMessage && <h1 className="mt-4 text-red-600">{errorMessage}</h1>}

        {/* Login or Reserve button */}
        {!isLoggedIn ? (
          <div className="w-full">
            <SignedOut>
              <SignInButton>
                <Button className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700">
                  Log in to book this hotel
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        ) : (
          <Button
            onClick={sendData}
            className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 flex justify-center items-center"
            disabled={isLoading || isGuestCountInvalid}
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-6 h-6" />
            ) : (
              "Reserve Now"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
