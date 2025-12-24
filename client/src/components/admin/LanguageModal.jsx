import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageModal = ({ isOpen, onClose, onSave, language = null }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    isDefault: false,
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (language) {
      setFormData({
        name: language.name || '',
        code: language.code || '',
        isDefault: language.isDefault || false,
        status: language.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        code: '',
        isDefault: false,
        status: 'active'
      });
    }
    setErrors({});
  }, [language, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Language name is required';
    }
    if (!formData.code.trim()) {
      newErrors.code = 'Language code is required';
    } else if (formData.code.length !== 2) {
      newErrors.code = 'Language code must be 2 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-oxford-blue mb-4">
            {language ? 'Edit Language' : 'Add Language'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-oxford-blue mb-2">
                Language Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., English"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-oxford-blue mb-2">
                Language Code * (2 characters)
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                maxLength={2}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.code ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., EN"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-500">{errors.code}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-oxford-blue mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-oxford-blue">
                  Set as Default Language
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-oxford-blue hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#ED4122] text-white rounded-lg hover:bg-[#d43a1f] disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Saving...' : language ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;
