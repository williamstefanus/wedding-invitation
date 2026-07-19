"use client";

import { useState } from "react";
import { verifyWoPin } from "@/lib/actions/usher";
import { Lock, Delete, Loader2, ShieldCheck } from "lucide-react";
import { Box, Flex, Text, Heading, Button, Card, Grid } from "@radix-ui/themes";

interface PinLoginModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export function PinLoginModal({ isOpen, onSuccess }: PinLoginModalProps) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleNumClick = (num: string) => {
    if (loading || pin.length >= 8) return;
    setError("");
    const nextPin = pin + num;
    setPin(nextPin);
  };

  const handleDelete = () => {
    if (loading || pin.length === 0) return;
    setError("");
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;
    setLoading(true);
    setError("");

    try {
      const res = await verifyWoPin(pin);
      if (res.success) {
        localStorage.setItem("wo_authorized", "true");
        onSuccess();
      } else {
        setError(res.error || "Incorrect PIN code");
        setPin("");
      }
    } catch {
      setError("An error occurred verifying the PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box position="fixed" inset="0" style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <Card size="4" style={{ width: "100%", maxWidth: "380px" }}>
        <Flex direction="column" align="center" gap="4">
          <Flex align="center" justify="center" style={{ width: 64, height: 64, backgroundColor: "var(--amber-3)", color: "var(--amber-11)", borderRadius: "var(--radius-4)" }}>
            <Lock width={32} height={32} />
          </Flex>

          <Box>
            <Heading size="6" align="center">Usher Access</Heading>
            <Text size="2" color="gray" align="center" mt="1" style={{ maxWidth: 240, margin: "0 auto", display: "block" }}>
              Enter the Wedding Organizer PIN code to access the check-in portal.
            </Text>
          </Box>

          {/* PIN Display */}
          <Flex align="center" justify="center" gap="3" style={{ width: "100%", height: 56, backgroundColor: "var(--gray-2)", border: "1px solid var(--gray-5)", borderRadius: "var(--radius-3)" }}>
            {pin ? (
              Array.from({ length: pin.length }).map((_, i) => (
                <Box key={i} style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "var(--amber-9)" }} />
              ))
            ) : (
              <Text size="2" weight="medium" color="gray">Enter PIN code</Text>
            )}
          </Flex>

          {error && (
            <Box style={{ width: "100%", padding: "12px", backgroundColor: "var(--crimson-3)", border: "1px solid var(--crimson-5)", borderRadius: "var(--radius-3)", textAlign: "center" }}>
              <Text size="2" weight="bold" color="crimson">
                ✕ {error}
              </Text>
            </Box>
          )}

          {/* Numeric Keypad */}
          <Grid columns="3" gap="3" style={{ width: "100%" }}>
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
              <Button
                key={num}
                variant="surface"
                color="gray"
                size="4"
                onClick={() => handleNumClick(num)}
                disabled={loading}
                style={{ height: 56, fontSize: "20px", fontWeight: "bold" }}
              >
                {num}
              </Button>
            ))}
            <Box /> {/* blank corner */}
            <Button
              variant="surface"
              color="gray"
              size="4"
              onClick={() => handleNumClick("0")}
              disabled={loading}
              style={{ height: 56, fontSize: "20px", fontWeight: "bold" }}
            >
              0
            </Button>
            <Button
              variant="soft"
              color="crimson"
              size="4"
              onClick={handleDelete}
              disabled={loading || !pin}
              style={{ height: 56 }}
            >
              <Delete width={24} height={24} />
            </Button>
          </Grid>

          {/* Submit */}
          <Button
            size="4"
            color="amber"
            variant="solid"
            onClick={handleSubmit}
            disabled={loading || !pin}
            style={{ width: "100%", height: 56, marginTop: "8px" }}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" width={20} height={20} style={{ marginRight: 8 }} /> Verifying...
              </>
            ) : (
              <>
                <ShieldCheck width={20} height={20} style={{ marginRight: 8 }} /> Unlock Portal
              </>
            )}
          </Button>
        </Flex>
      </Card>
    </Box>
  );
}
