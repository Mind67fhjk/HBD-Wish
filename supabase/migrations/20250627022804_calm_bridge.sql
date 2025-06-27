/*
  # Add admin policies for guestbook management

  1. New Policies
    - Allow authenticated users (admins) to delete guestbook messages
    - Allow authenticated users (admins) to update guestbook messages (for replies)
    - Maintain existing public read/insert policies

  2. Security
    - Only authenticated users can delete/update messages
    - Public users can still read and insert messages
    - Admin replies are visible to everyone
*/

-- Add policy for admins to delete guestbook messages
CREATE POLICY "Authenticated users can delete guestbook messages"
  ON guestbook_messages FOR DELETE
  TO authenticated
  USING (true);

-- Add policy for admins to update guestbook messages (for replies)
CREATE POLICY "Authenticated users can update guestbook messages"
  ON guestbook_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);