import Link from "next/link";

interface GameCardProps {
  href: string;
  emoji: string;
  title: string;
  description: string;
}

export default function GameCard({
  href,
  emoji,
  title,
  description,
}: GameCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-forest-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-forest-300 hover:shadow-md"
    >
      <span
        className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-50 text-3xl"
        aria-hidden="true"
      >
        {emoji}
      </span>
      <h3 className="mt-4 text-lg font-bold text-forest-900">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-forest-700">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emergency-600 transition-colors group-hover:text-emergency-700">
        Jogar
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
