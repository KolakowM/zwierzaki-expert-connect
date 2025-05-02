
import React from 'react';

interface ErrorToastDetailsProps {
  message: string;
  error: string;
  fields: string[];
}

export const ErrorToastDetails: React.FC<ErrorToastDetailsProps> = ({ message, error, fields }) => {
  return (
    <div className="space-y-2">
      <p>{message}</p>
      {fields.length > 0 && (
        <div>
          <p className="font-semibold">Pola z błędami:</p>
          <ul className="list-disc pl-4">
            {fields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-sm text-red-300">{error}</p>
    </div>
  );
};
