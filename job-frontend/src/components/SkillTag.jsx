const SkillTag = ({ skill, variant = 'default', onRemove }) => {
  const variants = {
    default: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800',
    gray: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${variants[variant]} transition-all hover:scale-105`}
    >
      {skill}
      {onRemove && (
        <button
          onClick={() => onRemove(skill)}
          className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors"
        >
          ×
        </button>
      )}
    </span>
  );
};

export default SkillTag;
