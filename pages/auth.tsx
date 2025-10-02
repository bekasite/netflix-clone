const Auth = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(''); // Add error state

  const [variant, setVariant] = useState('login');

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login');
    setError(''); // Clear errors when toggling
  }, []);

  const login = useCallback(async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/profiles');
      }
    } catch (error) {
      console.log(error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, router]);

  const register = useCallback(async () => {
    // Validation
    if (!email || !name || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await axios.post('/api/register', {
        email,
        name,
        password
      });

      // Auto-login after successful registration
      await login();
    } catch (error: any) {
      console.log('Registration error:', error);
      
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection.');
      } else {
        setError('Registration failed. Please try again.');
      }
      
      setIsLoading(false);
    }
  }, [email, name, password, login]);

  // Add this function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (variant === 'login') {
      login();
    } else {
      register();
    }
  };

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
            
            {/* Error Message Display */}
            {error && (
              <div className="bg-red-600 text-white p-3 rounded-md mb-4 text-center">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                {variant === 'register' && (
                  <Input
                    id="name"
                    type="text"
                    label="Username"
                    value={name}
                    onChange={(e: any) => setName(e.target.value)} 
                    disabled={isLoading}
                  />
                )}
                <Input
                  id="email"
                  type="email"
                  label="Email address"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)} 
                  disabled={isLoading}
                />
                <Input
                  type="password" 
                  id="password" 
                  label="Password" 
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)} 
                  disabled={isLoading}
                />
              </div>
              
              <button 
                type="submit"
                disabled={isLoading}
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
            </form>

            {/* Rest of your social login buttons */}
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
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}