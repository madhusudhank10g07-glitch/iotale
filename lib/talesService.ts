// // lib/talesService.ts
// import { supabase } from './supabase';

// export interface Tale {
//   id: string;
//   user_id: string;
//   title: string;
//   duration: number;
//   audio_url: string;
//   file_path: string;
//   created_at: string;
//   updated_at: string;
// }

// /**
//  * Upload audio file to Supabase Storage using FormData (Most reliable for React Native)
//  */
// export async function uploadAudioFile(
//   uri: string,
//   userId: string
// ): Promise<{ filePath: string; publicUrl: string } | null> {
//   try {
//     console.log('Starting upload for URI:', uri);
    
//     // Create unique filename
//     const timestamp = Date.now();
//     const fileName = `recording_${timestamp}.m4a`;
//     const filePath = `${userId}/${fileName}`;

//     // Get session token
//     const { data: { session } } = await supabase.auth.getSession();
    
//     if (!session) {
//       console.error('No active session');
//       return null;
//     }

//     // Create FormData
//     const formData: any = new FormData();
//     formData.append('', {
//       uri: uri,
//       type: 'audio/mp4',
//       name: fileName,
//     });

//     console.log('Uploading to Supabase...', filePath);

//     // Upload using fetch API
//     const uploadUrl = `${supabase.supabaseUrl}/storage/v1/object/tale-recordings/${filePath}`;
    
//     const response = await fetch(uploadUrl, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${session.access_token}`,
//       },
//       body: formData,
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('Upload failed:', errorText);
//       return null;
//     }

//     const result = await response.json();
//     console.log('Upload successful:', result);

//     // Get public URL
//     const { data: urlData } = supabase.storage
//       .from('tale-recordings')
//       .getPublicUrl(filePath);

//     return {
//       filePath: filePath,
//       publicUrl: urlData.publicUrl,
//     };
//   } catch (error) {
//     console.error('Error in uploadAudioFile:', error);
//     return null;
//   }
// }

// /**
//  * Save tale to database
//  */
// export async function saveTale(
//   title: string,
//   duration: number,
//   audioUrl: string,
//   filePath: string
// ): Promise<Tale | null> {
//   try {
//     const { data: { user } } = await supabase.auth.getUser();
    
//     if (!user) {
//       console.error('No user found');
//       return null;
//     }

//     const { data, error } = await supabase
//       .from('tales')
//       .insert({
//         user_id: user.id,
//         title,
//         duration,
//         audio_url: audioUrl,
//         file_path: filePath,
//       })
//       .select()
//       .single();

//     if (error) {
//       console.error('Error saving tale:', error);
//       return null;
//     }

//     return data;
//   } catch (error) {
//     console.error('Error in saveTale:', error);
//     return null;
//   }
// }

// /**
//  * Fetch all tales for current user
//  */
// export async function fetchUserTales(): Promise<Tale[]> {
//   try {
//     const { data: { user } } = await supabase.auth.getUser();
    
//     if (!user) {
//       console.error('No user found');
//       return [];
//     }

//     const { data, error } = await supabase
//       .from('tales')
//       .select('*')
//       .eq('user_id', user.id)
//       .order('created_at', { ascending: false });

//     if (error) {
//       console.error('Error fetching tales:', error);
//       return [];
//     }

//     return data || [];
//   } catch (error) {
//     console.error('Error in fetchUserTales:', error);
//     return [];
//   }
// }

// /**
//  * Delete tale and its audio file
//  */
// export async function deleteTale(taleId: string, filePath: string): Promise<boolean> {
//   try {
//     // Delete from storage first
//     const { error: storageError } = await supabase.storage
//       .from('tale-recordings')
//       .remove([filePath]);

//     if (storageError) {
//       console.error('Error deleting file from storage:', storageError);
//       // Continue to delete from database even if storage deletion fails
//     }

//     // Delete from database
//     const { error: dbError } = await supabase
//       .from('tales')
//       .delete()
//       .eq('id', taleId);

//     if (dbError) {
//       console.error('Error deleting tale from database:', dbError);
//       return false;
//     }

//     return true;
//   } catch (error) {
//     console.error('Error in deleteTale:', error);
//     return false;
//   }
// }

// /**
//  * Update tale title
//  */
// export async function updateTaleTitle(taleId: string, newTitle: string): Promise<boolean> {
//   try {
//     const { error } = await supabase
//       .from('tales')
//       .update({ title: newTitle })
//       .eq('id', taleId);

//     if (error) {
//       console.error('Error updating tale title:', error);
//       return false;
//     }

//     return true;
//   } catch (error) {
//     console.error('Error in updateTaleTitle:', error);
//     return false;
//   }
// }

// /**
//  * Format duration from seconds to MM:SS format
//  */
// export function formatDuration(seconds: number): string {
//   const mins = Math.floor(seconds / 60);
//   const secs = seconds % 60;
//   return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
// }

// /**
//  * Format date to DD/MM/YYYY
//  */
// export function formatDate(dateString: string): string {
//   const date = new Date(dateString);
//   const day = date.getDate().toString().padStart(2, '0');
//   const month = (date.getMonth() + 1).toString().padStart(2, '0');
//   const year = date.getFullYear();
//   return `${day}/${month}/${year}`;
// }




// lib/talesService.ts
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const TALES_DIRECTORY = `${FileSystem.documentDirectory}tales/`;
const TALES_METADATA_KEY = '@tales_metadata';

