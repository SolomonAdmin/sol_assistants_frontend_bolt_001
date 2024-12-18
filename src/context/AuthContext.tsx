import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/AuthService';
import { WorkspaceService } from '../services/WorkspaceService';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  solomonConsumerKey: string | null;
  currentWorkspace: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  setWorkspace: (workspace: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [solomonConsumerKey, setSolomonConsumerKey] = useState<string | null>(null);
  const [currentWorkspace, setCurrentWorkspace] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = sessionStorage.getItem('accessToken');
      const workspace = sessionStorage.getItem('currentWorkspace');
      const consumerKey = sessionStorage.getItem('solomonConsumerKey');
      
      if (token && workspace && consumerKey) {
        try {
          // Verify the token is still valid
          const workspaceService = new WorkspaceService(token);
          await workspaceService.getWorkspaces();

          setIsAuthenticated(true);
          setAccessToken(token);
          setCurrentWorkspace(workspace);
          setSolomonConsumerKey(consumerKey);
        } catch (error) {
          // If token is invalid, clear everything
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('solomonConsumerKey');
          sessionStorage.removeItem('currentWorkspace');
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async (token: string) => {
    try {
      // Store token and set authentication state
      sessionStorage.setItem('accessToken', token);
      setAccessToken(token);

      // Initialize services
      const workspaceService = new WorkspaceService(token);

      // Get available workspaces
      const workspaces = await workspaceService.getWorkspaces();

      if (workspaces.length > 0) {
        // Set the first workspace as default
        const defaultWorkspace = workspaces[0];
        
        // Get the consumer key for the workspace
        const workspaceKey = await workspaceService.getWorkspaceKey(defaultWorkspace);

        if (workspaceKey) {
          sessionStorage.setItem('solomonConsumerKey', workspaceKey);
          sessionStorage.setItem('currentWorkspace', defaultWorkspace);
          setSolomonConsumerKey(workspaceKey);
          setCurrentWorkspace(defaultWorkspace);
          setIsAuthenticated(true);
        } else {
          throw new Error('No consumer key available for workspace');
        }
      } else {
        throw new Error('No workspaces available');
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Clean up if login fails
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('solomonConsumerKey');
      sessionStorage.removeItem('currentWorkspace');
      setIsAuthenticated(false);
      setAccessToken(null);
      setSolomonConsumerKey(null);
      setCurrentWorkspace(null);
      throw error;
    }
  };

  const setWorkspace = async (workspace: string) => {
    if (!accessToken) return;

    try {
      const workspaceService = new WorkspaceService(accessToken);
      const newConsumerKey = await workspaceService.getWorkspaceKey(workspace);
      
      if (newConsumerKey) {
        sessionStorage.setItem('solomonConsumerKey', newConsumerKey);
        sessionStorage.setItem('currentWorkspace', workspace);
        setSolomonConsumerKey(newConsumerKey);
        setCurrentWorkspace(workspace);
      } else {
        throw new Error('No consumer key available for workspace');
      }
    } catch (error) {
      console.error('Error setting workspace:', error);
      throw error;
    }
  };

  const logout = async () => {
    const authService = new AuthService();
    if (accessToken) {
      try {
        await authService.logout(accessToken);
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('solomonConsumerKey');
    sessionStorage.removeItem('currentWorkspace');
    
    setIsAuthenticated(false);
    setAccessToken(null);
    setSolomonConsumerKey(null);
    setCurrentWorkspace(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        accessToken, 
        solomonConsumerKey, 
        currentWorkspace,
        login, 
        logout,
        setWorkspace 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}