
import { supabase } from "@/integrations/supabase/client";

/**
 * Utility functions for handling encryption/decryption of sensitive data
 */
export const encryptionUtils = {
  /**
   * Encrypt sensitive data using the server-side encryption function
   * @param data The data to encrypt
   * @returns Promise with the encrypted data or null if encryption failed
   */
  async encrypt(data: string): Promise<string | null> {
    try {
      if (!data) return null;
      
      // Call the database function to encrypt the data
      const { data: encryptedData, error } = await supabase.rpc('encrypt_data', {
        data: data
      });
      
      if (error) {
        console.error('Encryption error:', error);
        return null;
      }
      
      return encryptedData;
    } catch (error) {
      console.error('Error encrypting data:', error);
      return null;
    }
  },
  
  /**
   * Decrypt sensitive data using the server-side decryption function
   * @param encryptedData The encrypted data to decrypt
   * @returns Promise with the decrypted data or null if decryption failed
   */
  async decrypt(encryptedData: string): Promise<string | null> {
    try {
      if (!encryptedData) return null;
      
      // Call the database function to decrypt the data
      const { data: decryptedData, error } = await supabase.rpc('decrypt_data', {
        encrypted_data: encryptedData
      });
      
      if (error) {
        console.error('Decryption error:', error);
        return null;
      }
      
      return decryptedData;
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
    }
  },
  
  /**
   * Encrypt an object's sensitive fields
   * @param obj Object with fields to encrypt
   * @param fieldsToEncrypt Array of field names to encrypt
   * @returns Promise with the object with encrypted fields
   */
  async encryptFields<T extends Record<string, any>>(
    obj: T,
    fieldsToEncrypt: string[]
  ): Promise<T> {
    const result = { ...obj } as T;
    
    for (const field of fieldsToEncrypt) {
      if (obj[field] && typeof obj[field] === 'string') {
        const encrypted = await this.encrypt(obj[field]);
        if (encrypted) {
          result[field as keyof T] = encrypted as any;
        }
      }
    }
    
    return result;
  },
  
  /**
   * Decrypt an object's encrypted fields
   * @param obj Object with encrypted fields
   * @param fieldsToDecrypt Array of field names to decrypt
   * @returns Promise with the object with decrypted fields
   */
  async decryptFields<T extends Record<string, any>>(
    obj: T,
    fieldsToDecrypt: string[]
  ): Promise<T> {
    const result = { ...obj } as T;
    
    for (const field of fieldsToDecrypt) {
      if (obj[field] && typeof obj[field] === 'string') {
        const decrypted = await this.decrypt(obj[field]);
        if (decrypted) {
          result[field as keyof T] = decrypted as any;
        }
      }
    }
    
    return result;
  }
};
