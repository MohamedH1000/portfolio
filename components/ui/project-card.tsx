import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { TechTag } from "@/components/ui/tech-tag";

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  techStack: string[];
  liveUrl?: string;
  slug: string;
  locale: string;
}

export function ProjectCard({
  title,
  description,
  imageUrl,
  techStack,
  slug,
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      className={cn(
        "group block rounded-2xl overflow-hidden",
        "bg-surface-low transition-all duration-500",
        "card-hover",
        "border border-transparent",
        "hover:border-brand/20",
      )}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-surface-low/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-brand transition-colors duration-300">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 pt-1">
          {techStack.map((tech) => (
            <TechTag key={tech} name={tech} />
          ))}
        </div>
      </div>
    </Link>
  );
}
