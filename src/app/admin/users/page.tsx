import { getAdminUsers } from "@/lib/actions/users";
import { UsersClient } from "./UsersClient";
import { Box, Heading, Text, Flex } from "@radix-ui/themes";

export const revalidate = 0;

export default async function AdminUsersPage() {
  const res = await getAdminUsers();

  if (!res.success) {
    return (
      <Box p="6">
        <Heading size="6" color="ruby">Error loading users</Heading>
        <Text color="gray">{res.error}</Text>
      </Box>
    );
  }

  return (
    <Box p="6">
      <Flex direction="column" gap="2" mb="6">
        <Heading size="7">System Users</Heading>
        <Text color="gray" size="3">
          Manage administrator and editor accounts for the dashboard.
        </Text>
      </Flex>
      <UsersClient initialUsers={res.data || []} sessionRole={res.sessionRole || ""} />
    </Box>
  );
}