// Ensure tales directory exists
async function ensureDirectoryExists() {
  try {
    const dirInfo = await FileSystem.getInfoAsync(TALES_DIRECTORY);
    
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(TALES_DIRECTORY, { intermediates: true });
      console.log('Tales directory created:', TALES_DIRECTORY);
    }
  } catch (error) {
    console.error('Error ensuring directory exists:', error);
  }
}

// Normalize URI to ensure it's absolute and properly formatted
function normalizeUri(uri: string): string {
  // If URI is already absolute (starts with file://)
  if (uri.startsWith('file://')) {
    return uri;
  }
  
  // If it starts with /, add file://
  if (uri.startsWith('/')) {
    return `file://${uri}`;
  }
  
  // Otherwise, assume it's relative to documentDirectory
  return `${FileSystem.documentDirectory}${uri}`;
}

/**
 * Upload audio file to local storage
 */
export async function uploadAudioFile(
  uri: string,
  userId: string
): Promise<{ filePath: string; publicUrl: string } | null> {
  try {
    console.log('Starting local file save for URI:', uri);
    
    await ensureDirectoryExists();
    
    // Normalize the source URI
    const normalizedSourceUri = normalizeUri(uri);
    console.log('Normalized source URI:', normalizedSourceUri);
    
    // Create unique filename
    const timestamp = Date.now();
    const fileName = `recording_${timestamp}.m4a`;
    const destinationUri = `${TALES_DIRECTORY}${fileName}`;
    
    console.log('Destination URI:', destinationUri);

    // Copy file to tales directory
    await FileSystem.copyAsync({
      from: normalizedSourceUri,
      to: destinationUri,
    });

    console.log('File saved successfully to:', destinationUri);

    return {
      filePath: fileName,
      publicUrl: destinationUri,
    };
  } catch (error) {
    console.error('Error in uploadAudioFile:', error);
    
    // Fallback: Try reading and writing manually
    try {
      console.log('Attempting fallback method...');
      const normalizedSourceUri = normalizeUri(uri);
      const timestamp = Date.now();
      const fileName = `recording_${timestamp}.m4a`;
      const destinationUri = `${TALES_DIRECTORY}${fileName}`;
      
      // Read as base64
      const base64 = await FileSystem.readAsStringAsync(normalizedSourceUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Write to new location
      await FileSystem.writeAsStringAsync(destinationUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      console.log('File saved via fallback method:', destinationUri);
      
      return {
        filePath: fileName,
        publicUrl: destinationUri,
      };
    } catch (fallbackError) {
      console.error('Fallback method also failed:', fallbackError);
      return null;
    }
  }
}

/**
 * Save tale metadata to AsyncStorage
 */
export async function saveTale(
  title: string,
  duration: number,
  audioUrl: string,
  filePath: string
): Promise<Tale | null> {
  try {
    // Get existing tales
    const existingTales = await fetchUserTales();
    
    // Create new tale
    const newTale: Tale = {
      id: Date.now().toString(),
      user_id: 'local_user',
      title,
      duration,
      audio_url: audioUrl,
      file_path: filePath,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to existing tales
    const updatedTales = [newTale, ...existingTales];
    
    // Save to AsyncStorage
    await AsyncStorage.setItem(TALES_METADATA_KEY, JSON.stringify(updatedTales));

    console.log('Tale saved successfully:', newTale);
    return newTale;
  } catch (error) {
    console.error('Error in saveTale:', error);
    return null;
  }
}

/**
 * Fetch all tales from AsyncStorage
 */
export async function fetchUserTales(): Promise<Tale[]> {
  try {
    const talesJson = await AsyncStorage.getItem(TALES_METADATA_KEY);
    
    if (!talesJson) {
      return [];
    }

    const tales: Tale[] = JSON.parse(talesJson);
    
    // Verify that audio files still exist
    const validTales = await Promise.all(
      tales.map(async (tale) => {
        try {
          const info = await FileSystem.getInfoAsync(tale.audio_url);
          return info.exists ? tale : null;
        } catch (error) {
          console.error('Error checking file existence:', error);
          return null;
        }
      })
    );

    // Filter out null values (deleted files)
    return validTales.filter((tale): tale is Tale => tale !== null);
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
    // Get existing tales
    const tales = await fetchUserTales();
    
    // Find the tale to delete
    const taleToDelete = tales.find(t => t.id === taleId);
    
    if (!taleToDelete) {
      console.error('Tale not found');
      return false;
    }

    // Delete audio file
    try {
      const info = await FileSystem.getInfoAsync(taleToDelete.audio_url);
      
      if (info.exists) {
        await FileSystem.deleteAsync(taleToDelete.audio_url);
        console.log('Audio file deleted:', taleToDelete.audio_url);
      }
    } catch (error) {
      console.error('Error deleting audio file:', error);
      // Continue even if file deletion fails
    }

    // Remove from tales list
    const updatedTales = tales.filter(t => t.id !== taleId);
    
    // Save updated list
    await AsyncStorage.setItem(TALES_METADATA_KEY, JSON.stringify(updatedTales));

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
    const tales = await fetchUserTales();
    
    const updatedTales = tales.map(tale => 
      tale.id === taleId 
        ? { ...tale, title: newTitle, updated_at: new Date().toISOString() }
        : tale
    );

    await AsyncStorage.setItem(TALES_METADATA_KEY, JSON.stringify(updatedTales));

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