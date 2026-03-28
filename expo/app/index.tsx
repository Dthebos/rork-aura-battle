import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/use-auth-store';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return null;
  }
  
  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/auth/login" />;
  }
}