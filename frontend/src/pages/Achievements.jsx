import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import api from '../api/client.js';
import PageHeader from '../components/PageHeader.jsx';
import AchievementCard from '../components/AchievementCard.jsx';
import { SkeletonGrid } from '../components/Skeletons.jsx';
import CTASection from '../components/CTASection.jsx';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/achievements')
      .then((res) => setAchievements(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Achievements"
        title="Milestones that mark our journey"
        subtitle="Every accomplishment is a testament to the communities we serve and the supporters who believe in our mission."
      />

      <section className="section">
        <div className="container-x">
          {loading ? (
            <SkeletonGrid count={6} />
          ) : achievements.length === 0 ? (
            <div className="card mx-auto flex max-w-md flex-col items-center py-16 text-center text-ink-400">
              <Trophy size={40} />
              <p className="mt-3 text-sm">Our achievements will be showcased here soon.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {achievements.map((a, i) => (
                <AchievementCard key={a.id} achievement={a} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
};

export default Achievements;
