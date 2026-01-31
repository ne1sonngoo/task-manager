export function Card({ children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        ) : null}
      </div>
      {right ? <div>{right}</div> : null}
    </div>
  );
}

export function CardBody({ children }) {
  return <div className="p-6">{children}</div>;
}

export function TextInput({ label, hint, error, ...props }) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </span>
      ) : null}
      <input
        className={[
          "w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none",
          "border-slate-300 focus:border-slate-400",
          error ? "border-red-300 focus:border-red-400" : "",
        ].join(" ")}
        {...props}
      />
      {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
      {error ? <div className="mt-1 text-xs text-red-600">{error}</div> : null}
    </label>
  );
}

export function Select({ label, ...props }) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </span>
      ) : null}
      <select
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
        {...props}
      />
    </label>
  );
}

export function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium",
        "bg-slate-900 text-white hover:bg-slate-800",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, className = "", ...props }) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium",
        "text-slate-700 hover:bg-slate-100",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({ children, tone = "gray" }) {
  const tones = {
    gray: "bg-slate-100 text-slate-700",
    yellow: "bg-amber-100 text-amber-800",
    blue: "bg-sky-100 text-sky-800",
    green: "bg-emerald-100 text-emerald-800",
    red: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone] || tones.gray,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export function Alert({ children, kind = "error" }) {
  const styles =
    kind === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <div className={`rounded-lg border p-3 text-sm ${styles}`}>{children}</div>
  );
}
