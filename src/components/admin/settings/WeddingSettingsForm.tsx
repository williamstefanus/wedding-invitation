"use client";

import { Settings, Clock, Music, Calendar, MapPin, Link as LinkIcon, Gift, Image as ImageIcon, UploadCloud, Trash2, Loader2, MessageSquare, User } from "lucide-react";
import { Box, Flex, Grid, Card, Heading, Text, TextField, TextArea, Button, Code, Avatar, IconButton } from "@radix-ui/themes";
interface WeddingSettingsFormProps {
  config: any;
  setConfig: (config: any) => void;
  deadlines: any;
  setDeadlines: (deadlines: any) => void;
  sessions: any;
  setSessions: (sessions: any) => void;
  uploading: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  uploadingGroomPhoto?: boolean;
  handleGroomPhotoUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingBridePhoto?: boolean;
  handleBridePhotoUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function WeddingSettingsForm({
  config,
  setConfig,
  deadlines,
  setDeadlines,
  sessions,
  setSessions,
  uploading,
  handleImageUpload,
  removeImage,
  uploadingGroomPhoto,
  handleGroomPhotoUpload,
  uploadingBridePhoto,
  handleBridePhotoUpload
}: WeddingSettingsFormProps) {
  const moveImage = (index: number, direction: 'left' | 'right') => {
    if (!config.galleryImages) return;
    const newIdx = direction === 'left' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= config.galleryImages.length) return;
    const updated = [...config.galleryImages];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setConfig({ ...config, galleryImages: updated });
  };

