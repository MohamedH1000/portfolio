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
  locale,
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      className={cn(
        "group block rounded-xl overflow-hidden",
        "bg-surface-low transition-colors duration-300",
        "hover:bg-surface-high",
      )}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
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
