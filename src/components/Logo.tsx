import Image from "next/image";
import Link from "next/link";

export const Logo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const height = {
    sm: 32,
    md: 40,
    lg: 52
  }[size];

  return (
    <Link href="/" className="group flex items-center gap-3 outline-none">
      <div className="relative flex items-center justify-center px-4 py-2 rounded-xl bg-white/40 backdrop-blur-md border border-white/50 shadow-soft transition-all duration-500 group-hover:bg-white/60 group-hover:shadow-glow-sm">
        <div className="relative h-8 w-auto aspect-[16/5] flex items-center justify-center overflow-hidden">
          <Image
            src="/brand/logo.png"
            alt="thekindones logo"
            width={160}
            height={50}
            className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
            priority
          />
        </div>
      </div>

      <div className="hidden sm:flex flex-col">
        <span className="text-[14px] font-medium tracking-[-0.02em] text-ink-900 line-height-none">
          the kind ones
        </span>
        <div className="h-[1px] w-0 bg-brand-500 group-hover:w-full transition-all duration-500" />
      </div>
    </Link>
  );
};
