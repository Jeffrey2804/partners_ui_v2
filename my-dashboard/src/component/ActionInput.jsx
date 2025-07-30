// components/ActionInput.jsx
import CreatableSelect from 'react-select/creatable';

const predefinedOptions = [
  { value: 'Call', label: 'Call' },
  { value: 'Schedule Now', label: 'Schedule Now' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Reassign', label: 'Reassign' },
  { value: 'Meeting', label: 'Meeting' },
  { value: 'Send Email', label: 'Send Email' },
  { value: 'Follow Up', label: 'Follow Up' },
];

const ActionInput = ({ value, onChange, max = 5 }) => {
  // Check if dark mode is enabled
  const darkMode = document.documentElement.classList.contains('dark');

  const handleChange = (newValue) => {
    if (newValue.length <= max) {
      onChange(newValue);
    }
  };

  const styles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: darkMode ? '#1f2937' : '#ffffff', // dark: gray-800, light: white
      color: darkMode ? '#f9fafb' : '#111827',           // light/dark text
      borderColor: state.isFocused ? '#10b981' : base.borderColor,
      boxShadow: state.isFocused ? '0 0 0 1px #10b981' : base.boxShadow,
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: darkMode ? '#111827' : '#ffffff', // dark: gray-900, light: white
      color: darkMode ? '#f9fafb' : '#111827',
      zIndex: 999,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#10b981' // teal-500
        : state.isFocused
        ? (darkMode ? '#1f2937' : '#f3f4f6') // dark: gray-800, light: gray-100
        : darkMode
        ? '#111827'
        : '#ffffff',
      color: darkMode ? '#f9fafb' : '#111827',
    }),
    input: (base) => ({
      ...base,
      color: darkMode ? '#f9fafb' : '#111827',
    }),
    placeholder: (base) => ({
      ...base,
      color: darkMode ? '#9ca3af' : '#6b7280', // gray-400 / gray-500
    }),
    singleValue: (base) => ({
      ...base,
      color: darkMode ? '#f9fafb' : '#111827',
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: darkMode ? '#374151' : '#e5e7eb', // gray-700 / gray-200
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: darkMode ? '#f9fafb' : '#111827',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: darkMode ? '#f9fafb' : '#111827',
      ':hover': {
        backgroundColor: '#ef4444', // red-500
        color: '#ffffff',
      },
    }),
  };

  return (
    <CreatableSelect
      isMulti
      isClearable
      options={predefinedOptions}
      value={value}
      onChange={handleChange}
      className="react-select-container mt-1"
      classNamePrefix="react-select"
      placeholder="Select or create actions..."
      styles={styles}
    />
  );
};

export default ActionInput;
