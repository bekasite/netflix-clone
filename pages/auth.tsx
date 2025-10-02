import axios from 'axios';
import { useCallback, useState } from 'react';
import { NextPageContext } from 'next';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

import Input from '@/components/Input';

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

const Auth = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const [variant, setVariant] = useState('login');

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login');
  }, []);

  const login = useCallback(async () => {
    setIsLoading(true);
    try {
      await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/',
      });

      router.push('/profiles');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, router]);

  const register = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/register', {
        email,
        name,
        password
      });
  
      login();
    } catch (error: any) {
      console.log('Registration error:', error);
      
      // Show user-friendly error message
      if (error.response?.data?.error) {
        alert(error.response.data.error); // Or use a better UI feedback
      } else {
        alert('Registration failed. Please try again.');
      }
      
      setIsLoading(false);
    }
  }, [email, name, password, login]);
  return (
    <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      <div className="bg-black w-full h-full lg:bg-opacity-50">
        <nav className="px-12 py-5">
          <img src="/images/logo.png" className="h-12" alt="Logo" />
        </nav>
        <div className="flex justify-center">
          <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
            <h2 className="text-white text-4xl mb-8 font-semibold">
              {variant === 'login' ? 'Sign in' : 'Register'}
            </h2>
            <div className="flex flex-col gap-4">
              {variant === 'register' && (
                <Input
                  id="name"
                  type="text"
                  label="Username"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)} 
                  // disabled={isLoading} // Disable inputs when loading
                />
              )}
              <Input
                id="email"
                type="email"
                label="Email address or phone number"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)} 
                // disabled={isLoading} // Disable inputs when loading
              />
              <Input
                type="password" 
                id="password" 
                label="Password" 
                value={password}
                onChange={(e: any) => setPassword(e.target.value)} 
                // disabled={isLoading} // Disable inputs when loading
              />
            </div>
            <button 
              onClick={variant === 'login' ? login : register} 
              disabled={isLoading} // Disable button when loading
              className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {variant === 'login' ? 'Logging in...' : 'Signing up...'}
                </>
              ) : (
                variant === 'login' ? 'Login' : 'Sign up'
              )}
            </button>
            <div className="flex flex-row items-center gap-4 mt-8 justify-center">
              <div 
                onClick={() => !isLoading && signIn('google', { callbackUrl: '/profiles' })} 
                className={`w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FcGoogle size={32} />
              </div>
              <div 
                onClick={() => !isLoading && signIn('github', { callbackUrl: '/profiles' })} 
                className={`w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FaGithub size={32} />
              </div>
            </div>
            <p className="text-neutral-500 mt-12">
              {variant === 'login' ? 'First time using Netflix?' : 'Already have an account?'}
              <span 
                onClick={!isLoading ? toggleVariant : undefined} 
                className={`text-white ml-1 hover:underline cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {variant === 'login' ? 'Create an account' : 'Login'}
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;