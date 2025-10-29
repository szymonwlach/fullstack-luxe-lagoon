"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AlertDialogOpinion({
  hotelId,
  userId,
}: {
  hotelId: number;
  userId: string;
}) {
  const [rating, setRating] = useState(1);
  const [hoverRating, setHoverRating] = useState(0);
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sended, setSended] = useState<boolean>(false);
  const [sendInDatabase, setSendInDatabase] = useState<boolean>(false);
  const [isFetched, setIsFetched] = useState<boolean>(false);

  const handleClick = (value: number) => {
    setRating(value);
  };

  const handleHover = (value: number) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const sendOpinion = async () => {
    try {
      setIsLoading(true);
      const opinionData = {
        hotelId: hotelId,
        userId: userId,
        rating: rating,
        description: description,
      };
      await fetch("/api/SendOpinion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(opinionData),
      });
      toast.success("Review successfully sent!", {
        style: { backgroundColor: "#86efac", color: "#14532d" },
      });
      setSended(true);
      setSendInDatabase(true);
    } catch (error) {
      console.error("Error sending opinion:", error);
      toast.error("Failed to send review");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isSended = async () => {
      try {
        const temp = {
          hotelId: hotelId,
          userId: userId,
        };
        const response = await fetch("/api/IsSendedOpinion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(temp),
        });
        const data = await response.json();
        setSendInDatabase(data); // Now expecting a boolean
      } catch (error) {
        console.error("Error while checking opinion status:", error);
      }
    };
    isSended();
    setIsFetched(true);
  }, [hotelId, userId]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={sendInDatabase}>
          {sendInDatabase ? (
            "You added opinion already"
          ) : isFetched ? (
            "Leave your opinion"
          ) : (
            <span className="pointer-events-none disabled">...</span>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Opinion</AlertDialogTitle>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleClick(value)}
                  onMouseEnter={() => handleHover(value)}
                  onMouseLeave={handleMouseLeave}
                >
                  <FaStar
                    className={`${
                      (hoverRating || rating) >= value
                        ? "text-yellow-500"
                        : "text-gray-400"
                    }`}
                    size={24}
                  />
                </button>
              ))}
              <span className="ml-2">{rating} / 5</span>
            </div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Your opinion..."
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={sendOpinion} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="animate-spin duration-75" />
            ) : (
              "Send"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
