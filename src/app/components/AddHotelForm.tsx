"use client";

import { addHotel } from "@/lib/actions";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { createClient } from "@supabase/supabase-js";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const testUpload = async () => {
  const file = new File(["test"], "test.txt", { type: "text/plain" });
  try {
    const { data, error } = await supabase.storage
      .from("hotels")
      .upload("test/test.txt", file, { cacheControl: "3600", upsert: false });

    console.log("Upload data:", data);
    console.log("Upload error:", error);
  } catch (err) {
    console.error("Upload failed:", err);
  }
};

testUpload();

export default function AddHotelForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [guestsFivePlus, setGuestsFivePlus] = useState<null | number>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${name
        .toLowerCase()
        .replace(/\s+/g, "-")}-${Date.now()}.${fileExt}`;
      const filePath = `hotels/${fileName}`;

      console.log("Attempting to upload:", {
        fileName,
        filePath,
        fileSize: file.size,
      });
      console.log("Uploading file:", filePath, file);

      if (!supabase || !supabase.storage) {
        console.error("Supabase client not properly initialized");
        return null;
      }

      const { data, error } = await supabase.storage
        .from("hotels")
        .upload(filePath, file);

      if (error) {
        console.error("Supabase upload error:", error);
        throw error;
      }

      console.log("Upload successful:", data);

      const { data: urlData } = supabase.storage
        .from("hotels")
        .getPublicUrl(filePath);

      console.log("Public URL:", urlData);
      return urlData.publicUrl;
    } catch (err) {
      console.error("Error uploading image:", err);
      return null;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!image) {
      setError("Please select an image.");
      setLoading(false);
      return;
    }

    const imageUrl = await uploadImage(image);
    if (!imageUrl) {
      setError("Failed to upload image.");
      setLoading(false);
      return;
    }

    try {
      await addHotel(
        name,
        description,
        location,
        Number(pricePerNight),
        imageUrl,
        numberOfGuests < 5 ? numberOfGuests : guestsFivePlus ?? 5
      );
      setSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      setName("");
      setDescription("");
      setLocation("");
      setPricePerNight("");
      setImage(null);
      setImagePreview(null);
      setNumberOfGuests(1);
      setGuestsFivePlus(null);
    } catch (err) {
      setError("Failed to add hotel. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(numberOfGuests);
  }, [numberOfGuests]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Add New Hotel</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <AlertDescription>
                  The hotel has been added successfully!
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Hotel Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter hotel name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter hotel description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px]"
                    required
                    minLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Number of Guests</Label>
                  <Select
                    value={numberOfGuests.toString()}
                    onValueChange={(value) =>
                      setNumberOfGuests(parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select number of guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Number of Guests</SelectLabel>
                        <SelectItem value="1">1 Guest</SelectItem>
                        <SelectItem value="2">2 Guests</SelectItem>
                        <SelectItem value="3">3 Guests</SelectItem>
                        <SelectItem value="4">4 Guests</SelectItem>
                        <SelectItem value="5">5+ Guests</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {numberOfGuests === 5 && (
                  <div className="space-y-2">
                    <Label htmlFor="guestsPlusFive">Number of Guests</Label>
                    <Input
                      type="number"
                      id="guestsPlusFive"
                      placeholder="Enter number of guests"
                      value={
                        guestsFivePlus !== null ? guestsFivePlus.toString() : ""
                      }
                      onChange={(e) =>
                        setGuestsFivePlus(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      min={5}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="price">Price per Night ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter price per night"
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(e.target.value)}
                    required
                    min={1}
                  />
                </div>
              </div>

              {/* Right Column - Image Upload and Preview */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Hotel Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                </div>

                {imagePreview && (
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <h2 className="text-lg font-semibold mb-2">
                      Image Preview
                    </h2>
                    <img
                      src={imagePreview}
                      alt="Selected image preview"
                      className="w-full h-auto max-h-96 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Adding..." : "Add Hotel"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
