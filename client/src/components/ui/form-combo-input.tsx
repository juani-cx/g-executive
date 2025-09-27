import { useState, useEffect } from "react";
import { FormLabel } from "./form-label";
import { FormInput } from "./form-input";
import { ChevronDown } from "lucide-react";

interface FormComboInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  testId?: string;
}

export function FormComboInput({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = "", 
  testId 
}: FormComboInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleOptionSelect = (option: string) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="flex flex-col mb-4">
      <FormLabel>
        {label}
      </FormLabel>
      <div className="relative">
        <FormInput
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          placeholder={placeholder}
          className="pr-12"
          data-testid={testId}
        />
        <ChevronDown 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          data-testid={`chevron-${testId}`}
        />
        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-left"
                style={{
                  fontSize: '26px',
                  lineHeight: '2',
                  fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontWeight: '400'
                }}
                onMouseDown={() => handleOptionSelect(option)}
                data-testid={`option-${testId}-${index}`}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}