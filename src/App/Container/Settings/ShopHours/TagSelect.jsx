import React, { useEffect, useRef, useState } from 'react';


/**
 * A select input that renders chosen options as removable tags, with a
 * dropdown for picking more. Fully controlled if `value`/`onChange` are
 * passed; otherwise manages its own state (handy for quick use/demos).
 *
 * @param {Array<{id: string, label: string}>} options - all selectable options
 * @param {Array<string>} [value] - controlled: currently selected option ids
 * @param {(ids: string[]) => void} [onChange] - controlled: change handler
 * @param {string} [placeholder]
 */
export default function TagSelect({
  options,
  value,
  onChange,
  placeholder = 'Select options',
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(() => options.slice(0, 2).map((o) => o.id));
  const selectedIds = isControlled ? value : internalValue;

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const setSelectedIds = (setValue) => {
    if (isControlled) {
        console.log("setValue")
        console.log(setValue)
        onChange(setValue);
        setInternalValue([...internalValue, setValue])
    //   onChange?.(next);
    } else {
      //setInternalValue(next);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (id) => {
    if (selectedIds.includes(id)) {
        console.log(selectedIds);
      setSelectedIds(selectedIds.filter((v) => v !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
      console.log(selectedIds);
    }
  };

  const removeOption = (id, event) => {
    event.stopPropagation();
    setSelectedIds(selectedIds.filter((v) => v !== id));
  };

  const selectedOptions = options.filter((o) => selectedIds.includes(o.id));

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex min-h-[46px] w-full flex-wrap items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
      >
        {selectedOptions.length === 0 && (
          <span className="text-sm text-gray-400">{placeholder}</span>
        )}

        {selectedOptions.map((option) => (
          <span
            key={option.id}
            className="flex items-center gap-1.5 rounded-full bg-gray-800 py-1.5 pl-3 pr-2 text-xs font-semibold text-white"
          >
            {option.label}
            <span
              role="button"
              tabIndex={0}
              aria-label={`Remove ${option.label}`}
              onClick={(e) => removeOption(option.id, e)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') removeOption(option.id, e);
              }}
              className="flex h-4 w-4 items-center justify-center rounded-full text-white/80 hover:bg-white/20 hover:text-white"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </span>
        ))}

        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className={`ml-auto shrink-0 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-multiselectable="true"
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {options.map((option) => {
            const isSelected = selectedIds.includes(option.id);
            return (
              <li
                key={option.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => toggleOption(option.id)}
                className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm text-gray-900 hover:bg-gray-50"
              >
                <span>{option.label}</span>
                {isSelected && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-900">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}