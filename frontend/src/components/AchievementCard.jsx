import { motion } from 'framer-motion';
import { Calendar, Trophy } from 'lucide-react';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const AchievementCard = ({ achievement, index = 0 }) => (
  <motion.article
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
    className="card-hover group flex flex-col overflow-hidden"
  >
    <div className="relative h-48 overflow-hidden">
      {achievement.image ? (
        <img
          src={achievement.image}
          alt={achievement.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-ocean-100 text-brand-500">
          <Trophy size={42} />
        </div>
      )}
      <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 backdrop-blur">
        <Trophy size={13} /> Achievement
      </span>
    </div>
    <div className="flex flex-1 flex-col p-6">
      <div className="flex items-center gap-2 text-xs text-ink-400">
        <Calendar size={14} />
        <span>{formatDate(achievement.createdAt)}</span>
      </div>
      <h3 className="mt-3 text-lg font-bold leading-snug text-ink-900 transition group-hover:text-brand-700">
        {achievement.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{achievement.description}</p>
    </div>
  </motion.article>
);

export default AchievementCard;
