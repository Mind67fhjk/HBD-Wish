/*
  # Update countdown to 1 day from now

  1. Updates
    - Set target_date to exactly 1 day from current time
    - This will make the countdown show 1 day remaining
*/

-- Update the celebration to have target_date as 1 day from now
UPDATE celebrations 
SET 
  target_date = now() + interval '1 day',
  updated_at = now()
WHERE title = 'Happy Birthday';