import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod"; // Zaimportuj zod

export function DialogComponent({
  usernameSend,
  userId,
  onUsernameUpdate,
}: {
  usernameSend: string;
  userId: string;
  onUsernameUpdate: (newUsername: string) => void;
}) {
  const [username, setUsername] = useState(usernameSend);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState(usernameSend);

  const usernameSchema = z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." });

  useEffect(() => {
    if (open) {
      setUsername(currentUsername);
      setError(null);
    }
  }, [open, currentUsername]);

  const updateUsername = async () => {
    const result = usernameSchema.safeParse(username);

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    if (username === currentUsername) {
      setError("New username cannot be the same as the current one.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/UpdateUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, username }),
      });

      if (response.ok) {
        setCurrentUsername(username);

        onUsernameUpdate(username);

        setOpen(false);
      }
    } catch (error) {
      toast.error("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Pencil className="mt-1 ml-1 text-slate-200 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
              disabled={loading}
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2 col-span-4 text-center">
              {error}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={updateUsername} disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : null}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
