import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useStableId } from '@/hooks/useStableId';

interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ className, label, error, helperText, id, maxSizeMB, acceptedTypes, ...props }, ref) => {
    const generatedId = useStableId('file');
    const inputId = id || generatedId;
    
    const formatFileTypes = (types?: string[]) => {
      if (!types) return '';
      return types.join(', ');
    };
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type="file"
            className={cn(
              'w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm',
              'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              'file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0',
              'file:bg-gray-50 file:text-gray-700 file:font-medium',
              'hover:file:bg-gray-100 file:cursor-pointer',
              'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
              error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
              className
            )}
            {...props}
          />
        </div>
        {(helperText || maxSizeMB || acceptedTypes) && !error && (
          <div className="mt-1 text-sm text-gray-500">
            {helperText && <p>{helperText}</p>}
            {maxSizeMB && <p>Tamanho máximo: {maxSizeMB}MB</p>}
            {acceptedTypes && <p>Tipos aceitos: {formatFileTypes(acceptedTypes)}</p>}
          </div>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;