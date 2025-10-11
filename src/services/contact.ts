import { supabase } from './supabase';

// Type definition for contact form submissions
export type ContactMessage = {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
  status?: 'new' | 'read' | 'replied';
};

// Function to submit a new contact form message
export const submitContactMessage = async (messageData: Omit<ContactMessage, 'id' | 'created_at' | 'status'>): Promise<ContactMessage> => {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([{
      name: messageData.name,
      email: messageData.email,
      subject: messageData.subject,
      message: messageData.message,
      status: 'new',
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error submitting contact message:', error);
    throw new Error(error.message || 'Failed to submit contact message');
  }

  if (!data) {
    throw new Error('No data returned from Supabase');
  }

  return data;
};

// Function to get all contact messages (for admin use)
export const getAllContactMessages = async (): Promise<ContactMessage[]> => {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contact messages:', error);
    throw new Error(error.message || 'Failed to fetch contact messages');
  }

  return data || [];
};

// Function to get a specific contact message by ID
export const getContactMessageById = async (id: string): Promise<ContactMessage | null> => {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Row not found
      return null;
    }
    console.error('Error fetching contact message:', error);
    throw new Error(error.message || 'Failed to fetch contact message');
  }

  return data;
};

// Function to update a contact message status (for admin use)
export const updateContactMessageStatus = async (id: string, status: 'new' | 'read' | 'replied'): Promise<ContactMessage> => {
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating contact message status:', error);
    throw new Error(error.message || 'Failed to update contact message status');
  }

  if (!data) {
    throw new Error('No data returned from Supabase');
  }

  return data;
};