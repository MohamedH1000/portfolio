// Temporary data until Supabase is connected.
// This will be replaced by server actions fetching from the database.

export interface Project {
  slug: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  tech_stack: string[];
  image_url: string;
  live_url: string;
  github_url?: string;
  featured: boolean;
}

export interface Testimonial {
  name_en: string;
  name_ar: string;
  title_en: string;
  title_ar: string;
  message_en: string;
  message_ar: string;
}

export interface Experience {
  role_en: string;
  role_ar: string;
  company: string;
  description_en: string;
  description_ar: string;
  start_date: string;
  end_date: string | null;
}

export const projects: Project[] = [
  {
    slug: "devflow",
    title_en: "DevFlow - Q&A Platform",
    title_ar: "ديف فلو - منصة أسئلة وأجوبة",
    description_en: "Ask your questions and wait for an expert to answer. Find a lot of questions and answers, similar to StackOverflow.",
    description_ar: "اسأل أسئلتك التي ليس لديك إجابة عنها وانتظر خبيراً للإجابة عليها. اعثر على الكثير من الأسئلة والأجوبة، هذا الموقع مثل StackOverflow.",
    tech_stack: ["MongoDB", "Tailwind CSS", "TypeScript", "Next.js", "Clerk"],
    image_url: "/devFlow.png",
    live_url: "https://dev-flow-nine-psi.vercel.app/",
    featured: true,
  },
  {
    slug: "yoom",
    title_en: "Yoom - Video Conferencing",
    title_ar: "يوم - مؤتمرات فيديو",
    description_en: "Simplify your video conferencing experience with Yoom. Seamlessly connect with colleagues and friends.",
    description_ar: "بسّط تجربة مؤتمرات الفيديو الخاصة بك مع يوم. تواصل بسلاسة مع الزملاء والأصدقاء.",
    tech_stack: ["Next.js", "Tailwind CSS", "TypeScript", "Stream", "Clerk"],
    image_url: "/p2.svg",
    live_url: "https://yoom-tau.vercel.app/",
    featured: true,
  },
  {
    slug: "nouzl",
    title_en: "Nouzl - Booking Platform",
    title_ar: "نوزل - منصة حجز",
    description_en: "Book different types of properties at the best prices and sign up your properties as a partner on the platform.",
    description_ar: "احجز أنواعاً مختلفة من العقارات بأفضل الأسعار وسجّل عقاراتك كشريك في المنصة.",
    tech_stack: ["React", "Tailwind CSS", "TypeScript", "Redux", "Prisma"],
    image_url: "/nouzl.png",
    live_url: "https://www.nouzl.com/",
    featured: true,
  },
  {
    slug: "mersal",
    title_en: "Mersal Chalet Resort",
    title_ar: "مرسال - منتجع شاليهات",
    description_en: "A website built with Next.js, NextAuth, Prisma, and MongoDB for booking chalets.",
    description_ar: "تطبيق مبني بـ Next.js و NextAuth و Prisma و MongoDB لإنشاء موقع حجز الشاليهات.",
    tech_stack: ["Prisma", "Tailwind CSS", "TypeScript", "Next.js", "NextAuth"],
    image_url: "/Mersal.png",
    live_url: "https://mersal-ksa.vercel.app/",
    featured: true,
  },
  {
    slug: "mafaz",
    title_en: "Mafaz - Business Platform",
    title_ar: "مفاز - منصة أعمال",
    description_en: "A platform built using Next.js with Clerk, Material UI, Shadcn, Tailwind CSS, and MongoDB.",
    description_ar: "تطبيق مبني باستخدام Next.js مع Clerk و Material UI و Shadcn و Tailwind CSS و MongoDB.",
    tech_stack: ["Next.js", "Tailwind CSS", "TypeScript", "MongoDB", "Clerk"],
    image_url: "/Mafaz.png",
    live_url: "https://mafaz.vercel.app/",
    featured: false,
  },
  {
    slug: "basic-calc",
    title_en: "Basic Calculator",
    title_ar: "آلة حاسبة أساسية",
    description_en: "An application built using React and ReactFlow allowing you to do basic calculations like sum, subtract, multiply, and divide.",
    description_ar: "تطبيق مبني باستخدام React و ReactFlow يسمح لك بإجراء العمليات الحسابية الأساسية مثل الجمع والطرح والضرب والقسمة.",
    tech_stack: ["ReactFlow", "Tailwind CSS", "TypeScript", "React", "GSAP"],
    image_url: "/BasicCalc.png",
    live_url: "https://dragdrop-chi.vercel.app/",
    featured: false,
  },
  {
    slug: "filmpire",
    title_en: "Filmpire - Movie Platform",
    title_ar: "فيلمباير - منصة أفلام",
    description_en: "An application built using React and Redux allowing you to watch different movies.",
    description_ar: "تطبيق مبني باستخدام React و Redux يسمح لك بمشاهدة أفلام مختلفة.",
    tech_stack: ["React", "Tailwind CSS", "TypeScript", "MongoDB", "Redux"],
    image_url: "/Filmpire.png",
    live_url: "https://willowy-nougat-2d34e6.netlify.app/",
    featured: false,
  },
  {
    slug: "figma-clone",
    title_en: "Figma Clone",
    title_ar: "نسخة فيجما",
    description_en: "An application built using Next.js allowing you to design websites like Figma.",
    description_ar: "تطبيق مبني باستخدام Next.js يسمح لك بتصميم مواقع مثل فيجما.",
    tech_stack: ["Next.js", "Tailwind CSS", "TypeScript", "React", "Liveblocks"],
    image_url: "/figma_clone.png",
    live_url: "https://figma-clone-mu-ruddy.vercel.app/",
    featured: false,
  },
  {
    slug: "collaborative-editor",
    title_en: "Collaborative Editor",
    title_ar: "محرر تعاوني",
    description_en: "An application built using Next.js allowing you to write, edit, and delete documents in real-time with other people.",
    description_ar: "تطبيق مبني باستخدام Next.js يسمح لك بكتابة وتعديل وحذف المستندات في الوقت الفعلي مع أشخاص آخرين.",
    tech_stack: ["Next.js", "Tailwind CSS", "TypeScript", "Liveblocks", "Clerk"],
    image_url: "/collaborative_editor.png",
    live_url: "https://editor-app-seven.vercel.app/",
    featured: false,
  },
  {
    slug: "netflix-clone",
    title_en: "Netflix Clone",
    title_ar: "نسخة نتفليكس",
    description_en: "An application built using Next.js allowing you to watch movies like Netflix.",
    description_ar: "تطبيق مبني باستخدام Next.js يسمح لك بمشاهدة الأفلام مثل نتفليكس.",
    tech_stack: ["Next.js", "Tailwind CSS", "TypeScript", "Prisma", "MongoDB"],
    image_url: "/Netflix.png",
    live_url: "https://netflix-clone-gray-delta-89.vercel.app",
    featured: false,
  },
  {
    slug: "messenger-clone",
    title_en: "Messenger Clone",
    title_ar: "نسخة ماسنجر",
    description_en: "An application built using Next.js for real-time chat between members.",
    description_ar: "تطبيق مبني باستخدام Next.js لعمل دردشة في الوقت الفعلي بين الأعضاء.",
    tech_stack: ["Next.js", "Tailwind CSS", "TypeScript", "Prisma", "MongoDB"],
    image_url: "/Massenger.png",
    live_url: "https://massenger-clone.vercel.app",
    featured: false,
  },
];
