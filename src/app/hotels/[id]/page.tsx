"use client";
import Navbar from "@/app/components/Navbar";
import React, { useState } from "react";
import { GetHotelData } from "./components/GetHotelData";
import Booking from "./components/Booking";

const HotelPage = () => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [pricePerNight, setPricePerNight] = useState<number | null>(null);
  const [numberOfGuests, setNumberOfGuests] = useState(0);

  return (
    <div>
      <Navbar />
      <GetHotelData
        onDataLoaded={() => setIsDataLoaded(true)}
        onPriceReceived={(price) => setPricePerNight(price)}
        onNumberOfGuestsReceived={(guests) => setNumberOfGuests(guests)}
      />
      {isDataLoaded && pricePerNight !== null && (
        <Booking
          pricePerNight={pricePerNight}
          numberOfGuestsReceived={numberOfGuests}
        />
      )}
    </div>
  );
};

export default HotelPage;
