import React from 'react';
import { Users } from 'lucide-react';

export const AuthorCredits: React.FC = () => {
  return (
    <div className="text-center py-8 mt-12">
      <div className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl mb-3 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <Users className="w-5 h-5 text-indigo-600/70 dark:text-indigo-400/70" />
        <span className="font-medium text-indigo-900/70 dark:text-indigo-300/70">Team "Brainy Bots"</span>
      </div>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
        {['Sonjil', 'Sachin', 'Karthik', 'Ashhar'].map((author, index) => (
          <React.Fragment key={author}>
            <span className="transition-colors duration-200 hover:text-indigo-600 dark:hover:text-indigo-400">
              {author}
            </span>
            {index < 3 && (
              <span className="text-gray-300 dark:text-gray-600">•</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};