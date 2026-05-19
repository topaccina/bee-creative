export function LoadingState({ message = "Loading quiz data…" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-honey-200/70">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-honey-500/30 border-t-honey-400" />
      <p>{message}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-6 py-8 text-center text-rose-200">
      {message}
    </div>
  );
}
