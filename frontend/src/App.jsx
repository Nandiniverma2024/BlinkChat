import { ThemeProvider } from './context/ThemeContext';
import { WallpaperProvider } from './context/WallpaperContext';
import { Routes, Route, Navigate } from 'react-router';
import ChatPage from './pages/ChatPage';
import AuthPage from './pages/AuthPage';
import { useAuth } from '@clerk/react';
import PageLoader from './components/PageLoader';
import { useAuthStore } from './store/useAuthStore';
import { Toaster } from "react-hot-toast";
import { useEffect } from 'react';


function App() {
  const {isSignedIn, isLoaded} = useAuth();

  // option 1
  // const { checkAuth, isCheckingAuth, clearAuth } = useAuthStore();

  // option 2 - better for performance
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);


   useEffect(() => {
    // if clerk is not loaded, don't do anything  , juwst return it 
    if (!isLoaded){
      return;
    }

    // if user is signed in, called checkAuth method 
    // so that we can update our state for the user and also we can connect to socket server
    if (isSignedIn){
      checkAuth();
    }else{ //else call clearAuth method
      clearAuth();
    }
  }, [checkAuth, clearAuth, isLoaded, isSignedIn]);


  // if clerk is not loaded show this component or 
  // if user is signed in and we are still checking for the Auth
  // then show this PageLoader component
  if (!isLoaded || (isSignedIn && isCheckingAuth)){
    return <PageLoader />;
  } 


  return (
    <ThemeProvider>
      <WallpaperProvider>
        <Routes>
          <Route path="/" element={isSignedIn ? <ChatPage /> : <Navigate to={"/auth"} replace />} />
          <Route path="/auth" element={!isSignedIn ? <AuthPage /> : <Navigate to={"/"} replace />}  />
        </Routes> 
        <Toaster />
      </WallpaperProvider>
    </ThemeProvider>
  )
}

export default App;
