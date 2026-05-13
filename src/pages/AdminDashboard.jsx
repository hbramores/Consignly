import { useEffect, useState } from "react";
import {
  isValidPassword,
  isValidUsername,
  sanitizePassword,
  sanitizeUsername,
} from "../utils/inputValidation";
import Header from "../components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function AdminDashboard({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("user");

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/users");
    const data = await res.json();
    setUsers(data);
  };

  const deactivateUser = async (id) => {
    const res = await fetch(`http://localhost:5000/users/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    setMessage(data.message || "");

    if (res.ok) {
      fetchUsers();
    }
  };

  const addUser = async (e) => {
    e.preventDefault();

    if (!isValidUsername(newUsername)) {
      setMessage("Username must be 3-30 characters and use only letters, numbers, or underscores.");
      return;
    }

    if (!isValidPassword(newPassword)) {
      setMessage("Password must be 6-72 characters.");
      return;
    }

    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: newUsername,
        password: newPassword,
        role: newRole,
      }),
    });

    const data = await res.json();
    setMessage(data.message || "");

    if (res.ok) {
      setNewUsername("");
      setNewPassword("");
      setNewRole("user");
      fetchUsers();
    }
  };

  const approveUser = async (id) => {
    const res = await fetch(`http://localhost:5000/users/${id}/approve`, {
      method: "PUT",
    });

    const data = await res.json();
    setMessage(data.message || "");

    if (res.ok) {
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <Header
            title="Admin Dashboard"
            description={`Welcome, ${user.username}`}
          />
          <Button variant="outline" onClick={onLogout}>Logout</Button>
        </div>

        {message && (
          <div className="rounded-md border bg-card px-4 py-3 text-sm text-muted-foreground">
            {message}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Add User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="adminUsername">Username</Label>
                <Input
                  id="adminUsername"
                  type="text"
                  placeholder="Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(sanitizeUsername(e.target.value))}
                  pattern="[A-Za-z0-9_]{3,30}"
                  maxLength={30}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminPassword">Password</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  placeholder="Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(sanitizePassword(e.target.value))}
                  minLength={6}
                  maxLength={72}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Artisan User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit">Add User</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{item.role}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.created_at}</TableCell>
                    <TableCell>
                      {item.role !== "admin" ? (
                        <div className="flex flex-wrap gap-2">
                          {item.status === "pending" && (
                            <Button size="sm" onClick={() => approveUser(item.id)}>
                              Approve
                            </Button>
                          )}
                          {item.status !== "inactive" && (
                            <Button size="sm" variant="outline" onClick={() => deactivateUser(item.id)}>
                              Deactivate
                            </Button>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Protected</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default AdminDashboard;
