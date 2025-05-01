"use client";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { Plus } from "lucide-react";

export function AddServerDialog() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const addServer = async (name: string, address: string) => {
    const res = await fetch('/api/users/server-lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, address })
    })
    if (!res.ok) throw new Error('Failed to add server')
    return res.json()
  }

  const handleAddServer = async () => {
    if (!name || !address) return;

    setLoading(true);

    try {
      await addServer(name, address);
      setName("");
      setAddress("");
      window.location.reload();
    } catch (error) {
      console.error("Error adding server:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new server</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Server name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Server"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url">Server Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="http://localhost:9100"
            />
          </div>
        </div>
        <Button onClick={handleAddServer} disabled={loading}>
          {loading ? "Adding..." : "Add Server"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
