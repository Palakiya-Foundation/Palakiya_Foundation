import prisma from '../config/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';
import { resolveImageAsset } from '../utils/media.js';

const imageKeys = [
  'hero_img_1', 'hero_img_2', 'hero_img_3', 'hero_img_4',
  'hero_avatar_1', 'hero_avatar_2', 'hero_avatar_3', 'hero_avatar_4',
  'home_intro_image', 'join_us_img_1', 'join_us_img_2', 'about_page_image',
];

const defaults = {
  hero_badge: 'Hope in Action',
  hero_title: 'Empowering Communities for a Healthier Tomorrow',
  hero_subtitle: 'We build healthier, more equitable and self-reliant communities — leaving no one behind.',
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

const buildContentMap = (rows) => ({ ...defaults, ...rows.reduce((acc, r) => ({ ...acc, [r.key]: r.value }), {}) });

// GET /api/content  -> { key: value, ... }
export const getContent = asyncHandler(async (req, res) => {
  const rows = await prisma.siteContent.findMany();
  res.json(buildContentMap(rows));
});

// PUT /api/content  (admin) -> bulk upsert from body object
export const updateContent = asyncHandler(async (req, res) => {
  const entries = Object.entries(req.body || {});
  for (const key of imageKeys) {
    const file = req.files?.[key]?.[0];
    const value = await resolveImageAsset(req, key, file, key);
    if (value !== undefined) {
      const existing = entries.findIndex(([entryKey]) => entryKey === key);
      if (existing >= 0) entries[existing] = [key, value];
      else entries.push([key, value]);
    }
  }
  if (entries.length === 0) {
    return res.status(400).json({ message: 'No content provided' });
  }

  await Promise.all(
    entries.map(([key, value]) =>
      prisma.siteContent.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
  );

  const rows = await prisma.siteContent.findMany();
  res.json(buildContentMap(rows));
});
