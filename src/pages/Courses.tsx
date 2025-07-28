import React, { useState } from 'react';
import { Filter, Clock, Star, ShoppingCart, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Courses = () => {
  const [sortBy, setSortBy] = useState('newest');
  const [filterInstructor, setFilterInstructor] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const courses = [
    {
      id: 1,
      title: "Global Economic Indicators",
      instructor: "Sarthak Mathur",
      duration: "2h",
      category: "Investment and Trading",
      price: 3999,
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=250&fit=crop",
      rating: 4.8,
      students: 156,
      description: "Master the key economic indicators that drive global markets"
    },
    {
      id: 2,
      title: "Tax Planning for Investors",
      instructor: "Sarthak Mathur",
      duration: "2h 30m",
      category: "Investment and Trading",
      price: 1499,
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
      rating: 4.6,
      students: 89,
      description: "Optimize your tax strategy for maximum investment returns"
    },
    {
      id: 3,
      title: "Investment Psychology and Decision Making",
      instructor: "Sarthak Mathur",
      duration: "4h",
      category: "Psychology",
      price: 4999,
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop",
      rating: 4.9,
      students: 234,
      description: "Understand the psychological aspects of successful investing"
    },
    {
      id: 4,
      title: "Futures and Options Trading",
      instructor: "Sarthak Mathur",
      duration: "4h 30m",
      category: "Investment and Trading",
      price: 4999,
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop",
      rating: 4.7,
      students: 312,
      description: "Master derivatives trading with comprehensive F&O strategies"
    },
    {
      id: 5,
      title: "Understanding Mutual Funds and ETFs",
      instructor: "Sarthak Mathur",
      duration: "2h",
      category: "Investment and Trading",
      price: 1999,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      rating: 4.5,
      students: 178,
      description: "Complete guide to mutual funds and ETF investing"
    },
    {
      id: 6,
      title: "Introduction to Stock Market Investing",
      instructor: "Sarthak Mathur",
      duration: "2h",
      category: "Investment and Trading",
      price: 2999,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      rating: 4.8,
      students: 445,
      description: "Start your stock market journey with solid foundations"
    },
    {
      id: 7,
      title: "Risk Management in Trading",
      instructor: "Sarthak Mathur",
      duration: "2h",
      category: "Investment and Trading",
      price: 1999,
      image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=250&fit=crop",
      rating: 4.7,
      students: 267,
      description: "Learn essential risk management techniques for trading"
    },
    {
      id: 8,
      title: "Cryptocurrency Investment Fundamentals",
      instructor: "Sarthak Mathur",
      duration: "3h",
      category: "Digital Assets",
      price: 3999,
      image: "https://images.unsplash.com/photo-1518544866506-7cc81b4d1ad4?w=400&h=250&fit=crop",
      rating: 4.6,
      students: 198,
      description: "Navigate the cryptocurrency market with confidence"
    },
    {
      id: 9,
      title: "Real Estate Investing Basics",
      instructor: "Sarthak Mathur",
      duration: "2h",
      category: "Alternative Investments",
      price: 3999,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
      rating: 4.4,
      students: 1,
      description: "Build wealth through real estate investment strategies"
    }
  ];

  const categories = [
    'All Categories',
    'Investment and Trading',
    'Psychology',
    'Digital Assets',
    'Alternative Investments'
  ];

  const filteredCourses = courses.filter(course => {
    const instructorMatch = filterInstructor === 'all' || course.instructor === filterInstructor;
    const categoryMatch = filterCategory === 'all' || course.category === filterCategory;
    return instructorMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Trading Courses
            </h1>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Master the markets with our comprehensive trading education courses
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Filter & Sort</span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Release Date (newest first)</SelectItem>
                  <SelectItem value="oldest">Release Date (oldest first)</SelectItem>
                  <SelectItem value="title-az">Course Title (a-z)</SelectItem>
                  <SelectItem value="title-za">Course Title (z-a)</SelectItem>
                  <SelectItem value="price-low">Price (low to high)</SelectItem>
                  <SelectItem value="price-high">Price (high to low)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterInstructor} onValueChange={setFilterInstructor}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by instructor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Instructors</SelectItem>
                  <SelectItem value="Sarthak Mathur">Sarthak Mathur (SM)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Investment and Trading">Investment and Trading</SelectItem>
                  <SelectItem value="Psychology">Psychology</SelectItem>
                  <SelectItem value="Digital Assets">Digital Assets</SelectItem>
                  <SelectItem value="Alternative Investments">Alternative Investments</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {course.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-primary">
                        ₹{course.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {course.students} students enrolled
                      </span>
                    </div>
                    <Button className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join thousands of traders who have transformed their skills with our courses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Browse All Courses
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Courses;