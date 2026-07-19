"use client";

import { useState } from "react";
import { User, Phone, Gift, Lock, Globe, UploadCloud, Loader2, Trash2, Eye, EyeOff } from "lucide-react";
import { Box, Flex, Grid, Card, Heading, Text, TextField, Select, Button, Avatar, IconButton } from "@radix-ui/themes";
interface GeneralSettingsFormProps {
  config: any;
  setConfig: (config: any) => void;
  uploadingFavicon: boolean;
  handleFaviconUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function GeneralSettingsForm({
  config,
  setConfig,
  uploadingFavicon,
  handleFaviconUpload,
}: GeneralSettingsFormProps) {
  const [showWoPin, setShowWoPin] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  return (
    <Flex direction="column" gap="6" className="animate-fade-up">

      {/* Favicon Upload */}
      <Card size="3">
        <Flex align="center" gap="2" mb="4">
          <Globe className="w-5 h-5 text-emerald-600" />
          <Heading size="4">Favicon (Browser Tab Icon)</Heading>
        </Flex>
        <Text as="p" size="2" color="gray" mb="4">
          Upload a PNG, SVG, or ICO file. This icon will be displayed in the browser tab when guests visit your invitation.
        </Text>
        <Flex align="center" gap="5">
          <Box style={{ width: 64, height: 64, borderRadius: "var(--radius-3)", border: "2px dashed var(--gray-5)", display: "flex", alignItems: "center", justifyItems: "center", backgroundColor: "var(--gray-2)", overflow: "hidden", flexShrink: 0 }}>
            {config.faviconUrl ? (
              <img src={config.faviconUrl} alt="Favicon preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            ) : (
              <Globe className="w-6 h-6 text-slate-300" style={{ margin: "auto" }} />
            )}
          </Box>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <Button asChild color="green" disabled={uploadingFavicon} style={{ cursor: "pointer" }}>
                <label>
                  {uploadingFavicon ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                  {config.faviconUrl ? 'Replace' : 'Upload'} Favicon
                  <input type="file" accept="image/png,image/svg+xml,image/x-icon,image/ico,image/vnd.microsoft.icon" onChange={handleFaviconUpload} style={{ display: "none" }} disabled={uploadingFavicon} />
                </label>
              </Button>
              {config.faviconUrl && (
                <Button
                  color="red"
                  variant="soft"
                  onClick={() => setConfig({ ...config, faviconUrl: '' })}
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </Button>
              )}
            </Flex>
            {config.faviconUrl && (
              <Text size="1" color="gray">Current: {config.faviconUrl.split('/').pop()}</Text>
            )}
          </Flex>
        </Flex>
      </Card>

      {/* Groom Information */}
      <Card size="3">
        <Flex align="center" gap="2" mb="5">
          <User className="w-5 h-5 text-blue-600" />
          <Heading size="4">Groom Information</Heading>
        </Flex>
        <Grid columns={{ initial: "1", md: "2" }} gap="4">
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>First Name</Text>
            <TextField.Root size="3" placeholder="e.g. John" value={config.groomFirstName || ""} onChange={e => setConfig({...config, groomFirstName: e.target.value})} />
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Last Name</Text>
            <TextField.Root size="3" placeholder="e.g. Doe" value={config.groomLastName || ""} onChange={e => setConfig({...config, groomLastName: e.target.value})} />
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Title / Gelar</Text>
            <TextField.Root size="3" placeholder="e.g. S.Kom" value={config.groomTitle || ""} onChange={e => setConfig({...config, groomTitle: e.target.value})} />
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Birth Order</Text>
            <Select.Root size="3" value={config.groomBirthOrder || "1"} onValueChange={v => setConfig({...config, groomBirthOrder: v})}>
              <Select.Trigger style={{ width: "100%" }} />
              <Select.Content>
                <Select.Item value="1">First (1st)</Select.Item>
                <Select.Item value="2">Second (2nd)</Select.Item>
                <Select.Item value="3">Third (3rd)</Select.Item>
                <Select.Item value="4">Fourth (4th)</Select.Item>
                <Select.Item value="5">Fifth (5th)</Select.Item>
                <Select.Item value="youngest">Youngest</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Gender</Text>
            <Select.Root size="3" value={config.groomGender || "son"} onValueChange={v => setConfig({...config, groomGender: v})}>
              <Select.Trigger style={{ width: "100%" }} />
              <Select.Content>
                <Select.Item value="son">Son (Putra)</Select.Item>
                <Select.Item value="daughter">Daughter (Putri)</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Father's Name (Without Mr/Bapak)</Text>
            <TextField.Root size="3" placeholder="e.g. Robert Doe" value={config.groomFatherName || ""} onChange={e => setConfig({...config, groomFatherName: e.target.value})} />
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Mother's Name (Without Mrs/Ibu)</Text>
            <TextField.Root size="3" placeholder="e.g. Alice Doe" value={config.groomMotherName || ""} onChange={e => setConfig({...config, groomMotherName: e.target.value})} />
          </Box>
          <Box>
            <Flex align="center" gap="1" mb="1">
              <Phone className="w-3 h-3 text-gray-500" />
              <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>WhatsApp Phone</Text>
            </Flex>
            <TextField.Root size="3" placeholder="e.g. +628123456789" value={config.phoneGroom || ""} onChange={e => setConfig({...config, phoneGroom: e.target.value})} />
          </Box>
        </Grid>

        <Flex align="center" gap="2" mt="6" mb="4">
          <Gift className="w-4 h-4 text-blue-500" />
          <Heading size="3">Gift Information</Heading>
        </Flex>
        <Grid columns={{ initial: "1", md: "3" }} gap="4">
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Bank Name</Text>
            <TextField.Root size="3" placeholder="e.g. BCA" value={config.giftBankGroom || ""} onChange={e => setConfig({...config, giftBankGroom: e.target.value})} />
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Account Number</Text>
            <TextField.Root size="3" placeholder="e.g. 1234567890" value={config.giftAccountGroom || ""} onChange={e => setConfig({...config, giftAccountGroom: e.target.value})} />
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Account Holder Name</Text>
            <TextField.Root size="3" placeholder="e.g. John Doe" value={config.giftNameGroom || ""} onChange={e => setConfig({...config, giftNameGroom: e.target.value})} />
          </Box>
        </Grid>
      </Card>

      {/* Bride Information */}
      <Card size="3">
        <Flex align="center" gap="2" mb="5">
          <User className="w-5 h-5 text-pink-600" />
          <Heading size="4">Bride Information</Heading>
        </Flex>
        <Grid columns={{ initial: "1", md: "2" }} gap="4">
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>First Name</Text>
            <TextField.Root size="3" placeholder="e.g. Jane" value={config.brideFirstName || ""} onChange={e => setConfig({...config, brideFirstName: e.target.value})} />
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Last Name</Text>
            <TextField.Root size="3" placeholder="e.g. Smith" value={config.brideLastName || ""} onChange={e => setConfig({...config, brideLastName: e.target.value})} />
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Title / Gelar</Text>
            <TextField.Root size="3" placeholder="e.g. B.A" value={config.brideTitle || ""} onChange={e => setConfig({...config, brideTitle: e.target.value})} />
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Birth Order</Text>
            <Select.Root size="3" value={config.brideBirthOrder || "2"} onValueChange={v => setConfig({...config, brideBirthOrder: v})}>
              <Select.Trigger style={{ width: "100%" }} />
              <Select.Content>
                <Select.Item value="1">First (1st)</Select.Item>
                <Select.Item value="2">Second (2nd)</Select.Item>
                <Select.Item value="3">Third (3rd)</Select.Item>
                <Select.Item value="4">Fourth (4th)</Select.Item>
                <Select.Item value="5">Fifth (5th)</Select.Item>
                <Select.Item value="youngest">Youngest</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Gender</Text>
            <Select.Root size="3" value={config.brideGender || "daughter"} onValueChange={v => setConfig({...config, brideGender: v})}>
              <Select.Trigger style={{ width: "100%" }} />
              <Select.Content>
                <Select.Item value="son">Son (Putra)</Select.Item>
                <Select.Item value="daughter">Daughter (Putri)</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Father's Name (Without Mr/Bapak)</Text>
            <TextField.Root size="3" placeholder="e.g. Michael Smith" value={config.brideFatherName || ""} onChange={e => setConfig({...config, brideFatherName: e.target.value})} />
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Mother's Name (Without Mrs/Ibu)</Text>
            <TextField.Root size="3" placeholder="e.g. Sarah Smith" value={config.brideMotherName || ""} onChange={e => setConfig({...config, brideMotherName: e.target.value})} />
          </Box>
          <Box>
            <Flex align="center" gap="1" mb="1">
              <Phone className="w-3 h-3 text-gray-500" />
              <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>WhatsApp Phone</Text>
            </Flex>
            <TextField.Root size="3" placeholder="e.g. +628123456789" value={config.phoneBride || ""} onChange={e => setConfig({...config, phoneBride: e.target.value})} />
          </Box>
        </Grid>

        <Flex align="center" gap="2" mt="6" mb="4">
          <Gift className="w-4 h-4 text-pink-500" />
          <Heading size="3">Gift Information</Heading>
        </Flex>
        <Grid columns={{ initial: "1", md: "3" }} gap="4">
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Bank Name</Text>
            <TextField.Root size="3" placeholder="e.g. BCA" value={config.giftBankBride || ""} onChange={e => setConfig({...config, giftBankBride: e.target.value})} />
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Account Number</Text>
            <TextField.Root size="3" placeholder="e.g. 0987654321" value={config.giftAccountBride || ""} onChange={e => setConfig({...config, giftAccountBride: e.target.value})} />
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Account Holder Name</Text>
            <TextField.Root size="3" placeholder="e.g. Jane Smith" value={config.giftNameBride || ""} onChange={e => setConfig({...config, giftNameBride: e.target.value})} />
          </Box>
        </Grid>
      </Card>

      {/* System Settings */}
      <Card size="3">
        <Flex align="center" gap="2" mb="5">
          <Lock className="w-5 h-5 text-emerald-600" />
          <Heading size="4">System Settings</Heading>
        </Flex>
        <Grid columns="1" gap="4">
          <Box>
            <Flex align="center" gap="1" mb="1">
              <Lock className="w-3 h-3 text-gray-500" />
              <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Access PIN Code</Text>
            </Flex>
            <TextField.Root 
              type={showWoPin ? "text" : "password"}
              size="3" 
              placeholder="e.g. 123456" 
              value={config.woPin || "123456"} 
              onChange={e => setConfig({...config, woPin: e.target.value})} 
              style={{ fontFamily: "monospace", letterSpacing: "0.1em" }} 
            >
              <TextField.Slot side="right">
                <IconButton 
                  size="1" 
                  variant="ghost" 
                  type="button"
                  onClick={() => setShowWoPin(!showWoPin)}
                  style={{ cursor: "pointer", color: "var(--gray-9)" }}
                >
                  {showWoPin ? <EyeOff width={16} height={16} /> : <Eye width={16} height={16} />}
                </IconButton>
              </TextField.Slot>
            </TextField.Root>
            <Text as="p" size="1" color="gray" mt="2">
              PIN code used by Wedding Organizers and Ushers to access the reception check-in portal.
            </Text>
          </Box>
        </Grid>
      </Card>

    </Flex>
  );
}
