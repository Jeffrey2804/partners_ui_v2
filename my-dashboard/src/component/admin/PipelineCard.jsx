// 🧩 PipelineCard.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { toast } from 'react-hot-toast';
import { FiEdit3, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const PipelineCard = ({ name = '', address = '', loanType = '', closeDate = '', status = 'On Track', loanAmount = 0 }) => {
  const badgeStyles = {
    'On Track': 'bg-green-500 text-white',
    'Delayed': 'bg-yellow-400 text-black',
  };

  const statusOptions = ['On Track', 'Delayed'];
  const currencyOptions = ['USD', 'EUR', 'PHP'];

  const [editingField, setEditingField] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [showCheck, setShowCheck] = useState(false);
  const debounceTimer = useRef(null);

  // 🔁 Load currency for the current card from Supabase
  useEffect(() => {
    const fetchCurrency = async () => {
      const { data, error } = await supabase.from('leads').select('currency').eq('name', name).single();
      if (!error && data?.currency) setCurrency(data.currency);
    };
    if (name) fetchCurrency();
  }, [name]);

  // 💾 Debounced Save
  useEffect(() => {
    if (editingField && editedValue) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => handleSave(), 1500);
    }
  }, [editedValue]);

  // 🖊️ Begin editing
  const handleEdit = (field, currentValue) => {
    localStorage.setItem(`unsaved-${field}-${name}`, currentValue);
    setEditingField(field);
    setEditedValue(currentValue);
  };

  // ❌ Cancel edit
  const handleCancel = () => {
    setEditingField(null);
    setEditedValue('');
    setLoading(false);
    localStorage.removeItem(`unsaved-${editingField}-${name}`);
    setShowCheck(true);
    setTimeout(() => setShowCheck(false), 2000);
  };

  // 💾 Save to Supabase
  const handleSave = useCallback(async () => {
    setLoading(true);
    if (!editingField) return;

    if (editingField === 'closeDate' && isNaN(Date.parse(editedValue))) {
      toast.error('❌ Invalid date format');
      return;
    }
    if (editingField === 'loanAmount' && (isNaN(editedValue) || Number(editedValue) <= 0)) {
      toast.error('❌ Loan amount must be a positive number');
      return;
    }

    const updates = { [editingField]: editedValue };
    if (editingField === 'loanAmount') updates.currency = currency;

    const { error } = await supabase.from('leads').update(updates).eq('name', name);

    if (error) {
      toast.error('❌ Failed to save');
    } else {
      toast.success(`✅ ${editingField} updated`);
    }

    setEditingField(null);
    setEditedValue('');
    setShowCheck(true);
    localStorage.removeItem(`unsaved-${editingField}-${name}`);
    setTimeout(() => setShowCheck(false), 2000);
  }, [editingField, editedValue, currency, name]);

  // ⌨️ Keyboard controls
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  // 🔁 Restore unsaved edits
  useEffect(() => {
    ['name', 'address', 'loanType', 'closeDate', 'loanAmount', 'status'].forEach((field) => {
      const cached = localStorage.getItem(`unsaved-${field}-${name}`);
      if (cached) {
        setEditingField(field);
        setEditedValue(cached);
      }
    });
  }, [name]);

  // 🧱 Render individual field
  const renderField = useCallback((label, value, field, isNumeric = false, tooltip = '') => {
    return (
      <div className="text-xs mt-2 group relative" title={tooltip}>
        <div className="flex items-center gap-1 font-bold">
          {showCheck && editingField === field && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-green-500"
            >
              ✔️
            </motion.span>
          )}
          {label}
          <FiEdit3
            className="text-gray-400 hover:text-blue-500 cursor-pointer"
            size={12}
            onClick={() => handleEdit(field, value)}
          />
        </div>

        {editingField === field ? (
          <div className="flex gap-1 items-center mt-0.5">
            <motion.input
              layout
              animate={{ scale: 1 }}
              whileFocus={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 200 }}
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="text-xs bg-gray-100 dark:bg-gray-700 rounded w-full p-1"
            />
            <FiX onClick={handleCancel} className="text-red-400 hover:text-red-600 cursor-pointer" size={12} />
            {loading && <span className="text-xs text-blue-500 ml-2 animate-pulse">Saving...</span>}
          </div>
        ) : (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-gray-500 group-hover:underline cursor-help"
          >
            {isNumeric && value ? `${currency} ${Number(value).toLocaleString()}` : (value || <span className="italic text-gray-400">Click to edit</span>)}
          </motion.div>
        )}
      </div>
    );
  }, [editingField, editedValue, currency, loading, showCheck]);

  return (
    <motion.div
      layout
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-sm"
    >
      <h4 className="font-semibold mb-2">Lead Details</h4>

      {renderField('Borrower Name', name, 'name', false, 'Full legal name of the borrower')}
      {renderField('Address', address, 'address', false, 'Street address of the property')}
      {renderField('Loan Type', loanType, 'loanType', false, 'e.g., FHA, Conventional')}
      {renderField('Close Date', closeDate, 'closeDate', false, 'Expected closing date')}
      {renderField('Loan Amount', loanAmount, 'loanAmount', true, 'Editable numeric value')}

      {editingField === 'loanAmount' && (
        <div className="mt-1">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-gray-100 dark:bg-gray-700 text-xs rounded p-1 w-full"
          >
            {currencyOptions.map((cur) => (
              <option key={cur} value={cur}>{cur}</option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-2" title="Loan status tracking">
        <div className="text-xs font-bold mb-1">Status</div>
        {editingField === 'status' ? (
          <select
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            onBlur={handleSave}
            className="bg-gray-100 dark:bg-gray-700 rounded p-1 text-xs w-full"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <span
            onClick={() => handleEdit('status', status)}
            className={`px-2 py-0.5 rounded text-xs font-semibold cursor-pointer ${badgeStyles[status] || 'bg-gray-300 text-black'}`}
          >
            {status || 'Unknown'}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default PipelineCard;
