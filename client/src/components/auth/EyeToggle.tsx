interface EyeToggleProps {
  show: boolean;
  onToggle: () => void;
}

export default function EyeToggle({ show, onToggle }: EyeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      tabIndex={-1}
    >
      {show ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7a9.99 9.99 0 015.657 1.757M15 12a3 3 0 11-6 0 3 3 0 016 0zm3.536 6.464L4.929 4.929" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.855-.67 1.66-1.166 2.385M6.343 17.657A9.959 9.959 0 0012 19c4.477 0 8.268-2.943 9.542-7" />
        </svg>
      )}
    </button>
  );
}
