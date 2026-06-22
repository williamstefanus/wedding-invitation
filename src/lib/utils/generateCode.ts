export function generateInvitationCode(guestName: string): string {
  // Remove non-alphanumeric characters, convert to uppercase, take up to 6 chars
  const cleanName = guestName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 6);
  
  // Generate 4 random alphanumeric characters
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomStr = '';
  for (let i = 0; i < 4; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Fallback if name is empty for some reason
  if (!cleanName) {
    let fallback = '';
    for (let i = 0; i < 8; i++) {
      fallback += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return fallback;
  }
  
  return `${cleanName}-${randomStr}`;
}
