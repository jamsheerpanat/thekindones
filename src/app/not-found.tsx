import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section">
      <div className="container-padded flex flex-col items-center gap-4 text-center">
        <h2>Page not found</h2>
        <p>The page you are looking for does not exist.</p>
        <Link href="/" className="btn btn-primary">
          Return home
        </Link>
      </div>
    </div>
  );
}
