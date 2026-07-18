"use client";

import { Clock, Calendar, MapPin, Link as LinkIcon, Music, MessageSquare, Gift, Image as ImageIcon, UploadCloud, Trash2, Loader2 } from "lucide-react";
import { Box, Flex, Grid, Card, Heading, Text, TextField, TextArea, Button, Code } from "@radix-ui/themes";
interface SangjitSettingsFormProps {
  config: any;
  setConfig: (config: any) => void;
  deadlines: any;
  setDeadlines: (deadlines: any) => void;
  sessions: any;
  setSessions: (sessions: any) => void;
  uploading: boolean;
  handleSangjitImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeSangjitImage: (index: number) => void;
}

export function SangjitSettingsForm({
  config,
  setConfig,
  deadlines,
  setDeadlines,
  sessions,
  setSessions,
  uploading,
  handleSangjitImageUpload,
  removeSangjitImage
}: SangjitSettingsFormProps) {
  const moveSangjitImage = (index: number, direction: 'left' | 'right') => {
    if (!config.sangjitGalleryImages) return;
    const newIdx = direction === 'left' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= config.sangjitGalleryImages.length) return;
    const updated = [...config.sangjitGalleryImages];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setConfig({ ...config, sangjitGalleryImages: updated });
  };
  return (
    <Flex direction="column" gap="6" className="animate-fade-up">

      {/* General Config */}
      <Card size="3">
        <Flex align="center" gap="2" mb="5">
          <Clock className="w-5 h-5 text-rose-600" />
          <Heading size="4">General Configuration</Heading>
        </Flex>
        <Grid columns={{ initial: "1", md: "2" }} gap="4">
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Countdown Date/Time</Text>
            <TextField.Root
              type="datetime-local"
              size="3"
              value={config.sangjitCountdownDate ? new Date(config.sangjitCountdownDate).toISOString().slice(0, 16) : ""}
              onChange={e => setConfig({ ...config, sangjitCountdownDate: e.target.value })}
            />
          </Box>
          <Box>
            <Flex align="center" gap="1" mb="1">
              <Clock className="w-3 h-3 text-gray-500" />
              <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>RSVP Submission Deadline</Text>
            </Flex>
            <TextField.Root
              type="datetime-local"
              size="3"
              value={deadlines.sangjit ? new Date(deadlines.sangjit).toISOString().slice(0, 16) : ""}
              onChange={e => setDeadlines({ ...deadlines, sangjit: e.target.value })}
            />
            <Text as="p" size="1" color="gray" mt="1">After this date, new RSVP submissions will be closed.</Text>
          </Box>
          <Box style={{ gridColumn: "1 / -1" }}>
            <Flex align="center" gap="1" mb="1">
              <Music className="w-3 h-3 text-gray-500" />
              <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Background Music URL</Text>
            </Flex>
            <TextField.Root
              size="3"
              placeholder="e.g. /audio/sangjit-bgm.mp3 or https://example.com/song.mp3"
              value={config.sangjitMusicUrl || ""}
              onChange={e => setConfig({ ...config, sangjitMusicUrl: e.target.value })}
            />
          </Box>
        </Grid>
      </Card>

      {/* Sangjit Bible Verse */}
      <Card size="3">
        <Flex align="center" gap="2" mb="5">
          <Text size="5">📖</Text>
          <Heading size="4">Sangjit Bible Verse</Heading>
        </Flex>
        <Grid columns={{ initial: "1", md: "2" }} gap="4">
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Verse Text (EN)</Text>
            <TextArea 
              size="3"
              value={config.sangjitBibleVerseTextEn || ""} 
              onChange={e => setConfig({...config, sangjitBibleVerseTextEn: e.target.value})}
              placeholder="And over all these virtues put on love..."
              style={{ minHeight: "100px" }}
            />
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Verse Text (ID)</Text>
            <TextArea 
              size="3"
              value={config.sangjitBibleVerseTextId || ""} 
              onChange={e => setConfig({...config, sangjitBibleVerseTextId: e.target.value})}
              placeholder="Dan di atas semuanya itu: kenakanlah kasih..."
              style={{ minHeight: "100px" }}
            />
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Verse Reference (EN)</Text>
            <TextField.Root 
              size="3"
              value={config.sangjitBibleVerseReferenceEn || ""} 
              onChange={e => setConfig({...config, sangjitBibleVerseReferenceEn: e.target.value})}
              placeholder="e.g. Colossians 3:14"
            />
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Verse Reference (ID)</Text>
            <TextField.Root 
              size="3"
              value={config.sangjitBibleVerseReferenceId || ""} 
              onChange={e => setConfig({...config, sangjitBibleVerseReferenceId: e.target.value})}
              placeholder="e.g. Kolose 3:14"
            />
          </Box>
        </Grid>
      </Card>

      {/* Event Details */}
      <Card size="3">
        <Flex align="center" gap="2" mb="5">
          <Calendar className="w-5 h-5 text-rose-600" />
          <Heading size="4">Event Details</Heading>
        </Flex>
        <Flex direction="column" gap="4">
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Date</Text>
            <TextField.Root type="date" size="3" value={sessions.sangjit?.date || ""} onChange={e => setSessions({...sessions, sangjit: {...(sessions.sangjit || {}), date: e.target.value}})} style={{ width: "100%", maxWidth: "400px" }} />
          </Box>
          <Grid columns="2" gap="4" style={{ maxWidth: "400px" }}>
            <Box>
              <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Start Time</Text>
              <TextField.Root type="time" size="3" value={sessions.sangjit?.start_time || ""} onChange={e => setSessions({...sessions, sangjit: {...(sessions.sangjit || {}), start_time: e.target.value}})} />
            </Box>
            <Box>
              <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>End Time</Text>
              <TextField.Root type="time" size="3" value={sessions.sangjit?.end_time || ""} onChange={e => setSessions({...sessions, sangjit: {...(sessions.sangjit || {}), end_time: e.target.value}})} />
            </Box>
          </Grid>
          <Box>
            <Flex align="center" gap="1" mb="1">
              <MapPin className="w-3 h-3 text-gray-500" />
              <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Venue Name</Text>
            </Flex>
            <TextField.Root size="3" value={sessions.sangjit?.venue_name || ""} onChange={e => setSessions({...sessions, sangjit: {...(sessions.sangjit || {}), venue_name: e.target.value}})} />
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Address</Text>
            <TextArea size="3" value={sessions.sangjit?.address || ""} onChange={e => setSessions({...sessions, sangjit: {...(sessions.sangjit || {}), address: e.target.value}})} rows={2} />
          </Box>
          <Box>
            <Flex align="center" gap="1" mb="1">
              <LinkIcon className="w-3 h-3 text-gray-500" />
              <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Google Maps URL</Text>
            </Flex>
            <TextField.Root size="3" value={sessions.sangjit?.google_maps_url || ""} onChange={e => setSessions({...sessions, sangjit: {...(sessions.sangjit || {}), google_maps_url: e.target.value}})} />
          </Box>
        </Flex>
      </Card>

      {/* Gallery */}
      <Card size="3">
        <Flex justify="between" align="start" mb="5">
          <Box>
            <Flex align="center" gap="2">
              <ImageIcon className="w-5 h-5 text-ruby-600" />
              <Heading size="4">Image Gallery & Layout Preview</Heading>
            </Flex>
            <Callout.Root color="ruby" mb="4" mt="2">
              <Callout.Icon><CheckCircle2 className="w-4 h-4" /></Callout.Icon>
              <Callout.Text>Sangjit settings updated successfully!</Callout.Text>
            </Callout.Root>
            <Text as="p" size="2" color="gray" mt="1">
              Use arrow buttons to rearrange photos. The order below reflects the exact arrangement on the web invitation.
            </Text>
          </Box>
          <label>
            <Button as="span" color="ruby" disabled={uploading} style={{ cursor: "pointer" }}>
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              Upload Image
            </Button>
            <input type="file" accept="image/*" onChange={handleSangjitImageUpload} style={{ display: "none" }} disabled={uploading} />
          </label>
        </Flex>

        <Flex direction="column" gap="5">
          {/* Section 1: Top Hero Image */}
          <Box p="4" style={{ backgroundColor: "var(--rose-2)", borderRadius: "var(--radius-3)", border: "1px solid var(--rose-5)" }}>
            <Flex align="center" gap="2" mb="3">
              <Text size="1" weight="bold" color="rose" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>🌟 Top Featured Hero Image (Web Cover)</Text>
            </Flex>
            {(!config.sangjitGalleryImages || config.sangjitGalleryImages.length === 0) ? (
              <Text size="2" color="gray" style={{ fontStyle: "italic" }}>No images uploaded yet.</Text>
            ) : (
              <Box style={{ position: "relative", aspectRatio: "16/9", maxWidth: "448px", borderRadius: "var(--radius-3)", overflow: "hidden", border: "1px solid var(--rose-6)" }} className="group">
                <img src={config.sangjitGalleryImages[0]} alt="Hero preview" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                <Box className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <Button variant="solid" color="gray" onClick={() => moveSangjitImage(0, 'right')} disabled={config.sangjitGalleryImages.length <= 1}>
                    Move Next ▶
                  </Button>
                  <Button color="red" onClick={() => removeSangjitImage(0)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Box>
                <Text size="1" weight="bold" style={{ position: "absolute", bottom: "8px", left: "8px", backgroundColor: "rgba(0,0,0,0.6)", color: "white", padding: "2px 6px", borderRadius: "4px" }}>
                  #1 Featured
                </Text>
              </Box>
            )}
          </Box>

          {/* Section 2: Bento Block 1 (Next 5 images) */}
          {config.sangjitGalleryImages && config.sangjitGalleryImages.length > 1 && (
            <Box p="4" style={{ backgroundColor: "var(--gray-2)", borderRadius: "var(--radius-3)", border: "1px solid var(--gray-5)" }}>
              <Text as="div" size="1" weight="bold" color="gray" mb="3" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                🍱 Bento Grid Block 1 (Positions #2 to #6 on Web)
              </Text>
              <Grid columns={{ initial: "2", sm: "3", md: "5" }} gap="3">
                {config.sangjitGalleryImages.slice(1, 6).map((url: string, subIdx: number) => {
                  const actualIdx = subIdx + 1;
                  return (
                    <Box key={actualIdx} className="group" style={{ position: "relative", aspectRatio: "1", borderRadius: "var(--radius-3)", overflow: "hidden", border: "1px solid var(--gray-5)", backgroundColor: "white" }}>
                      <img src={url} alt="Bento item" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                      <Box className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                        <Flex gap="1">
                          <Button size="1" variant="solid" color="gray" onClick={() => moveSangjitImage(actualIdx, 'left')}>◀</Button>
                          <Button size="1" variant="solid" color="gray" onClick={() => moveSangjitImage(actualIdx, 'right')} disabled={actualIdx === config.sangjitGalleryImages.length - 1}>▶</Button>
                        </Flex>
                        <Button size="1" color="red" onClick={() => removeSangjitImage(actualIdx)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </Box>
                      <Text size="1" weight="bold" style={{ position: "absolute", bottom: "4px", left: "4px", backgroundColor: "rgba(0,0,0,0.6)", color: "white", padding: "2px 6px", borderRadius: "4px", fontSize: "10px" }}>
                        #{actualIdx + 1}
                      </Text>
                    </Box>
                  );
                })}
              </Grid>
            </Box>
          )}

          {/* Section 3: Bento Block 2 / Remaining Grid */}
          {config.sangjitGalleryImages && config.sangjitGalleryImages.length > 6 && (
            <Box p="4" style={{ backgroundColor: "var(--gray-2)", borderRadius: "var(--radius-3)", border: "1px solid var(--gray-5)" }}>
              <Text as="div" size="1" weight="bold" color="gray" mb="3" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                📱 Additional Gallery Photos (Positions #7+ on Web)
              </Text>
              <Grid columns={{ initial: "2", sm: "3", md: "5" }} gap="3">
                {config.sangjitGalleryImages.slice(6).map((url: string, subIdx: number) => {
                  const actualIdx = subIdx + 6;
                  return (
                    <Box key={actualIdx} className="group" style={{ position: "relative", aspectRatio: "1", borderRadius: "var(--radius-3)", overflow: "hidden", border: "1px solid var(--gray-5)", backgroundColor: "white" }}>
                      <img src={url} alt="Bento item" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                      <Box className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                        <Flex gap="1">
                          <Button size="1" variant="solid" color="gray" onClick={() => moveSangjitImage(actualIdx, 'left')}>◀</Button>
                          <Button size="1" variant="solid" color="gray" onClick={() => moveSangjitImage(actualIdx, 'right')} disabled={actualIdx === config.sangjitGalleryImages.length - 1}>▶</Button>
                        </Flex>
                        <Button size="1" color="red" onClick={() => removeSangjitImage(actualIdx)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </Box>
                      <Text size="1" weight="bold" style={{ position: "absolute", bottom: "4px", left: "4px", backgroundColor: "rgba(0,0,0,0.6)", color: "white", padding: "2px 6px", borderRadius: "4px", fontSize: "10px" }}>
                        #{actualIdx + 1}
                      </Text>
                    </Box>
                  );
                })}
              </Grid>
            </Box>
          )}
        </Flex>
      </Card>

      {/* WhatsApp Message Template */}
      <Card size="3">
        <Flex align="center" gap="2" mb="2">
          <MessageSquare className="w-5 h-5 text-rose-600" />
          <Heading size="4">WhatsApp Message Template</Heading>
        </Flex>
        <Text as="p" size="2" color="gray" mb="4">
          Use <Code>{"{nama}"}</Code>, <Code>{"{link}"}</Code>, and <Code>{"{deadline}"}</Code> as placeholders.
          They will be replaced dynamically when copying.
        </Text>
        <TextArea
          rows={5}
          size="3"
          value={config.waTemplateSangjit || ""}
          onChange={e => setConfig({ ...config, waTemplateSangjit: e.target.value })}
          placeholder="Halo {nama}! ..."
          style={{ fontFamily: "monospace" }}
        />
      </Card>

    </Flex>
  );
}
