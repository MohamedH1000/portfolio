-- ===== Projects =====
INSERT INTO projects (slug, title_en, title_ar, description_en, description_ar, tech_stack, image_url, live_url, featured, sort_order) VALUES
('devflow', 'DevFlow - Q&A Platform', 'ديف فلو - منصة أسئلة وأجوبة',
 'Ask your questions and wait for an expert to answer. Find a lot of questions and answers, similar to StackOverflow.',
 'اسأل أسئلتك التي ليس لديك إجابة عنها وانتظر خبيراً للإجابة عليها. اعثر على الكثير من الأسئلة والأجوبة، هذا الموقع مثل StackOverflow.',
 ARRAY['MongoDB', 'Tailwind CSS', 'TypeScript', 'Next.js', 'Clerk'], '/devFlow.png',
 'https://dev-flow-nine-psi.vercel.app/', true, 1),

('yoom', 'Yoom - Video Conferencing', 'يوم - مؤتمرات فيديو',
 'Simplify your video conferencing experience with Yoom. Seamlessly connect with colleagues and friends.',
 'بسّط تجربة مؤتمرات الفيديو الخاصة بك مع يوم. تواصل بسلاسة مع الزملاء والأصدقاء.',
 ARRAY['Next.js', 'Tailwind CSS', 'TypeScript', 'Stream', 'Clerk'], '/p2.svg',
 'https://yoom-tau.vercel.app/', true, 2),

('nouzl', 'Nouzl - Booking Platform', 'نوزل - منصة حجز',
 'Book different types of properties at the best prices and sign up your properties as a partner on the platform.',
 'احجز أنواعاً مختلفة من العقارات بأفضل الأسعار وسجّل عقاراتك كشريك في المنصة.',
 ARRAY['React', 'Tailwind CSS', 'TypeScript', 'Redux', 'Prisma'], '/nouzl.png',
 'https://www.nouzl.com/', true, 3),

('mersal', 'Mersal Chalet Resort', 'مرسال - منتجع شاليهات',
 'A website built with Next.js, NextAuth, Prisma, and MongoDB for booking chalets.',
 'تطبيق مبني بـ Next.js و NextAuth و Prisma و MongoDB لإنشاء موقع حجز الشاليهات.',
 ARRAY['Prisma', 'Tailwind CSS', 'TypeScript', 'Next.js', 'NextAuth'], '/Mersal.png',
 'https://mersal-ksa.vercel.app/', true, 4),

('mafaz', 'Mafaz - Business Platform', 'مفاز - منصة أعمال',
 'A platform built using Next.js with Clerk, Material UI, Shadcn, Tailwind CSS, and MongoDB.',
 'تطبيق مبني باستخدام Next.js مع Clerk و Material UI و Shadcn و Tailwind CSS و MongoDB.',
 ARRAY['Next.js', 'Tailwind CSS', 'TypeScript', 'MongoDB', 'Clerk'], '/Mafaz.png',
 'https://mafaz.vercel.app/', false, 5),

('basic-calc', 'Basic Calculator', 'آلة حاسبة أساسية',
 'An application built using React and ReactFlow allowing you to do basic calculations like sum, subtract, multiply, and divide.',
 'تطبيق مبني باستخدام React و ReactFlow يسمح لك بإجراء العمليات الحسابية الأساسية مثل الجمع والطرح والضرب والقسمة.',
 ARRAY['ReactFlow', 'Tailwind CSS', 'TypeScript', 'React', 'GSAP'], '/BasicCalc.png',
 'https://dragdrop-chi.vercel.app/', false, 6),

('filmpire', 'Filmpire - Movie Platform', 'فيلمباير - منصة أفلام',
 'An application built using React and Redux allowing you to watch different movies.',
 'تطبيق مبني باستخدام React و Redux يسمح لك بمشاهدة أفلام مختلفة.',
 ARRAY['React', 'Tailwind CSS', 'TypeScript', 'MongoDB', 'Redux'], '/Filmpire.png',
 'https://willowy-nougat-2d34e6.netlify.app/', false, 7),

('figma-clone', 'Figma Clone', 'نسخة فيجما',
 'An application built using Next.js allowing you to design websites like Figma.',
 'تطبيق مبني باستخدام Next.js يسمح لك بتصميم مواقع مثل فيجما.',
 ARRAY['Next.js', 'Tailwind CSS', 'TypeScript', 'React', 'Liveblocks'], '/figma_clone.png',
 'https://figma-clone-mu-ruddy.vercel.app/', false, 8),

('collaborative-editor', 'Collaborative Editor', 'محرر تعاوني',
 'An application built using Next.js allowing you to write, edit, and delete documents in real-time with other people.',
 'تطبيق مبني باستخدام Next.js يسمح لك بكتابة وتعديل وحذف المستندات في الوقت الفعلي مع أشخاص آخرين.',
 ARRAY['Next.js', 'Tailwind CSS', 'TypeScript', 'Liveblocks', 'Clerk'], '/collaborative_editor.png',
 'https://editor-app-seven.vercel.app/', false, 9),

('netflix-clone', 'Netflix Clone', 'نسخة نتفليكس',
 'An application built using Next.js allowing you to watch movies like Netflix.',
 'تطبيق مبني باستخدام Next.js يسمح لك بمشاهدة الأفلام مثل نتفليكس.',
 ARRAY['Next.js', 'Tailwind CSS', 'TypeScript', 'Prisma', 'MongoDB'], '/Netflix.png',
 'https://netflix-clone-gray-delta-89.vercel.app', false, 10),

