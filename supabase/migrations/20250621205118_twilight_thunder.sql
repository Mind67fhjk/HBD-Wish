/*
  # Remove Eleni's message from guestbook

  1. Delete Operation
    - Remove any guestbook messages where author_name is 'Eleni'
    - This will automatically update both main page and admin page due to real-time subscriptions
*/

-- Remove Eleni's message from guestbook_messages
DELETE FROM guestbook_messages 
WHERE author_name = 'Eleni' OR author_name ILIKE '%eleni%';

-- Also remove any variations of the name (case insensitive)
DELETE FROM guestbook_messages 
WHERE LOWER(author_name) LIKE '%eleni%';