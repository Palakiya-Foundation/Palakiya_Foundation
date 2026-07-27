import * as Icons from 'lucide-react';

// Render a Lucide icon by string name, with a safe fallback
const DynamicIcon = ({ name, ...props }) => {
  const Icon = Icons[name] || Icons.Sparkles;
  return <Icon {...props} />;
};

export default DynamicIcon;
