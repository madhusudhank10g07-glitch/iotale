// lib/talesService.ts
import { supabase } from './supabase';

export interface Tale {
  id: string;
  user_id: string;
  title: string;
  duration: number;
  audio_url: string;
  file_path: string;
  created_at: string;
  updated_at: string;
}

/**
 * Upload audio file to Supabase Storage using FormData (Most reliable for React Native)
 */
export async function uploadAudioFile(
  uri: string,
  userId: string
): Promise<{ filePath: string; publicUrl: string } | null> {
  try {
    console.log('Starting upload for URI:', uri);
    
    // Create unique filename
    const timestamp = Date.now();
    const fileName = `recording_${timestamp}.m4a`;
    const filePath = `${userId}/${fileName}`;

    // Get session token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('No active session');
      return null;
    }

    // Create FormData
    const formData: any = new FormData();
    formData.append('', {
      uri: uri,
      type: 'audio/mp4',
      name: fileName,
    });

    console.log('Uploading to Supabase...', filePath);

    // Upload using fetch API
    const uploadUrl = `${supabase.supabaseUrl}/storage/v1/object/tale-recordings/${filePath}`;
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', errorText);
      return null;
    }

    const result = await response.json();
    console.log('Upload successful:', result);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('tale-recordings')
      .getPublicUrl(filePath);

    return {
      filePath: filePath,
      publicUrl: urlData.publicUrl,
    };
  } catch (error) {
    console.error('Error in uploadAudioFile:', error);
    return null;
  }
}

/**
 * Save tale to database
 */
export async function saveTale(
  title: string,
  duration: number,
  audioUrl: string,
  filePath: string
): Promise<Tale | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No user found');
      return null;
    }

    const { data, error } = await supabase
      .from('tales')
      .insert({
        user_id: user.id,
        title,
        duration,
        audio_url: audioUrl,
        file_path: filePath,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving tale:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in saveTale:', error);
    return null;
  }
}

/**
 * Fetch all tales for current user
 */
export async function fetchUserTales(): Promise<Tale[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No user found');
      return [];
    }

    const { data, error } = await supabase
      .from('tales')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tales:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchUserTales:', error);
    return [];
  }
}

/**
 * Delete tale and its audio file
 */
export async function deleteTale(taleId: string, filePath: string): Promise<boolean> {
  try {
    // Delete from storage first
    const { error: storageError } = await supabase.storage
      .from('tale-recordings')
      .remove([filePath]);

    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      // Continue to delete from database even if storage deletion fails
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('tales')
      .delete()
      .eq('id', taleId);

    if (dbError) {
      console.error('Error deleting tale from database:', dbError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteTale:', error);
    return false;
  }
}

/**
 * Update tale title
 */
export async function updateTaleTitle(taleId: string, newTitle: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('tales')
      .update({ title: newTitle })
      .eq('id', taleId);

    if (error) {
      console.error('Error updating tale title:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateTaleTitle:', error);
    return false;
  }
}

/**
 * Format duration from seconds to MM:SS format
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format date to DD/MM/YYYY
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}