('messenger-clone', 'Messenger Clone', 'نسخة ماسنجر',
 'An application built using Next.js for real-time chat between members.',
 'تطبيق مبني باستخدام Next.js لعمل دردشة في الوقت الفعلي بين الأعضاء.',
 ARRAY['Next.js', 'Tailwind CSS', 'TypeScript', 'Prisma', 'MongoDB'], '/Massenger.png',
 'https://massenger-clone.vercel.app', false, 11);


-- ===== Testimonials =====
INSERT INTO testimonials (name_en, name_ar, title_en, title_ar, message_en, message_ar, sort_order) VALUES
('Hany', 'هاني', 'Director of Mafaz Company', 'مدير شركة مفاز',
 'He is one of the most respectful, professional, quick, and helpful people in the group. I was very pleased to deal with him.',
 'هو أحد أكثر الأشخاص احتراماً واحترافية وسرعة ومساعدة في المجموعة. كنت سعيداً جداً بالتعامل معه',
 1),

('Ahmed', 'أحمد', 'CTO at TechStart', 'الرئيس التقني في تك ستارت',
 'Mohamed delivered our project ahead of schedule with exceptional quality. His attention to detail and problem-solving skills are outstanding.',
 'محمد سلّم مشروعنا قبل الموعد المحدد بجودة استثنائية. اهتمامه بالتفاصيل ومهاراته في حل المشكلات متميزة',
 2),

('Sarah', 'سارة', 'Product Manager at InnovateCo', 'مديرة المنتج في إنوفيت كو',
 'Working with Mohamed was a great experience. He understood our requirements perfectly and delivered a solution that exceeded our expectations.',
 'العمل مع محمد كان تجربة رائعة. فهم متطلباتنا بشكل مثالي وقدم حلاً فاق توقعاتنا',
 3),

('Khalid', 'خالد', 'Founder of DigiVenture', 'مؤسس ديجي فينشر',
 'Mohamed''s expertise in Next.js and React is impressive. He built our entire platform from scratch and it performs flawlessly.',
 'خبرة محمد في Next.js و React مثيرة للإعجاب. بنى منصتنا بالكامل من الصفر وتعمل بشكل مثالي',
 4);


-- ===== Experiences =====
INSERT INTO experiences (role_en, role_ar, company, company_logo_url, description_en, description_ar, start_date, end_date, sort_order) VALUES
('Frontend Engineer Intern', 'مهندس واجهات أمامية متدرب', 'Tech Corp', '/exp1.svg',
 'Assisted in the development of a web-based platform using React.js, enhancing interactivity and user experience.',
 'ساعدت في تطوير منصة ويب باستخدام React.js، معززاً التفاعلية وتجربة المستخدم.',
 '2023-06-01', '2023-09-01', 1),

('Mobile App Developer', 'مطور تطبيقات الهاتف', 'JSM Tech', '/exp2.svg',
 'Designed and developed mobile apps for both iOS and Android platforms using React Native.',
 'صممت وطورت تطبيقات الهاتف لمنصتي iOS و Android باستخدام React Native.',
 '2023-09-01', '2024-01-01', 2),

('Freelance Developer', 'مطور مستقل', 'Self-employed', '/exp3.svg',
 'Led the development of a mobile app for a client, from initial concept to deployment on app stores.',
 'قُدت تطوير تطبيق هاتف لعميل، من المفهوم الأولي إلى النشر في متاجر التطبيقات.',
 '2024-01-01', '2024-06-01', 3),

('Lead Frontend Developer', 'مطور واجهات أمامية رئيسي', 'WebFlow Agency', '/exp4.svg',
 'Developed and maintained user-facing features using modern frontend technologies. Led a team of 3 developers.',
 'طورت وصيانت الميزات الموجهة للمستخدم باستخدام تقنيات الواجهة الأمامية الحديثة. قُدت فريقاً من 3 مطورين.',
 '2024-06-01', NULL, 4);


-- ===== Site Settings =====
INSERT INTO site_settings (key, value_en, value_ar) VALUES
('hero_subtitle', 'Dynamic Web Magic with Next.js', 'سحر الويب الديناميكي مع Next.js'),
('hero_title', 'Transforming Concepts into Seamless User Experiences', 'تحويل المفاهيم إلى تجارب مستخدم سلسة'),
('hero_description', 'Hi! I''m Mohamed Hesham, a Full Stack Developer based in Egypt.', 'مرحباً! أنا محمد هشام، مطور Full Stack مقيم في مصر.'),
('hero_cta', 'Show my work', 'اعرض أعمالي'),
('contact_heading', 'Ready to take your digital presence to the next level?', 'هل أنت مستعد للارتقاء بحضورك الرقمي إلى المستوى التالي؟'),
('contact_description', 'Reach out to me today and let''s discuss how I can help you achieve your goals.', 'تواصل معي اليوم ودعنا نناقش كيف يمكنني مساعدتك في تحقيق أهدافك.'),
('contact_cta', 'Let''s get in touch', 'لنتواصل'),
('email', 'mohammedhisham115@gmail.com', 'mohammedhisham115@gmail.com'),
('copyright', 'Mohamed Hesham', 'محمد هشام'),
('github_url', 'https://github.com/MohamedH1000', 'https://github.com/MohamedH1000'),
('twitter_url', 'https://x.com/mohamed94818836', 'https://x.com/mohamed94818836'),
('linkedin_url', 'https://www.linkedin.com/in/mohamed-hesham-726903209/', 'https://www.linkedin.com/in/mohamed-hesham-726903209/');
