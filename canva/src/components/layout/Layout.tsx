import { ReactNode } from 'react';
import Header from './Header';
import { PlotConfig } from '@/lib/plotDefaults';

interface LayoutProps {
  children: ReactNode;
  config?: PlotConfig;
  updateConfig?: (updates: Partial<PlotConfig>) => void;
  onExport?: () => void;
}

const Layout = ({ children, config, updateConfig, onExport }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header config={config} updateConfig={updateConfig} onExport={onExport} />
      <main className="flex-1 p-1 sm:p-6 md:p-8 max-w-9xl mx-auto w-full">
        {children}
      </main>
      <footer className="mt-auto py-8 px-6 text-center border-t bg-gradient-to-r from-gray-50 via-white to-gray-50 shadow-inner">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-science-800 mb-3">Sci Plot Canvas</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                A powerful scientific plotting tool for researchers, scientists and data analysts.
                Create publication-ready graphs with ease.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-3">&copy; {new Date().getFullYear()} Sci Plot Canvas</p>
              <div className="flex items-center space-x-6 text-sm">
                <a href="#" className="text-science-700 hover:text-science-800 transition-colors hover:underline">Terms</a>
                <a href="#" className="text-science-700 hover:text-science-800 transition-colors hover:underline">Privacy</a>
                <a href="#" className="text-science-700 hover:text-science-800 transition-colors hover:underline">Help</a>
                <a href="#" className="text-science-700 hover:text-science-800 transition-colors hover:underline">Contact</a>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-3 font-medium">Connect with us</p>
              <div className="flex justify-end space-x-4">
                <a href="#" className="text-science-700 hover:text-science-800 transition-colors transform hover:scale-110" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-science-700 hover:text-science-800 transition-colors transform hover:scale-110" aria-label="Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" className="text-science-700 hover:text-science-800 transition-colors transform hover:scale-110" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a href="#" className="text-science-700 hover:text-science-800 transition-colors transform hover:scale-110" aria-label="GitHub">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
{/*           
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Built with ❤️ for the scientific community. All rights reserved.
            </p>
          </div> */}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
