-- Create the contact_messages table for the TerraGuardian contact form
CREATE TABLE contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on created_at for better query performance
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);

-- Create an index on status for filtering messages by status
CREATE INDEX idx_contact_messages_status ON contact_messages(status);

-- Enable Row Level Security (RLS) for the table
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anyone to insert (for the contact form)
CREATE POLICY "Allow anyone to submit contact form" ON contact_messages
FOR INSERT TO public
WITH CHECK (true);

-- Create a policy to allow authenticated users to view messages (for admin dashboard)
CREATE POLICY "Allow authenticated users to view contact messages" ON contact_messages
FOR SELECT TO authenticated
USING (true);

-- Optional: To add the trigger manually in Supabase dashboard:
-- Function definition:
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = NOW();
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
-- 
-- Trigger definition:
-- CREATE TRIGGER update_contact_messages_updated_at 
--     BEFORE UPDATE ON contact_messages 
--     FOR EACH ROW 
--     EXECUTE FUNCTION update_updated_at_column();