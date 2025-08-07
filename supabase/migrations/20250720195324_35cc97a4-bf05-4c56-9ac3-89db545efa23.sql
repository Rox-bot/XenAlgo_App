-- Fix security warnings: Add proper search_path to all functions
-- This prevents search_path injection attacks

-- Update the handle_new_user function with secure search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  
  -- Also create default journal settings
  INSERT INTO public.user_journal_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$function$;

-- Update the update_updated_at_column function with secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;