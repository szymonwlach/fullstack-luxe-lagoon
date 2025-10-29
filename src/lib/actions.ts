"use server";
import { db } from "@/db";
import {
  bookingsTable,
  hotelsTable,
  opinionsTable,
  usersTable,
} from "@/db/schema";
import { createClient } from "@supabase/supabase-js";
import { and, eq } from "drizzle-orm";

// Create Supabase client using environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const addHotel = async (
  name: string,
  description: string,
  location: string,
  pricePerNight: number,
  imageUrl: string, // Otrzymujemy URL zamiast pliku
  guests: number
) => {
  try {
    const newHotel = await db
      .insert(hotelsTable)
      .values({
        name,
        description,
        location,
        pricePerNight,
        imageUrl, // Już gotowy URL
        guests,
      })
      .returning();

    return newHotel[0];
  } catch (error) {
    console.error("Error adding hotel:", error);
    throw error;
  }
};

export const getAllHotels = async () => {
  try {
    const hotels = await db.select().from(hotelsTable);
    return hotels;
  } catch (error) {
    console.error("Error fetching hotels:", error);
    throw error;
  }
};

export const getHotel = async (id: number) => {
  try {
    const currentHotel = await db
      .select()
      .from(hotelsTable)
      .where(eq(hotelsTable.id, id))
      .limit(1); // Limit to 1 result

    // Return the first hotel or null if none found
    return currentHotel[0] || null;
  } catch (error) {
    console.error("Error fetching hotel:", error);
    throw error;
  }
};

export const AddUser = async (userId: string, email_address: string) => {
  try {
    const username = email_address.split("@")[0];
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (existingUser.length === 0) {
      await db.insert(usersTable).values({
        id: userId,
        email: email_address,
        username: username,
      });
    } else {
      console.log("User already exists.");
      return null; // or throw a custom error
    }
  } catch (error) {
    console.error("Error during adding user:", error);
    throw new Error("Failed to add user."); // or return a response indicating failure
  }
};

export const GetUserData = async (userId: string) => {
  try {
    const currentUser = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        username: usersTable.username,
        role: usersTable.role,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    return currentUser[0] || null;
  } catch (error) {
    console.log("Error while getting user data", error);
  }
};
interface data {
  userId: string;
  username: string;
}
export const UpdateUser = async (data: data) => {
  const userId = data.userId;
  const username = data.username;

  const newUser = await db
    .update(usersTable)
    .set({
      username: username,
    })
    .where(eq(usersTable.id, userId));
  return newUser[0] || null;
};

export const createBooking = async (dataToBooking: {
  userId: string;
  hotelId: number;
  specialInfo?: string;
  checkInDate: Date;
  checkOutDate: Date;
  daysCount: number;
  guests?: number;
  allInclusive?: boolean;
  totalPrice: number;
}) => {
  const newBooking = await db.insert(bookingsTable).values({
    userId: dataToBooking.userId,
    hotelId: dataToBooking.hotelId,
    specialInfo: dataToBooking.specialInfo,
    checkInDate: dataToBooking.checkInDate,
    checkOutDate: dataToBooking.checkOutDate,
    daysCount: dataToBooking.daysCount,
    guests: dataToBooking.guests ?? 1,
    allInclusive: dataToBooking.allInclusive ?? false,
    totalPrice: dataToBooking.totalPrice,
  });

  return newBooking;
};

export const getBooking = async (userId: string) => {
  const data = await db
    .select({
      id: bookingsTable.id,
      userId: bookingsTable.userId,
      hotelId: bookingsTable.hotelId,
      specialInfo: bookingsTable.specialInfo,
      daysCount: bookingsTable.daysCount,
      guests: bookingsTable.guests,
      allInclusive: bookingsTable.allInclusive,
      totalPrice: bookingsTable.totalPrice,
      checkInDate: bookingsTable.checkInDate,
      checkOutDate: bookingsTable.checkOutDate,
      createdAt: bookingsTable.createdAt,
      name: hotelsTable.name,
      location: hotelsTable.location,
      imageUrl: hotelsTable.imageUrl,
      pricePerNight: hotelsTable.pricePerNight,
      totalRating: hotelsTable.totalRating,
      ratingCount: hotelsTable.ratingCount,
    })
    .from(bookingsTable)
    .innerJoin(hotelsTable, eq(bookingsTable.hotelId, hotelsTable.id))
    .where(eq(bookingsTable.userId, userId));

  return data || [];
};
interface Opinion {
  userId: string;
  hotelId: number;
  rating: number;
  description: string;
}
export const AddOpinion = async (data: Opinion) => {
  const ratingCountData = await db
    .select({ ratingCount: hotelsTable.ratingCount })
    .from(hotelsTable)
    .where(eq(hotelsTable.id, data.hotelId));
  const ratingCount = ratingCountData[0].ratingCount + 1;
  await db.update(hotelsTable).set({
    ratingCount: ratingCount,
  });

  await db.insert(opinionsTable).values({
    userId: data.userId,
    hotelId: data.hotelId,
    rating: data.rating,
    content: data.description,
  });

  const ratingBefore = await db
    .select({
      totalRating: hotelsTable.totalRating,
    })
    .from(hotelsTable)
    .where(eq(hotelsTable.id, data.hotelId))
    .limit(1);

  if (ratingBefore.length > 0) {
    const currentTotalRating = ratingBefore[0].totalRating || 0;

    const updatedTotalRating = currentTotalRating + data.rating;

    await db
      .update(hotelsTable)
      .set({
        totalRating: updatedTotalRating,
      })
      .where(eq(hotelsTable.id, data.hotelId));
  } else {
    await db
      .update(hotelsTable)
      .set({
        totalRating: data.rating,
      })
      .where(eq(hotelsTable.id, data.hotelId));
  }
};

export const GetReviews = async (hotelId: number) => {
  const data = await db
    .select({
      id: opinionsTable.id,
      hotelId: opinionsTable.hotelId,
      rating: opinionsTable.rating,
      content: opinionsTable.content,
      userId: opinionsTable.userId,
      username: usersTable.username,
    })
    .from(opinionsTable)
    .innerJoin(usersTable, eq(opinionsTable.userId, usersTable.id))
    .where(eq(opinionsTable.hotelId, hotelId));
  return data.length > 0 ? data : null;
};

export const UpdateHotel = async (hotelId: number) => {
  // Pobierz wszystkie oceny dla danego hotelu
  const totalRatingData = await db
    .select({ rating: opinionsTable.rating })
    .from(opinionsTable)
    .where(eq(opinionsTable.hotelId, hotelId));

  // Oblicz sumę ocen
  const totalRating = totalRatingData.reduce((sum, row) => sum + row.rating, 0);

  await db
    .update(hotelsTable)
    .set({
      totalRating: totalRating,
      // ratingCount: ratingCount,
    })
    .where(eq(hotelsTable.id, hotelId));

  console.log(`Zaktualizowano hotel ${hotelId}: totalRating=${totalRating}`);
};

export const isSendedOpinion = async (hotelId: number, userId: string) => {
  try {
    const sended = await db
      .select()
      .from(opinionsTable)
      .where(
        and(
          eq(opinionsTable.userId, userId),
          eq(opinionsTable.hotelId, hotelId)
        )
      );
    return sended.length > 0;
  } catch (error) {
    console.error("Error checking if opinion is sent:", error);
    return false;
  }
};
