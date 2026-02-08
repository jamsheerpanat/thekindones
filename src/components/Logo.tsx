import Image from "next/image";
import Link from "next/link";

export const Logo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const height = {
    sm: 40,
    md: 48,
    lg: 64
  }[size];

  return (
    <Link href="/" className="group flex items-center gap-3 outline-none">
      <div className="relative flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
        <Image
          src="/brand/logo.png"
          alt="thekindones logo"
          width={180}
          height={60}
          className="h-10 w-auto object-contain"
          priority
        />
      </div>
    </Link>
  );
};
