
import React, { useState } from 'react';
import TutorHeader from '@/components/TutorHeader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pi, SquareDot, Calculator, Circle, Search, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FormulaePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const formulas = {
    'Algebra': [
      { name: 'Quadratic Formula', formula: 'x = (-b ± √(b² - 4ac)) / 2a' },
      { name: 'Binomial Expansion', formula: '(a + b)² = a² + 2ab + b²' },
      { name: 'Linear Equation', formula: 'y = mx + c' }
    ],
    'Geometry': [
      { name: 'Circle Area', formula: 'A = πr²' },
      { name: 'Triangle Area', formula: 'A = ½bh' },
      { name: 'Pythagorean Theorem', formula: 'a² + b² = c²' }
    ],
    'Calculus': [
      { name: 'Power Rule', formula: 'd/dx(xⁿ) = nx(n-1)' },
      { name: 'Chain Rule', formula: 'dy/dx = dy/du × du/dx' },
      { name: 'Product Rule', formula: 'd/dx(uv) = u(dv/dx) + v(du/dx)' }
    ],
    'Trigonometry': [
      { name: 'Sine Law', formula: 'a/sin(A) = b/sin(B) = c/sin(C)' },
      { name: 'Cosine Law', formula: 'c² = a² + b² - 2ab×cos(C)' },
      { name: 'Basic Identities', formula: 'sin²θ + cos²θ = 1' }
    ]
  };

  const filteredFormulas = searchQuery
    ? Object.entries(formulas).reduce((acc, [category, formulas]) => {
        const filtered = formulas.filter(f => 
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.formula.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filtered.length > 0) {
          acc[category] = filtered;
        }
        return acc;
      }, {} as typeof formulas)
    : formulas;

  const hasResults = Object.keys(filteredFormulas).length > 0;
  const getSimilarFormulas = () => {
    const allFormulas = Object.values(formulas).flat();
    return allFormulas.filter(f => 
      f.name.toLowerCase().split(' ').some(word => 
        searchQuery.toLowerCase().split(' ').some(searchWord => 
          word.includes(searchWord) || searchWord.includes(word)
        )
      )
    ).slice(0, 3);
  };

  return (
    <>
      <TutorHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold tutor-gradient-text">
            Mathematical Formulae
          </h1>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>

        <div className="relative mb-8">
          <Input
            type="text"
            placeholder="Search formulas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hasResults ? (
            Object.entries(filteredFormulas).map(([category, formulas]) => (
              <Card key={category} className="bg-white/50 backdrop-blur border-tutor-purple/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-tutor-purple">
                    {category === 'Algebra' && <Calculator className="h-5 w-5" />}
                    {category === 'Geometry' && <Circle className="h-5 w-5" />}
                    {category === 'Calculus' && <Pi className="h-5 w-5" />}
                    {category === 'Trigonometry' && <SquareDot className="h-5 w-5" />}
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-4">
                      {formulas.map((formula, index) => (
                        <div key={index} className="p-3 bg-white/50 rounded-lg">
                          <h3 className="font-medium text-tutor-blue mb-1">{formula.name}</h3>
                          <p className="text-gray-700 font-mono">{formula.formula}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2">
              <Card className="bg-white/50 backdrop-blur border-tutor-purple/20">
                <CardContent className="p-6">
                  <p className="text-lg text-gray-600 mb-4">
                    No exact matches found for "{searchQuery}"
                  </p>
                  {getSimilarFormulas().length > 0 && (
                    <>
                      <h3 className="font-medium text-tutor-purple mb-3">Similar formulas you might be interested in:</h3>
                      <div className="space-y-4">
                        {getSimilarFormulas().map((formula, index) => (
                          <div key={index} className="p-3 bg-white/50 rounded-lg">
                            <h4 className="font-medium text-tutor-blue mb-1">{formula.name}</h4>
                            <p className="text-gray-700 font-mono">{formula.formula}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default FormulaePage;
