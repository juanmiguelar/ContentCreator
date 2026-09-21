import Link from "next/link";
export default function NotFound() {
  return (
    <div className="page empty">
      <h1>This post isn’t here.</h1>
      <p>Check the repository folder or return to the library.</p>
      <Link className="button" href="/">
        Content library
      </Link>
    </div>
  );
}