  return (
    <Flex direction="column" gap="6" className="animate-fade-up">
      {/* General Config */}
      <Card size="3">
        <Flex align="center" gap="2" mb="5">
          <Settings className="w-5 h-5 text-amber-600" />
          <Heading size="4">General Configuration</Heading>
        </Flex>
        <Grid columns={{ initial: "1", md: "2" }} gap="4">
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Countdown Date/Time</Text>
            <TextField.Root 
              type="datetime-local" 
              size="3"
              value={config.countdownDate ? new Date(config.countdownDate).toISOString().slice(0, 16) : ""}
              onChange={e => setConfig({...config, countdownDate: e.target.value})}
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
              value={deadlines.wedding ? new Date(deadlines.wedding).toISOString().slice(0, 16) : ""}
              onChange={e => setDeadlines({...deadlines, wedding: e.target.value})}
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
              placeholder="e.g. /audio/bgm.mp3 or https://example.com/song.mp3"
              value={config.musicUrl || ""} 
              onChange={e => setConfig({...config, musicUrl: e.target.value})}
            />
          </Box>
        </Grid>
      </Card>

      {/* Event Sessions */}
      <Grid columns={{ initial: "1", md: "2" }} gap="6">
        {/* Holy Matrimony */}
        {sessions.holyMatrimony && (
          <Card size="3">
            <Flex align="center" gap="2" mb="5">
              <Calendar className="w-5 h-5 text-amber-600" />
              <Heading size="3">Holy Matrimony</Heading>
            </Flex>
            <Flex direction="column" gap="4">
              <Box>
                <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Date</Text>
                <TextField.Root type="date" size="3" value={sessions.holyMatrimony.date} onChange={e => setSessions({...sessions, holyMatrimony: {...sessions.holyMatrimony, date: e.target.value}})} />
              </Box>
              <Grid columns="2" gap="4">
                <Box>
                  <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Start Time</Text>
                  <TextField.Root type="time" size="3" value={sessions.holyMatrimony.start_time} onChange={e => setSessions({...sessions, holyMatrimony: {...sessions.holyMatrimony, start_time: e.target.value}})} />
                </Box>
                <Box>
                  <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>End Time</Text>
                  <TextField.Root type="time" size="3" value={sessions.holyMatrimony.end_time} onChange={e => setSessions({...sessions, holyMatrimony: {...sessions.holyMatrimony, end_time: e.target.value}})} />
                </Box>
              </Grid>
              <Box>
                <Flex align="center" gap="1" mb="1">
                  <MapPin className="w-3 h-3 text-gray-500" />
                  <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Venue Name</Text>
                </Flex>
                <TextField.Root size="3" value={sessions.holyMatrimony.venue_name} onChange={e => setSessions({...sessions, holyMatrimony: {...sessions.holyMatrimony, venue_name: e.target.value}})} />
              </Box>
              <Box>
                <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Address</Text>
                <TextArea size="3" value={sessions.holyMatrimony.address} onChange={e => setSessions({...sessions, holyMatrimony: {...sessions.holyMatrimony, address: e.target.value}})} rows={2} />
              </Box>
              <Box>
                <Flex align="center" gap="1" mb="1">
                  <LinkIcon className="w-3 h-3 text-gray-500" />
                  <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Google Maps URL</Text>
                </Flex>
                <TextField.Root size="3" value={sessions.holyMatrimony.google_maps_url} onChange={e => setSessions({...sessions, holyMatrimony: {...sessions.holyMatrimony, google_maps_url: e.target.value}})} />
              </Box>
            </Flex>
          </Card>
        )}

        {/* Reception */}
        {sessions.reception && (
          <Card size="3">
            <Flex align="center" gap="2" mb="5">
              <Calendar className="w-5 h-5 text-amber-600" />
              <Heading size="3">Reception Dinner</Heading>
            </Flex>
            <Flex direction="column" gap="4">
              <Box>
                <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Date</Text>
                <TextField.Root type="date" size="3" value={sessions.reception.date} onChange={e => setSessions({...sessions, reception: {...sessions.reception, date: e.target.value}})} />
              </Box>
              <Grid columns="2" gap="4">
                <Box>
                  <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Start Time</Text>
                  <TextField.Root type="time" size="3" value={sessions.reception.start_time} onChange={e => setSessions({...sessions, reception: {...sessions.reception, start_time: e.target.value}})} />
                </Box>
                <Box>
                  <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>End Time</Text>
                  <TextField.Root type="time" size="3" value={sessions.reception.end_time} onChange={e => setSessions({...sessions, reception: {...sessions.reception, end_time: e.target.value}})} />
                </Box>
              </Grid>
              <Box>
                <Flex align="center" gap="1" mb="1">
                  <MapPin className="w-3 h-3 text-gray-500" />
                  <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Venue Name</Text>
                </Flex>
                <TextField.Root size="3" value={sessions.reception.venue_name} onChange={e => setSessions({...sessions, reception: {...sessions.reception, venue_name: e.target.value}})} />
              </Box>
              <Box>
                <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Address</Text>
                <TextArea size="3" value={sessions.reception.address} onChange={e => setSessions({...sessions, reception: {...sessions.reception, address: e.target.value}})} rows={2} />
              </Box>
              <Box>
                <Flex align="center" gap="1" mb="1">
                  <LinkIcon className="w-3 h-3 text-gray-500" />
                  <Text size="1" weight="bold" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Google Maps URL</Text>
                </Flex>
                <TextField.Root size="3" value={sessions.reception.google_maps_url} onChange={e => setSessions({...sessions, reception: {...sessions.reception, google_maps_url: e.target.value}})} />
              </Box>
            </Flex>
          </Card>
        )}
      </Grid>

      {/* Wedding Bible Verse */}
      <Card size="3">
        <Flex align="center" gap="2" mb="5">
          <Text size="5">📖</Text>
          <Heading size="4">Wedding Bible Verse</Heading>
        </Flex>
        <Grid columns={{ initial: "1", md: "2" }} gap="4">
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Verse Text (EN)</Text>
            <TextArea 
              size="3"
              value={config.bibleVerseTextEn || ""} 
              onChange={e => setConfig({...config, bibleVerseTextEn: e.target.value})}
              placeholder="Every good and perfect gift is from above..."
              style={{ minHeight: "100px" }}
            />
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Verse Text (ID)</Text>
            <TextArea 
              size="3"
              value={config.bibleVerseTextId || ""} 
              onChange={e => setConfig({...config, bibleVerseTextId: e.target.value})}
              placeholder="Semua yang baik datang dari Allah..."
              style={{ minHeight: "100px" }}
            />
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Verse Reference (EN)</Text>
            <TextField.Root 
              size="3"
              value={config.bibleVerseReferenceEn || ""} 
              onChange={e => setConfig({...config, bibleVerseReferenceEn: e.target.value})}
              placeholder="e.g. James 1:17"
            />
          </Box>
          <Box>
            <Text as="div" size="1" weight="bold" color="gray" mb="1" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Verse Reference (ID)</Text>
            <TextField.Root 
              size="3"
              value={config.bibleVerseReferenceId || ""} 
              onChange={e => setConfig({...config, bibleVerseReferenceId: e.target.value})}
              placeholder="e.g. Yakobus 1:17"
            />
          </Box>
        </Grid>
      </Card>

      {/* Groom & Bride Profile Photos */}
      <Card size="3">
        <Flex align="center" gap="2" mb="5">
          <User className="w-5 h-5 text-indigo-600" />
          <Heading size="4">Profile Photos (Opening Screen)</Heading>
        </Flex>

        <Grid columns={{ initial: "1", md: "2" }} gap="6">
          <Box p="4" style={{ backgroundColor: "var(--gray-2)", borderRadius: "var(--radius-3)" }}>
            <Text weight="bold" mb="4" style={{ display: "block", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--blue-9)" }}>Groom Photo</Text>
            <Flex direction={{ initial: "column", sm: "row" }} align={{ initial: "start", sm: "center" }} gap="5">
              <Box style={{ width: 64, height: 64, borderRadius: "var(--radius-3)", border: "2px dashed var(--gray-5)", display: "flex", alignItems: "center", justifyItems: "center", backgroundColor: "var(--gray-3)", overflow: "hidden", flexShrink: 0 }}>
                {config.groomPhotoUrl ? (
                  <img src={config.groomPhotoUrl} alt="Groom preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <User className="w-6 h-6 text-slate-400" style={{ margin: "auto" }} />
                )}
              </Box>
              <Flex direction="column" gap="2">
                <Flex align="center" wrap="wrap" gap="2">
                  <Button asChild variant="soft" disabled={uploadingGroomPhoto} style={{ cursor: "pointer" }}>
                    <label>
                      {uploadingGroomPhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                      {config.groomPhotoUrl ? 'Replace' : 'Upload'} Photo
                      {handleGroomPhotoUpload && <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleGroomPhotoUpload} style={{ display: "none" }} disabled={uploadingGroomPhoto} />}
                    </label>
                  </Button>
                  {config.groomPhotoUrl && (
                    <Button
                      color="red"
                      variant="soft"
                      onClick={() => setConfig({ ...config, groomPhotoUrl: '' })}
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Flex>
          </Box>

          <Box p="4" style={{ backgroundColor: "var(--gray-2)", borderRadius: "var(--radius-3)" }}>
            <Text weight="bold" mb="4" style={{ display: "block", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--pink-9)" }}>Bride Photo</Text>
            <Flex direction={{ initial: "column", sm: "row" }} align={{ initial: "start", sm: "center" }} gap="5">
              <Box style={{ width: 64, height: 64, borderRadius: "var(--radius-3)", border: "2px dashed var(--gray-5)", display: "flex", alignItems: "center", justifyItems: "center", backgroundColor: "var(--gray-3)", overflow: "hidden", flexShrink: 0 }}>
                {config.bridePhotoUrl ? (
                  <img src={config.bridePhotoUrl} alt="Bride preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <User className="w-6 h-6 text-slate-400" style={{ margin: "auto" }} />
                )}
              </Box>
              <Flex direction="column" gap="2">
                <Flex align="center" wrap="wrap" gap="2">
                  <Button asChild variant="soft" disabled={uploadingBridePhoto} style={{ cursor: "pointer" }}>
                    <label>
                      {uploadingBridePhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                      {config.bridePhotoUrl ? 'Replace' : 'Upload'} Photo
                      {handleBridePhotoUpload && <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleBridePhotoUpload} style={{ display: "none" }} disabled={uploadingBridePhoto} />}
                    </label>
                  </Button>
                  {config.bridePhotoUrl && (
                    <Button
                      color="red"
                      variant="soft"
                      onClick={() => setConfig({ ...config, bridePhotoUrl: '' })}
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Flex>
          </Box>
        </Grid>
      </Card>

      {/* Gallery */}
      <Card size="3">
        <Flex justify="between" align="start" mb="5">
          <Box>
            <Flex align="center" gap="2">
              <ImageIcon className="w-5 h-5 text-amber-600" />
              <Heading size="4">Image Gallery & Layout Preview</Heading>
            </Flex>
            <Text as="p" size="2" color="gray" mt="1">
              Use arrow buttons to rearrange photos. The order below reflects the exact arrangement on the web invitation.
            </Text>
          </Box>
          <Box>
            <Button asChild color="amber" disabled={uploading} style={{ cursor: "pointer" }}>
              <label>
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                Upload Image
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploading} />
              </label>
            </Button>
          </Box>
        </Flex>

        <Flex direction="column" gap="5">
          {/* Section 1: Top Hero Image */}
          <Box p="4" style={{ backgroundColor: "var(--amber-2)", borderRadius: "var(--radius-3)", border: "1px solid var(--amber-5)" }}>
            <Flex align="center" gap="2" mb="3">
              <Text size="1" weight="bold" color="amber" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>🌟 Top Featured Hero Image (Web Cover)</Text>
            </Flex>
            {(!config.galleryImages || config.galleryImages.length === 0) ? (
              <Text size="2" color="gray" style={{ fontStyle: "italic" }}>No images uploaded yet.</Text>
            ) : (
              <Box style={{ position: "relative", aspectRatio: "16/9", maxWidth: "448px", borderRadius: "var(--radius-3)", overflow: "hidden", border: "1px solid var(--amber-6)" }} className="group">
                <img src={config.galleryImages[0]} alt="Hero preview" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                <Box className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <Button variant="solid" color="gray" onClick={() => moveImage(0, 'right')} disabled={config.galleryImages.length <= 1}>
                    Move Next ▶
                  </Button>
                  <Button color="red" onClick={() => removeImage(0)}>
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
          {config.galleryImages && config.galleryImages.length > 1 && (
            <Box p="4" style={{ backgroundColor: "var(--gray-2)", borderRadius: "var(--radius-3)", border: "1px solid var(--gray-5)" }}>
              <Text as="div" size="1" weight="bold" color="gray" mb="3" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                🍱 Bento Grid Block 1 (Positions #2 to #6 on Web)
              </Text>
              <Grid columns={{ initial: "2", sm: "3", md: "5" }} gap="3">
                {config.galleryImages.slice(1, 6).map((url: string, subIdx: number) => {
                  const actualIdx = subIdx + 1;
                  return (
                    <Box key={actualIdx} className="group" style={{ position: "relative", aspectRatio: "1", borderRadius: "var(--radius-3)", overflow: "hidden", border: "1px solid var(--gray-5)", background: "var(--color-panel-solid)" }}>
                      <img src={url} alt="Bento item" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                      <Box className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                        <Flex gap="1">
                          <Button size="1" variant="solid" color="gray" onClick={() => moveImage(actualIdx, 'left')}>◀</Button>
                          <Button size="1" variant="solid" color="gray" onClick={() => moveImage(actualIdx, 'right')} disabled={actualIdx === config.galleryImages.length - 1}>▶</Button>
                        </Flex>
                        <Button size="1" color="red" onClick={() => removeImage(actualIdx)}>
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
          {config.galleryImages && config.galleryImages.length > 6 && (
            <Box p="4" style={{ backgroundColor: "var(--gray-2)", borderRadius: "var(--radius-3)", border: "1px solid var(--gray-5)" }}>
              <Text as="div" size="1" weight="bold" color="gray" mb="3" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                📱 Additional Gallery Photos (Positions #7+ on Web)
              </Text>
              <Grid columns={{ initial: "2", sm: "3", md: "5" }} gap="3">
                {config.galleryImages.slice(6).map((url: string, subIdx: number) => {
                  const actualIdx = subIdx + 6;
                  return (
                    <Box key={actualIdx} className="group" style={{ position: "relative", aspectRatio: "1", borderRadius: "var(--radius-3)", overflow: "hidden", border: "1px solid var(--gray-5)", background: "var(--color-panel-solid)" }}>
                      <img src={url} alt="Bento item" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                      <Box className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                        <Flex gap="1">
                          <Button size="1" variant="solid" color="gray" onClick={() => moveImage(actualIdx, 'left')}>◀</Button>
                          <Button size="1" variant="solid" color="gray" onClick={() => moveImage(actualIdx, 'right')} disabled={actualIdx === config.galleryImages.length - 1}>▶</Button>
                        </Flex>
                        <Button size="1" color="red" onClick={() => removeImage(actualIdx)}>
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
          <MessageSquare className="w-5 h-5 text-amber-600" />
          <Heading size="4">WhatsApp Message Template</Heading>
        </Flex>
        <Text as="p" size="2" color="gray" mb="4">
          Use <Code>{"{nama}"}</Code>, <Code>{"{link}"}</Code>, and <Code>{"{deadline}"}</Code> as placeholders.
          They will be replaced dynamically when copying.
        </Text>
        <TextArea
          rows={5}
          size="3"
          value={config.waTemplateWedding || ""}
          onChange={e => setConfig({ ...config, waTemplateWedding: e.target.value })}
          placeholder="Halo {nama}! ..."
          style={{ fontFamily: "monospace" }}
        />
      </Card>
    </Flex>
  );
}
