
import React from 'react';

interface InfoCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ label, value, icon }) => {
  return (
    <div className="bg-white/60 p-5 rounded-2xl border border-white/40 shadow-sm flex items-start space-x-4">
      <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-sm font-semibold text-gray-800 break-all">{value}</p>
      </div>
    </div>
  );
};

export default InfoCard;
