
import { useState } from 'react';
import { encryptionUtils } from '@/utils/encryptionUtils';

/**
 * Hook for working with encrypted data in forms and UI
 */
export function useEncryption() {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  
  /**
   * Encrypt a specific value
   */
  const encryptValue = async (value: string): Promise<string | null> => {
    if (!value) return null;
    
    setIsEncrypting(true);
    try {
      const encrypted = await encryptionUtils.encrypt(value);
      return encrypted;
    } catch (error) {
      console.error('Error encrypting value:', error);
      return null;
    } finally {
      setIsEncrypting(false);
    }
  };
  
  /**
   * Decrypt a specific value
   */
  const decryptValue = async (encryptedValue: string): Promise<string | null> => {
    if (!encryptedValue) return null;
    
    setIsDecrypting(true);
    try {
      const decrypted = await encryptionUtils.decrypt(encryptedValue);
      return decrypted;
    } catch (error) {
      console.error('Error decrypting value:', error);
      return null;
    } finally {
      setIsDecrypting(false);
    }
  };
  
  /**
   * Encrypt multiple fields in an object
   */
  const encryptFields = async <T extends Record<string, any>>(
    obj: T, 
    fieldsToEncrypt: string[]
  ): Promise<T> => {
    setIsEncrypting(true);
    try {
      return await encryptionUtils.encryptFields(obj, fieldsToEncrypt);
    } finally {
      setIsEncrypting(false);
    }
  };
  
  /**
   * Decrypt multiple fields in an object
   */
  const decryptFields = async <T extends Record<string, any>>(
    obj: T, 
    fieldsToDecrypt: string[]
  ): Promise<T> => {
    setIsDecrypting(true);
    try {
      return await encryptionUtils.decryptFields(obj, fieldsToDecrypt);
    } finally {
      setIsDecrypting(false);
    }
  };
  
  return {
    encryptValue,
    decryptValue,
    encryptFields,
    decryptFields,
    isEncrypting,
    isDecrypting
  };
}
