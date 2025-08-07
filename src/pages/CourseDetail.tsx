import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Star, 
  Clock, 
  Users, 
  Play, 
  BookOpen, 
  CheckCircle, 
  Lock, 
  Download,
  MessageSquare,
  Share2,
  ArrowLeft,
  Calendar,
  Award,
  FileText,
  Video,
  Check
} from 'lucide-react';
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

interface CourseSection {
  id: string;
  title: string;
  description: string;
  order_index: number;
  is_free: boolean;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  video_url?: string;
  video_duration?: number;
  lesson_type: 'video' | 'text' | 'quiz' | 'assignment';
  order_index: number;
  is_free: boolean;
  status: 'draft' | 'published' | 'archived';
}

interface CourseMaterial {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_size?: number;
  file_type?: string;
  is_free: boolean;
  download_count: number;
}

interface CourseReview {
  id: string;
  rating: number;
  review_text: string;
  helpful_votes: number;
  created_at: string;
  user?: {
    full_name: string;
    avatar_url?: string;
  };
}

interface Enrollment {
  id: string;
  enrollment_date: string;
  completion_date?: string;
  progress_percentage: number;
  status: 'active' | 'completed' | 'cancelled' | 'expired';
}

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  // Load course details
  const loadCourseDetails = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          action: 'get_course_details',
          data: { course_id: courseId }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setCourse(result.course);
        setSections(result.sections || []);
        setMaterials(result.materials || []);
        setReviews(result.reviews || []);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load course details",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load course details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [courseId, toast]);

  // Check enrollment status
  const checkEnrollment = useCallback(async () => {
    if (!courseId) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          action: 'get_course_progress',
          data: { course_id: courseId }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setEnrollment(result.enrollment);
      }
    } catch (error) {
      // Enrollment check failed, user might not be enrolled
    }
  }, [courseId]);

  useEffect(() => {
    loadCourseDetails();
    checkEnrollment();
  }, [loadCourseDetails, checkEnrollment]);

  // Handle course enrollment
  const handleEnrollCourse = useCallback(async () => {
    if (!courseId) return;

    try {
      setEnrolling(true);
      
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
        setEnrollment(result.enrollment);
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
    } finally {
      setEnrolling(false);
    }
  }, [courseId, toast]);

  // Get difficulty color
  const getDifficultyColor = useCallback((difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
  const formatDuration = useCallback((seconds?: number) => {
    if (!seconds) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, []);

  // Calculate total lessons
  const totalLessons = useMemo(() => {
    return sections.reduce((total, section) => total + section.lessons.length, 0);
  }, [sections]);

  // Calculate free lessons
  const freeLessons = useMemo(() => {
    return sections.reduce((total, section) => {
      return total + section.lessons.filter(lesson => lesson.is_free).length;
    }, 0);
  }, [sections]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-muted rounded mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-96 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Course not found</h1>
          <Button onClick={() => navigate('/courses')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/courses')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge className={getDifficultyColor(course.difficulty_level)}>
                  {course.difficulty_level}
                </Badge>
                {course.category && (
                  <Badge variant="outline">{course.category}</Badge>
                )}
                {course.featured && (
                  <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-primary mb-4">{course.title}</h1>
              <p className="text-muted-foreground text-lg mb-6">{course.short_description || course.description}</p>

              {/* Course Stats */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{course.enrollment_count} enrolled</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{course.duration_hours} hours</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen size={16} />
                  <span>{totalLessons} lessons</span>
                </div>
                {course.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-500" fill="currentColor" />
                    <span>{course.rating.toFixed(1)} ({course.review_count} reviews)</span>
                  </div>
                )}
              </div>

              {/* Instructor */}
              {course.instructor && (
                <div className="flex items-center gap-3 mb-6 p-4 bg-muted/50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    {course.instructor.avatar_url ? (
                      <img
                        src={course.instructor.avatar_url}
                        alt={course.instructor.full_name}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <span className="text-lg font-medium">
                        {course.instructor.full_name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-primary">Instructor</p>
                    <p className="text-muted-foreground">{course.instructor.full_name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Course Content Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What you'll learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.tags?.map((tag, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{tag}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Course Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {course.description}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Content</CardTitle>
                    <CardDescription>
                      {totalLessons} lessons • {course.duration_hours} hours total
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {sections.map((section, sectionIndex) => (
                        <AccordionItem key={section.id} value={`section-${sectionIndex}`}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-center justify-between w-full">
                              <div>
                                <h3 className="font-medium">{section.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {section.lessons.length} lessons
                                </p>
                              </div>
                              {section.is_free && (
                                <Badge variant="outline" className="text-xs">Free</Badge>
                              )}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {section.lessons.map((lesson, lessonIndex) => (
                                <div key={lesson.id} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                                  <div className="flex items-center gap-2">
                                    {lesson.lesson_type === 'video' ? (
                                      <Video className="w-4 h-4 text-muted-foreground" />
                                    ) : lesson.lesson_type === 'quiz' ? (
                                      <CheckCircle className="w-4 h-4 text-muted-foreground" />
                                    ) : (
                                      <FileText className="w-4 h-4 text-muted-foreground" />
                                    )}
                                    <span className="text-sm">{lesson.title}</span>
                                    {lesson.is_free && (
                                      <Badge variant="outline" className="text-xs">Free</Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {lesson.video_duration && (
                                      <span className="text-xs text-muted-foreground">
                                        {formatDuration(lesson.video_duration)}
                                      </span>
                                    )}
                                    {!enrollment && !lesson.is_free && (
                                      <Lock className="w-4 h-4 text-muted-foreground" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                    <CardDescription>
                      {reviews.length} reviews • Average rating: {course.rating.toFixed(1)}/5
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">{review.user?.full_name || 'Anonymous'}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.review_text}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                {/* Course Preview */}
                {course.thumbnail_url && (
                  <div className="mb-6">
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Price */}
                <div className="mb-6">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatPrice(course.price, course.currency)}
                  </div>
                  {course.price === 0 && (
                    <p className="text-sm text-muted-foreground">
                      {freeLessons} free lessons available
                    </p>
                  )}
                </div>

                {/* Enrollment Status */}
                {enrollment ? (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium">Enrolled</span>
                    </div>
                    <Progress value={enrollment.progress_percentage} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {enrollment.progress_percentage.toFixed(0)}% complete
                    </p>
                    <Button className="w-full mt-4" onClick={() => navigate(`/course/${courseId}/learn`)}>
                      <Play className="w-4 h-4 mr-2" />
                      Continue Learning
                    </Button>
                  </div>
                ) : (
                  <div className="mb-6">
                    <Button 
                      className="w-full mb-4" 
                      onClick={handleEnrollCourse}
                      disabled={enrolling}
                    >
                      {enrolling ? 'Enrolling...' : (course.price === 0 ? 'Enroll Free' : 'Enroll Now')}
                    </Button>
                    {course.price > 0 && (
                      <p className="text-xs text-muted-foreground text-center">
                        30-Day Money-Back Guarantee
                      </p>
                    )}
                  </div>
                )}

                {/* Course Features */}
                <div className="space-y-3">
                  <h3 className="font-medium text-primary">This course includes:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-muted-foreground" />
                      <span>{course.duration_hours} hours on-demand video</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-muted-foreground" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-muted-foreground" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <span>Community support</span>
                    </div>
                  </div>
                </div>

                {/* Share */}
                <div className="mt-6 pt-6 border-t">
                  <Button variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail; 