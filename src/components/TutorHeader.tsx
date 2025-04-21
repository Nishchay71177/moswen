import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, Calculator as CalcIcon, PenLine, LogIn, Menu, X, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from './ThemeToggle';
import { Calculator } from './Calculator';

const TutorHeader = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/formulae', icon: <CalcIcon className="h-4 w-4" />, label: 'Formulae' },
    { path: '/learn', icon: <GraduationCap className="h-4 w-4" />, label: 'Learn' },
    { path: '/practice', icon: <PenLine className="h-4 w-4" />, label: 'Practice' },
    { path: '/about', icon: <Book className="h-4 w-4" />, label: 'About' },
  ];

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Link 
          key={item.path}
          to={item.path} 
          className={`flex items-center space-x-1 text-sm font-medium transition-colors relative group ${
            location.pathname === item.path 
              ? 'text-tutor-blue' 
              : 'text-gray-600 hover:text-tutor-purple dark:text-gray-300'
          }`}
        >
          {location.pathname === item.path && (
            <motion.div 
              layoutId="activeNavIndicator"
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-tutor-blue"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className="transition-transform group-hover:scale-110">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  );

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-sm dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/80' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-tutor-blue to-tutor-purple text-transparent bg-clip-text"
            >
              Moswen
            </motion.span>
          </Link>

          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-6 py-6">
                  <div className="px-2">
                    <Link to="/" className="flex items-center space-x-2">
                      <span className="text-2xl font-bold bg-gradient-to-r from-tutor-blue to-tutor-purple text-transparent bg-clip-text">
                        Moswen
                      </span>
                    </Link>
                  </div>
                  <nav className="flex flex-col space-y-4 px-2">
                    {navItems.map((item) => (
                      <Link 
                        key={item.path}
                        to={item.path} 
                        className="flex items-center space-x-2 py-2 text-base font-medium text-gray-700 hover:text-tutor-purple dark:text-gray-300"
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </nav>
                  <div className="px-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {user ? (
                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-2 py-2 text-base font-medium text-gray-700 hover:text-tutor-purple dark:text-gray-300"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.user_metadata?.avatar_url} />
                          <AvatarFallback className="bg-tutor-purple text-white">
                            {user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>My Profile</span>
                      </Link>
                    ) : (
                      <Link to="/auth" className="w-full">
                        <Button className="w-full" variant="outline">
                          <LogIn className="h-4 w-4 mr-2" />
                          Login
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <nav className="hidden md:flex items-center space-x-4">
              <NavLinks />
              <Calculator />
              <ThemeToggle />
              {user ? (
                <Link to="/profile">
                  <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-tutor-purple/20 transition-all hover:ring-tutor-purple/40">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-tutor-purple text-white">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" className="flex items-center gap-2 group">
                    <LogIn className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    Login
                  </Button>
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default TutorHeader;
