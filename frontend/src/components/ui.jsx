export function TextInput({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
        {...props}
      />
    </label>
  );
}

export function PrimaryButton({ children, ...props }) {
  return (
    <button
      className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      {...props}
    >
      {children}
    </button>
  );
}
