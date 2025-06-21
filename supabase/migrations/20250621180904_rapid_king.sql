/*
  # Update celebration for ElaJa's birthday

  1. Updates
    - Update default celebration with ElaJa's information
    - Add personalized quiz questions for ElaJa
    - Set proper birthday date

  2. Data
    - Personalized celebration details
    - Custom quiz questions about ElaJa
*/

-- Update the default celebration for ElaJa
UPDATE celebrations 
SET 
  title = 'Happy Birthday',
  description = 'Join us in celebrating this special day with joy, laughter, and wonderful memories! Share your wishes, upload photos, and take the fun quiz.',
  target_date = '2025-12-25T00:00:00+00:00'  -- Update this to ElaJa's actual birthday
WHERE title = 'ElaJa''s Amazing Birthday Celebration' OR title = 'Birthday Celebration';

-- Clear existing quiz questions and add personalized ones for ElaJa
DELETE FROM quiz_questions WHERE celebration_id IN (
  SELECT id FROM celebrations WHERE title = 'Happy Birthday'
);

-- Add personalized quiz questions about ElaJa
DO $$
DECLARE
  celebration_id uuid;
BEGIN
  SELECT id INTO celebration_id FROM celebrations WHERE title = 'Happy Birthday' LIMIT 1;
  
  IF celebration_id IS NOT NULL THEN
    INSERT INTO quiz_questions (celebration_id, question, options, correct_answer, order_index) VALUES
    (celebration_id, 'What makes ElaJa truly special?', '["Their incredible creativity", "Their amazing sense of humor", "Their kind and caring heart", "All of the above"]', 3, 1),
    (celebration_id, 'What''s ElaJa''s favorite way to celebrate?', '["Surrounded by loved ones", "With music and dancing", "Creating beautiful memories", "All of these sound like ElaJa"]', 3, 2),
    (celebration_id, 'How would you describe ElaJa in one word?', '["Amazing", "Inspiring", "Wonderful", "Impossible to choose just one!"]', 3, 3),
    (celebration_id, 'What''s the best birthday wish for ElaJa?', '["Health and happiness", "Dreams coming true", "Endless joy and laughter", "All the love in the world"]', 3, 4)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;