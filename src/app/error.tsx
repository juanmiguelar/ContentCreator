"use client";
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="page">
      <h1>Couldn’t open this content.</h1>
      <p className="error">{error.message}</p>
      <p>Check post.json, caption.md and the local server output.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
