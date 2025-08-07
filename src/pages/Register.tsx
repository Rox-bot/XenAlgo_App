import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Register = () => {
  const { user, signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Enhanced email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Enhanced password validation
  const validatePassword = (password: string): { isValid: boolean; message: string } => {
    if (password.length < 6) {
      return { isValid: false, message: 'Password must be at least 6 characters long' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    return { isValid: true, message: '' };
  };

  // Enhanced error message mapping
  const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    
    const errorMessage = error?.message || 'An error occurred';
    
    // Map technical errors to user-friendly messages
    if (errorMessage.includes('Email already in use')) {
      return 'An account with this email already exists. Please sign in instead.';
    }
    if (errorMessage.includes('Invalid email')) {
      return 'Please enter a valid email address.';
    }
    if (errorMessage.includes('Weak password')) {
      return 'Please choose a stronger password with at least 6 characters.';
    }
    if (errorMessage.includes('Too many requests')) {
      return 'Too many registration attempts. Please wait a moment and try again.';
    }
    if (errorMessage.includes('Network error')) {
      return 'Network connection error. Please check your internet and try again.';
    }
    
    return errorMessage;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.fullName.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters)');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await signUpWithEmail(formData.email, formData.password);
      if (error) {
        const userFriendlyError = getErrorMessage(error);
        setError(userFriendlyError);
        toast.error(userFriendlyError);
      } else {
        toast.success('Account created successfully! Please check your email for verification.');
        navigate('/dashboard');
      }
    } catch (error: any) {
      const userFriendlyError = getErrorMessage(error);
      setError(userFriendlyError);
      toast.error(userFriendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      toast.success('Successfully signed in with Google!');
      navigate('/dashboard');
    } catch (error: any) {
      const userFriendlyError = getErrorMessage(error);
      setError(userFriendlyError);
      toast.error(userFriendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-soft">
      <Navbar />
      
      {/* Register Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 text-primary">Create Account</h1>
              <p className="text-primary">
                Join XenAlgo and start your trading journey
              </p>
            </div>

            <Card className="bg-background-pure border border-border-light shadow-medium">
              <CardHeader>
                <CardTitle className="text-center text-primary">Sign Up</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert className="mb-4 border-error bg-error/10">
                    <AlertDescription className="text-error">{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  {/* Full Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-primary">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-primary" />
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="pl-10 bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                        disabled={isLoading}
                        aria-describedby="fullname-error"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-primary">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-primary" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                        disabled={isLoading}
                        aria-describedby="email-error"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-primary">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-primary" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                        disabled={isLoading}
                        aria-describedby="password-error"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-primary hover:text-luxury-gold transition-colors"
                        disabled={isLoading}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-primary">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-primary" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 bg-background-pure border-border-light text-primary placeholder:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                        disabled={isLoading}
                        aria-describedby="confirm-password-error"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-primary hover:text-luxury-gold transition-colors"
                        disabled={isLoading}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                      }
                      disabled={isLoading}
                      className="border-border-light mt-1"
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm text-primary leading-relaxed">
                      I agree to the{' '}
                      <Link 
                        to="/auth" 
                        className="text-primary hover:text-luxury-gold transition-colors"
                      >
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link 
                        to="/auth" 
                        className="text-primary hover:text-luxury-gold transition-colors"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  {/* Sign Up Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-background-soft hover:bg-primary-light transition-colors" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background-soft mr-2"></div>
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border-light" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background-pure px-2 text-primary">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Sign In */}
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-border-light text-primary hover:bg-background-ultra transition-colors"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>

                {/* Sign In Link */}
                <div className="text-center mt-6">
                  <p className="text-sm text-primary">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      className="text-primary hover:text-luxury-gold transition-colors font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Register;