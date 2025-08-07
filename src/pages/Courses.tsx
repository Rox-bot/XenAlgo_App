import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Clock, Users, Play, BookOpen, Filter, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  thumbnail_url?: string;
  banner_url?: string;
  price: number;
  currency: string;
  duration_hours: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  enrollment_count: number;
  rating: number;
  review_count: number;
  instructor?: {
    full_name: string;
    avatar_url?: string;
  };
  created_at: string;
}

interface CourseFilters {
  category: string;
  difficulty: string;
  priceRange: string;
  featured: boolean;
}

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<CourseFilters>({
    category: '',
    difficulty: '',
    priceRange: '',
    featured: false
  });

  // Load courses
  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          action: 'get_courses',
          data: {
            status: 'published',
            limit: 50
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setCourses(result.courses || []);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load courses",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Filter and search courses
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // Search term filter
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = !filters.category || course.category === filters.category;

      // Difficulty filter
      const matchesDifficulty = !filters.difficulty || course.difficulty_level === filters.difficulty;

      // Price range filter
      const matchesPriceRange = !filters.priceRange || 
        (filters.priceRange === 'free' && course.price === 0) ||
        (filters.priceRange === 'paid' && course.price > 0) ||
        (filters.priceRange === 'premium' && course.price > 999);

      // Featured filter
      const matchesFeatured = !filters.featured || course.featured;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesPriceRange && matchesFeatured;
    });
  }, [courses, searchTerm, filters]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(courses.map(course => course.category).filter(Boolean))];
    return uniqueCategories.sort();
  }, [courses]);

  // Handle course enrollment
  const handleEnrollCourse = useCallback(async (courseId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          action: 'enroll_course',
          data: { course_id: courseId }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Successfully enrolled in course!",
        });
        // Navigate to course details
        navigate(`/course/${courseId}`);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to enroll in course",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enroll in course",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  // Handle course click
  const handleCourseClick = useCallback((courseId: string) => {
    navigate(`/course/${courseId}`);
  }, [navigate]);

  // Get difficulty color
  const getDifficultyColor = useCallback((difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-600 text-white';
      case 'intermediate': return 'bg-yellow-600 text-white';
      case 'advanced': return 'bg-orange-600 text-white';
      case 'expert': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  }, []);

  // Format price
  const formatPrice = useCallback((price: number, currency: string) => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR'
    }).format(price);
  }, []);

  // Format duration
  const formatDuration = useCallback((hours: number) => {
    if (hours < 1) return '< 1 hour';
    if (hours === 1) return '1 hour';
    return `${hours} hours`;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Trading Courses</h1>
          <p className="text-primary text-lg">
            Master the art of trading with our comprehensive courses designed by experts
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" size={20} />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Difficulty Filter */}
            <Select value={filters.difficulty} onValueChange={(value) => setFilters(prev => ({ ...prev, difficulty: value }))}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Filter */}
            <Select value={filters.priceRange} onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={filters.featured}
              onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <label htmlFor="featured" className="text-sm text-primary">
              Show featured courses only
            </label>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-primary">
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-muted rounded w-full mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Courses Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
                <div 
                  className="relative h-48 bg-muted rounded-t-lg overflow-hidden"
                  onClick={() => handleCourseClick(course.id)}
                >
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <BookOpen className="text-primary" size={48} />
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {course.featured && (
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                      Featured
                    </Badge>
                  )}

                  {/* Price Badge */}
                  <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                    {formatPrice(course.price, course.currency)}
                  </Badge>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="text-white" size={48} />
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle 
                        className="text-lg line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleCourseClick(course.id)}
                      >
                        {course.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-2">
                        {course.short_description || course.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Course Meta */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-primary">
                      <div className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span>{formatDuration(course.duration_hours)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users size={16} />
                        <span>{course.enrollment_count} enrolled</span>
                      </div>
                    </div>

                    {/* Rating */}
                    {course.rating > 0 && (
                      <div className="flex items-center space-x-1">
                        <Star className="text-yellow-500" size={16} fill="currentColor" />
                        <span className="text-sm font-medium">{course.rating.toFixed(1)}</span>
                        <span className="text-xs text-primary">({course.review_count})</span>
                      </div>
                    )}
                  </div>

                  {/* Difficulty and Category */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getDifficultyColor(course.difficulty_level)}>
                      {course.difficulty_level}
                    </Badge>
                    {course.category && (
                      <Badge className="text-xs bg-secondary text-secondary-foreground">
                        {course.category}
                      </Badge>
                    )}
                  </div>

                  {/* Instructor */}
                  {course.instructor && (
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        {course.instructor.avatar_url ? (
                          <img
                            src={course.instructor.avatar_url}
                            alt={course.instructor.full_name}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <span className="text-xs font-medium">
                            {course.instructor.full_name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-primary">
                        {course.instructor.full_name}
                      </span>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button 
                    className="w-full"
                    onClick={() => handleEnrollCourse(course.id)}
                  >
                    {course.price === 0 ? 'Enroll Free' : 'Enroll Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto text-primary mb-4" size={64} />
            <h3 className="text-xl font-semibold text-primary mb-2">No courses found</h3>
            <p className="text-primary">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;