const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const currencySymbolMap = {
  NGN: "₦",
  USD: "$",
  EUR: "€",
  GBP: "£",
  KES: "KSh",
  ZAR: "R",
  GHS: "₵",
};

export function getCurrencySymbol(currency: string): string {
  return (
    currencySymbolMap[currency as keyof typeof currencySymbolMap] || currency
  );
}

export interface FileValidationError {
  file: File;
  error: string;
}

export function validateImageFile(file: File): FileValidationError | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      file,
      error: "File type must be PNG, JPG, or JPEG",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      file,
      error: "File size must not exceed 10MB",
    };
  }

  return null;
}

export function validateImageFiles(files: File[]): FileValidationError[] {
  const errors: FileValidationError[] = [];

  for (const file of files) {
    const error = validateImageFile(file);
    if (error) {
      errors.push(error);
    }
  }

  return errors;
}
