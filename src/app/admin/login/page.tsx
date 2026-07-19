"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyAdminLogin } from "@/lib/actions/auth";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { Box, Flex, Heading, Button, Card, TextField, Text, IconButton } from "@radix-ui/themes";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !username) return;
    setLoading(true);
    setError("");

    try {
      const res = await verifyAdminLogin(username, password);
      if (res.success) {
        // Redirect to admin dashboard
        router.push("/admin");
        router.refresh();
      } else {
        setError(res.error || "Incorrect username or password");
        setPassword("");
      }
    } catch {
      setError("An error occurred verifying the login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      position="fixed" 
      inset="0" 
      style={{ 
        backgroundColor: "var(--gray-2)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "16px" 
      }}
    >
      <Card size="4" style={{ width: "100%", maxWidth: "400px" }}>
        <form onSubmit={handleSubmit}>
          <Flex direction="column" align="center" gap="5">
            <img 
              src="/images/logo_horizontal.png" 
              alt="Knotice" 
              style={{ 
                width: "180px",
                height: "auto",
                objectFit: "contain",
                marginTop: "-20px",
                marginBottom: "-25px"
              }} 
            />
            <Box style={{ textAlign: "center" }}>
              <Heading size="6" mb="1">Dashboard Login</Heading>
              <Text size="2" color="gray">
                Enter your username and password to access the dashboard.
              </Text>
            </Box>

            <Box style={{ width: "100%" }}>
              <TextField.Root 
                type="text" 
                size="3" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: "16px" }}
              />
              <TextField.Root 
                type={showPassword ? "text" : "password"}
                size="3" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ fontFamily: "monospace", letterSpacing: "0.1em" }}
              >
                <TextField.Slot side="right">
                  <IconButton 
                    size="1" 
                    variant="ghost" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer", color: "var(--gray-9)" }}
                  >
                    {showPassword ? <EyeOff width={16} height={16} /> : <Eye width={16} height={16} />}
                  </IconButton>
                </TextField.Slot>
              </TextField.Root>
            </Box>

            {error && (
              <Text color="ruby" size="2" weight="medium">
                {error}
              </Text>
            )}

            <Button 
              size="3" 
              color="crimson" 
              style={{ width: "100%", cursor: "pointer", fontWeight: 600 }}
              disabled={loading || !password}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Access Dashboard"}
            </Button>
          </Flex>
        </form>
      </Card>
    </Box>
  );
}
