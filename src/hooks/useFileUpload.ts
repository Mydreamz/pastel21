
import { useState, useRef, useEffect, DragEvent, ChangeEvent } from "react";
import { getAcceptString, validateFile } from "@/lib/fileUtils";
import { useIsMobile } from "@/hooks/use-mobile";

type UseFileUploadProps = {
  accept?: string;
  maxSize?: number;
  value?: File | null;
  onChange: (file: File | null) => void;
  type: 'image' | 'video' | 'audio' | 'document';
};

export const useFileUpload = ({
  accept,
  maxSize: maxSizeProp,
  value,
  onChange,
  type,
}: UseFileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const maxSize = maxSizeProp ?? (isMobile ? 10 : 50);
  const acceptTypes = accept || getAcceptString(type);

  useEffect(() => {
    if (!value && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (!value && cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  }, [value]);

  const validateAndSetFile = async (file: File | null) => {
    if (!file) {
      onChange(null);
      setError(null);
      return;
    }

    setIsProcessing(true);
    setError(null);

    await new Promise(resolve => setTimeout(resolve, 300));

    const { isValid, error } = validateFile(file, acceptTypes, maxSize);
    
    if (!isValid) {
      setError(error);
      setIsProcessing(false);
      return;
    }

    setError(null);
    setIsProcessing(false);
    onChange(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    validateAndSetFile(file);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const clearFile = () => {
    onChange(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  return {
    isDragging,
    error,
    isProcessing,
    fileInputRef,
    cameraInputRef,
    maxSize,
    acceptTypes,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleBrowseClick,
    handleCameraClick,
    clearFile,
  };
};
