"use client";
import { Suspense, useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Skeleton } from "@/app/components/ui/skeleton";
import axios from "axios";

function UserTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[150px]" />
      </div>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
      <div className="rounded-md border">
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  );
}

function UsersTable({
  loading,
  users,
}: {
  loading: boolean;
  users: {
    firstName: string;
    lastName: string;
    email: string;
    _id: string;
    phone: number;
    createdAt: string;
  }[];
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  if (loading) {
    return <UserTableSkeleton />;
  }
  if (!users || users.length === 0) {
    return <div className="text-center text-muted-foreground">No users found</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      </div>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="search" placeholder="Search users..." className="w-full" />
        <Button type="submit">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src="/placeholder.svg"
                        alt={user.firstName}
                      />
                      <AvatarFallback>
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">
                      {user.firstName} {user.lastName}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default function UsersPage() {

  const [users, setUsers] = useState([]);

  async function getUsers() {
    try {
      const res = await axios.get(
        "https://hotel-booking-app-backend-30q1.onrender.com/api/admin/users"
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching users", error);
      return null;
    }
  }

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      const fetchedUsers = await getUsers();
      if (fetchedUsers) {
        setUsers(fetchedUsers);
      }
      setLoading(false);
    }
    fetchUsers();
  }, []);

  return (
    <div className="w-full flex-1 flex flex-col overflow-hidden bg-gray-50 min-h-screen">
      <div className="w-full flex-1 space-y-4 px-1 sm:px-8 xl:px-24 pt-6 pb-8 overflow-auto">
        <Suspense fallback={<UserTableSkeleton />}>
          <UsersTable users={users} loading={loading} />
        </Suspense>
      </div>
    </div>
  );
}
