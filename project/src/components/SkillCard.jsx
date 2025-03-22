import { Star } from 'lucide-react';
import { cn } from '../lib/utils';

export function SkillCard({
  title,
  description,
  price,
  rating,
  category,
  studentName,
  studentImage,
  className,
}) {
  return (
    <div className={cn("bg-white rounded-lg shadow-md overflow-hidden", className)}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-blue-600">{category}</span>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600">{rating}</span>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={studentImage}
              alt={studentName}
              className="w-8 h-8 rounded-full"
            />
            <span className="ml-2 text-sm text-gray-700">{studentName}</span>
          </div>
          <span className="text-lg font-bold text-gray-900">${price}/hr</span>
        </div>
      </div>
    </div>
  );
}