/*
  # Add admin policies for photo management

  1. New Policies
    - Allow authenticated users (admins) to delete photos
    - Maintain existing public read/insert policies

  2. Security
    - Only authenticated users can delete photos
    - Public users can still view and upload photos
*/

-- Add policy for admins to delete photos
CREATE POLICY "Authenticated users can delete photos"
  ON photos FOR DELETE
  TO authenticated
  USING (true);