import StarIcon from '../assets/star.svg?react';

const Star = ({ fillPercent }) => {
  return (
    <div className="relative w-6 h-6">
      {/* Empty star */}
      <StarIcon className="absolute text-gray-300 w-6 h-6" />

      {/* Filled star (clipped) */}
      <div
        className="absolute overflow-hidden top-0 left-0 h-full"
        style={{ width: `${fillPercent}%` }}
      >
        <StarIcon className="text-yellow-400 w-6 h-6" />
      </div>
    </div>
  );
};

export const RatingStars = ({ rating }) => {
  return (
    <div className="flex">
      {[1,2,3,4,5].map((i) => {
        const diff = rating - i;

        let fill = 0;
        if (diff >= 0) fill = 100;          // full star
        else if (diff > -1) fill = (1 + diff) * 100; // partial
        else fill = 0;                     // empty

        return <Star key={i} fillPercent={fill} />;
      })}
    </div>
  );
};
