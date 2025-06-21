/*
  # Add admin reply functionality to guestbook messages

  1. Changes
    - Add admin_reply column to guestbook_messages table
    - Add reply_timestamp column to guestbook_messages table
    - These columns will store admin replies to user messages

  2. Security
    - Maintain existing RLS policies
    - Admin replies are visible to everyone (same as messages)
*/

-- Add admin reply columns to guestbook_messages table
DO $$
BEGIN
  -- Add admin_reply column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'guestbook_messages' AND column_name = 'admin_reply'
  ) THEN
    ALTER TABLE guestbook_messages ADD COLUMN admin_reply text;
  END IF;

  -- Add reply_timestamp column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'guestbook_messages' AND column_name = 'reply_timestamp'
  ) THEN
    ALTER TABLE guestbook_messages ADD COLUMN reply_timestamp timestamptz;
  END IF;
END $$;