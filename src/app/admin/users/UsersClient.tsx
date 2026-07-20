"use client";

import { useState } from "react";
import { addAdminUser, deleteAdminUser } from "@/lib/actions/users";
import { Box, Flex, Table, Button, Badge, IconButton, Text, Card, Dialog, TextField, Select } from "@radix-ui/themes";
import { Trash2, UserPlus, Loader2, ShieldCheck, EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export function UsersClient({ initialUsers, sessionRole }: { initialUsers: any[], sessionRole: string }) {
  const [users, setUsers] = useState(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("editor");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    setLoadingId(id);
    const res = await deleteAdminUser(id);
    setLoadingId(null);
    
    if (res.success) {
      setUsers(users.filter(u => u.id !== id));
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;
    
    setAddLoading(true);
    setError("");
    const res = await addAdminUser({ username: newUsername, passwordRaw: newPassword, role: newRole });
    setAddLoading(false);
    
    if (res.success) {
      setIsAddModalOpen(false);
      setNewUsername("");
      setNewPassword("");
      setNewRole("editor");
      router.refresh();
      // Since it's server revalidated, it should update. 
      // But we can also trigger a hard refresh if needed.
      window.location.reload();
    } else {
      setError(res.error || "Failed to add user");
    }
  };

  return (
    <Card size="3">
      <Flex justify="between" align="center" mb="5">
        <Text size="5" weight="bold">Manage Users</Text>
        {sessionRole === "superadmin" && (
          <Dialog.Root open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <Dialog.Trigger>
              <Button style={{ cursor: "pointer" }} color="red">
                <UserPlus width={16} height={16} /> Add User
              </Button>
            </Dialog.Trigger>
            <Dialog.Content style={{ maxWidth: 450 }}>
              <Dialog.Title>Add New User</Dialog.Title>
              <Dialog.Description size="2" mb="4" color="gray">
                Create a new dashboard user. They will be able to log in using their username and password.
              </Dialog.Description>
              
              <form onSubmit={handleAddSubmit}>
                <Flex direction="column" gap="4">
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">Username</Text>
                    <TextField.Root 
                      placeholder="e.g. jessica" 
                      value={newUsername} 
                      onChange={e => setNewUsername(e.target.value)} 
                      required
                    />
                  </Box>
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">Password</Text>
                    <TextField.Root 
                      type={showPassword ? "text" : "password"}
                      placeholder="Secure password" 
                      value={newPassword} 
                      onChange={e => setNewPassword(e.target.value)} 
                      required
                    >
                      <TextField.Slot side="right">
                        <IconButton 
                          size="1" 
                          variant="ghost" 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ cursor: "pointer" }}
                        >
                          {showPassword ? <EyeOff width={16} height={16} /> : <Eye width={16} height={16} />}
                        </IconButton>
                      </TextField.Slot>
                    </TextField.Root>
                  </Box>
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">Role</Text>
                    <Select.Root value={newRole} onValueChange={setNewRole}>
                      <Select.Trigger style={{ width: "100%" }} />
                      <Select.Content>
                        <Select.Item value="superadmin">Super Admin (Full Access)</Select.Item>
                        <Select.Item value="editor">Editor (View/Edit Data Only)</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Box>

                  {error && (
                    <Text color="ruby" size="2">{error}</Text>
                  )}

                  <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                      <Button variant="soft" color="gray" type="button" style={{ cursor: "pointer" }}>
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Button type="submit" disabled={addLoading || !newUsername || !newPassword} color="red" style={{ cursor: "pointer" }}>
                      {addLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save User"}
                    </Button>
                  </Flex>
                </Flex>
              </form>
            </Dialog.Content>
          </Dialog.Root>
        )}
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell justify="end">Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map(user => (
            <Table.Row key={user.id} align="center">
              <Table.RowHeaderCell>
                <Flex align="center" gap="2">
                  <Box 
                    style={{ 
                      width: 32, height: 32, 
                      borderRadius: "50%", 
                      backgroundColor: "var(--red-3)", 
                      color: "var(--red-11)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: "bold",
                      textTransform: "uppercase"
                    }}
                  >
                    {user.username.charAt(0)}
                  </Box>
                  <Text weight="bold">{user.username}</Text>
                </Flex>
              </Table.RowHeaderCell>
              <Table.Cell>
                {user.role === "superadmin" ? (
                  <Badge color="purple" variant="soft">
                    <ShieldCheck width={12} height={12} /> Super Admin
                  </Badge>
                ) : (
                  <Badge color="blue" variant="soft">Editor</Badge>
                )}
              </Table.Cell>
              <Table.Cell justify="end">
                {sessionRole === "superadmin" && (
                  <IconButton 
                    color="ruby" 
                    variant="soft" 
                    onClick={() => handleDelete(user.id)}
                    disabled={loadingId === user.id}
                    style={{ cursor: "pointer" }}
                    title="Delete user"
                  >
                    {loadingId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 width={16} height={16} />}
                  </IconButton>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
}
