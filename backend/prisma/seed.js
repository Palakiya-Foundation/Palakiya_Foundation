import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

async function main() {
  console.log('Seeding database...');

  // --- Admin ---
  const email = process.env.ADMIN_EMAIL || 'admin@palakiyafoundation.org';
  const password = process.env.ADMIN_PASS || process.env.ADMIN_PASSWORD || '@20Palakiya24@';
  const hashed = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { email },
    update: { password: hashed },
    create: {
      name: process.env.ADMIN_NAME || 'Administrator',
      email,
      password: hashed,
    },
  });
  console.log(' Admin ready -> ' + email + ' / ' + password);

  // --- Programs ---
  const programs = [
    {
      title: 'Jhaka Maka Madua – White Paper',
      summary: 'A research initiative advocating the inclusion of millets and local foods in Jharkhand\'s public distribution and meal schemes.',
      description: 'Jhaka Maka Madua is a flagship white paper by Palakiya Foundation that promotes the revival of indigenous millets and traditional food systems in Jharkhand. The report highlights the nutritional, environmental, and socio-economic importance of local grains while recommending their inclusion in government food security and nutrition programs such as the Public Distribution System (PDS), Mid-Day Meal, and other welfare schemes.',
      category: 'Food Justice',
      icon: 'BookOpen',
      featured: true,
      order: 1,
      image: '/images/programs/jhaka_maka.png',
    },
    {
      title: 'Jhaka Maka Madua (Hindi White Paper)',
      summary: 'Hindi edition promoting traditional grains and indigenous food systems across Jharkhand.',
      description: 'The Hindi version of the Jhaka Maka Madua White Paper makes research findings accessible to local communities, policymakers, civil society organisations, and grassroots stakeholders.',
      category: 'Food Justice',
      icon: 'Languages',
      featured: true,
      order: 2,
      image: '/images/programs/hindi_jhaka_maka.png',
    },
    {
      title: 'Inferno',
      summary: 'A publication examining the human consequences of rising temperatures and climate change.',
      description: 'Inferno explores the growing impact of climate change on vulnerable communities. The publication documents how rising temperatures affect public health, livelihoods, ecosystems, and urban infrastructure.',
      category: 'Climate Justice',
      icon: 'Flame',
      featured: true,
      order: 3,
      image: '/images/programs/inferno.png',
    },
    {
      title: 'Kheti Ki Baat, Ekta AI Ke Saath',
      summary: 'An assessment of farmers\' engagement with AI in agriculture.',
      description: 'This collaborative study by Palakiya Foundation and EarthON Foundation evaluates how small and marginal farmers interact with Ekta AI, a multilingual WhatsApp-based farming assistant.',
      category: 'Agriculture & AI',
      icon: 'Bot',
      featured: true,
      order: 4,
      image: '/images/programs/Khet_ki_baat.png',
    },
    {
      title: 'Millet Manifesto',
      summary: 'Policy recommendations for integrating millets into Jharkhand\'s development and election agenda.',
      description: 'The Millet Manifesto presents policy recommendations aimed at strengthening millet cultivation, improving food security, supporting climate-resilient agriculture, and enhancing farmer livelihoods.',
      category: 'Policy Advocacy',
      icon: 'ScrollText',
      featured: true,
      order: 5,
      image: '/images/programs/manifesto.png',
    },
  ];

  await prisma.program.deleteMany();
  for (const p of programs) {
    await prisma.program.create({ data: { ...p, slug: slugify(p.title) } });
  }
  console.log(programs.length + ' programs seeded');

  // --- Articles ---
  const articles = [
    {
      title: 'Reviving Indigenous Millets for a Climate-Resilient Jharkhand',
      excerpt: 'How traditional grains like madua can strengthen nutrition, biodiversity, and sustainable agriculture in Jharkhand.',
      content: 'For centuries, indigenous millets have been an integral part of Jharkhand\'s food culture. However, changing agricultural practices and increasing dependence on commercial crops have gradually pushed these highly nutritious grains to the margins.\n\nThrough our Jhaka Maka Madua initiative, Palakiya Foundation advocates the revival of local food systems by integrating millets into public nutrition programmes such as the Public Distribution System (PDS) and the Mid-Day Meal Scheme.\n\nMillets are naturally climate-resilient, require fewer agricultural inputs, and offer exceptional nutritional value. Promoting their cultivation not only improves food security but also strengthens biodiversity, supports smallholder farmers, and preserves indigenous knowledge for future generations.',
      category: 'Food Justice',
      author: 'Palakiya Foundation',
      image: '/images/articles/jhaka_maka.png',
      driveLink: 'https://drive.google.com/file/d/19vaQEm3M5z8t5qLkKZnTBxpclxGGTspV/view?usp=sharing',
    },
    {
      title: 'Can Artificial Intelligence Empower Smallholder Farmers?',
      excerpt: 'Exploring how multilingual AI assistants can bridge agricultural knowledge gaps in rural India.',
      content: 'Digital technology is transforming agriculture, but meaningful innovation must be inclusive.\n\nOur field research on Ekta AI explored how farmers across Bihar and Jharkhand interact with an AI-powered WhatsApp assistant designed to provide timely farming advice. The study revealed encouraging levels of interest while also highlighting challenges related to language accessibility, contextual accuracy, and digital literacy.\n\nThe findings demonstrate that artificial intelligence has immense potential to strengthen agricultural decision-making—provided it is designed around the realities of rural communities and local languages.',
      category: 'Agriculture & AI',
      author: 'Palakiya Foundation',
      image: '/images/articles/Khet_ki_baat.png',
      driveLink: 'https://drive.google.com/file/d/1QUjQ4_5h1q7PXQhMjtklZ9558gzQY3Bj/view?usp=sharing',
    },
    {
      title: 'Heatwaves Are More Than a Climate Crisis—They Are a Social Justice Issue',
      excerpt: 'Understanding how rising temperatures disproportionately affect vulnerable communities across India.',
      content: 'Extreme heat affects everyone differently. Outdoor workers, construction labourers, farmers, street vendors, women, and low-income households face the highest risks during prolonged heatwaves.\n\nThrough the Inferno report, Palakiya Foundation documents how climate change impacts livelihoods, public health, water security, and food systems while highlighting the urgent need for climate-resilient cities and inclusive public policy.\n\nAddressing heat inequality requires coordinated action across healthcare, urban planning, labour welfare, disaster preparedness, and climate adaptation.',
      category: 'Climate Justice',
      author: 'Palakiya Foundation',
      image: '/images/articles/inferno.png',
      driveLink: 'https://drive.google.com/file/d/1rj8Y7qzwDw9Oy2-HaqdSMd_fivG-Ms_H/view?usp=sharing',
    },
    {
      title: 'Why Millets Must Become a Policy Priority',
      excerpt: 'Building nutrition security and climate resilience through evidence-based policy recommendations.',
      content: 'Millets are not merely traditional crops—they are essential to India\'s climate and nutrition future.\n\nThe Millet Manifesto presents practical, evidence-based recommendations that encourage governments to strengthen millet cultivation, improve farmer support systems, expand procurement, and integrate indigenous grains into public food programmes.\n\nBy connecting agriculture, nutrition, biodiversity, and climate resilience, the manifesto offers a roadmap for sustainable development in Jharkhand and beyond.',
      category: 'Policy',
      author: 'Palakiya Foundation',
      image: '/images/articles/manifesto.png',
      driveLink: 'https://drive.google.com/file/d/1CJJJLgHbbr9VS971D8R_1nt1mK5nio0m/view?usp=sharing',
    },
  ];

  await prisma.article.deleteMany();
  for (const a of articles) {
    await prisma.article.create({ data: { ...a, slug: slugify(a.title) } });
  }
  console.log(articles.length + ' articles seeded');

  // --- Gallery ---
  const gallery = [
    { title: 'Health camp in session', category: 'Field Work', image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80' },
    { title: 'Community gathering', category: 'Events', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80' },
    { title: 'Awareness campaign', category: 'Campaigns', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80' },
    { title: 'Children learning', category: 'Field Work', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80' },
    { title: 'Volunteers at work', category: 'Field Work', image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=900&q=80' },
    { title: 'Distribution drive', category: 'Campaigns', image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=80' },
    { title: 'Skill workshop', category: 'Events', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80' },
    { title: 'Women self-help group', category: 'Events', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80' },
    { title: 'Tree plantation', category: 'Campaigns', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80' },
  ];

  await prisma.gallery.deleteMany();
  for (const g of gallery) await prisma.gallery.create({ data: g });
  console.log(gallery.length + ' gallery images seeded');

  // --- Testimonials ---
  const testimonials = [
    { name: 'Bandana Devi', role: 'Digital Literacy Beneficiary', quote: 'The program gave wings to my dream. Now people appreciate my work. It has given me confidence and a platform to become self-independent.', order: 1, image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
    { name: 'Minita Kumari', role: 'Parent, Education Centre', quote: 'After attending the centre, my daughter has significantly improved in her education. The teachers provide wonderful counselling to our children.', order: 2, image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
    { name: 'Mohan Ram', role: 'Livelihood Program Member', quote: 'After a long time we did not have to worry about our meals. Seeing my family happy and relieved made all the difference. Now I earn every day.', order: 3, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  ];

  await prisma.testimonial.deleteMany();
  for (const t of testimonials) await prisma.testimonial.create({ data: t });
  console.log(testimonials.length + ' testimonials seeded');

  // --- Reports ---
  const reports = [
    {
      title: 'Jhaka Maka Madua – White Paper',
      excerpt: 'A policy white paper advocating the inclusion of millets and indigenous foods in Jharkhand\'s Public Distribution System and meal schemes.',
      content: 'The Jhaka Maka Madua White Paper highlights the importance of reviving indigenous millets and local food systems in Jharkhand.',
      category: 'Food Justice',
      author: 'Palakiya Foundation',
      image: '/images/reports/jhaka_maka.png',
      published: true,
      driveLink: 'https://drive.google.com/file/d/19vaQEm3M5z8t5qLkKZnTBxpclxGGTspV/view?usp=sharing',
    },
    {
      title: 'Inferno – The Human Consequences of Rising Temperatures',
      excerpt: 'An evidence-based report exploring how extreme heat disproportionately affects vulnerable communities and livelihoods.',
      content: 'Inferno documents the growing human consequences of rising temperatures and heatwaves in India.',
      category: 'Climate Justice',
      author: 'Palakiya Foundation',
      image: '/images/reports/inferno.png',
      published: true,
      driveLink: 'https://drive.google.com/file/d/1rj8Y7qzwDw9Oy2-HaqdSMd_fivG-Ms_H/view?usp=sharing',
    },
    {
      title: 'Kheti Ki Baat, Ekta AI Ke Saath',
      excerpt: 'An assessment of farmers\' engagement with AI-powered agricultural advisory systems in Bihar and Jharkhand.',
      content: 'This research report evaluates farmers\' experiences using Ekta AI, a multilingual WhatsApp-based farming assistant.',
      category: 'Agriculture & AI',
      author: 'Palakiya Foundation & EarthON Foundation',
      image: '/images/reports/Khet_ki_baat.png',
      published: true,
      driveLink: 'https://drive.google.com/file/d/1QUjQ4_5h1q7PXQhMjtklZ9558gzQY3Bj/view?usp=sharing',
    },
    {
      title: 'Millet Manifesto',
      excerpt: 'Policy recommendations for strengthening millet cultivation and integrating indigenous food systems into Jharkhand\'s development agenda.',
      content: 'The Millet Manifesto presents a comprehensive set of policy recommendations for the Jharkhand Assembly Elections.',
      category: 'Policy Advocacy',
      author: 'Palakiya Foundation',
      image: '/images/reports/manifesto.png',
      published: true,
      driveLink: 'https://drive.google.com/file/d/1CJJJLgHbbr9VS971D8R_1nt1mK5nio0m/view?usp=sharing',
    },
  ];

  await prisma.report.deleteMany();
  for (const r of reports) {
    await prisma.report.create({ data: { ...r, slug: slugify(r.title) } });
  }
  console.log(reports.length + ' reports seeded');

  // --- Team Members ---
  const teamMembers = [
    { name: 'Dr. Ananya Sharma', role: 'Executive Director', bio: 'Leading community health initiatives with over 15 years of experience.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', order: 1 },
    { name: 'Ravi Kumar', role: 'Programs Coordinator', bio: 'Passionate about sustainable agriculture and food justice.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', order: 2 },
    { name: 'Priya Singh', role: 'Research Lead', bio: 'Driving evidence-based policy research on climate justice and food systems.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80', order: 3 },
    { name: 'Amit Verma', role: 'Field Operations Manager', bio: 'Ensuring smooth execution of community programs across remote areas.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', order: 4 },
  ];

  await prisma.teamMember.deleteMany();
  for (const m of teamMembers) {
    await prisma.teamMember.create({ data: m });
  }
  console.log(teamMembers.length + ' team members seeded');

  // --- Site content (homepage editable fields) ---
  const content = {
    hero_badge: 'Hope in Action since 2010',
    hero_title: 'Empowering Communities for a Healthier Tomorrow',
    hero_subtitle: 'We are not just an organization — we are a living story of change. Together, we build healthier, more equitable and self-reliant communities.',
    hero_cta_primary: 'Support Our Cause',
    hero_cta_secondary: 'Explore Programs',
    hero_img_1: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=600&q=80',
    hero_img_2: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
    hero_img_3: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
    hero_img_4: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
    hero_avatar_1: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
    hero_avatar_2: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
    hero_avatar_3: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80',
    hero_avatar_4: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
    home_intro_image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=80',
    about_page_image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=900&q=80',
    about_intro: 'Palakiya Foundation empowers communities through climate justice, sustainable food systems, and climate education.',
    stat_people: '750000',
    stat_people_label: 'People Reached',
    stat_villages: '81000',
    stat_villages_label: 'Villages Covered',
    stat_programs: '120',
    stat_programs_label: 'Programs Conducted',
    stat_volunteers: '5000',
    stat_volunteers_label: 'Active Volunteers',
    stat_years: '10',
    mission: 'To empower marginalised communities through accessible healthcare, quality education and sustainable livelihoods.',
    vision: 'A just and equitable world where every community has the resources, knowledge and opportunity to thrive.',
    cta_title: 'Join us in creating lasting change',
    cta_subtitle: 'Every contribution, every volunteer hour and every shared story brings us closer to a healthier, more equitable world.',
    contact_address: '7A Third Floor, Radhey Shyam Park, Delhi 110051',
    contact_email: 'admin@palakiyafoundation.org',
    contact_phone: '+91 8178570109',
    social_facebook: 'https://facebook.com',
    social_twitter: 'https://twitter.com',
    social_instagram: 'https://instagram.com',
    social_linkedin: 'https://linkedin.com',
    org_name: 'Palakiya Foundation',
  };

  for (const [key, value] of Object.entries(content)) {
    await prisma.siteContent.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  console.log('Site content seeded (' + Object.keys(content).length + ' keys)');

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
