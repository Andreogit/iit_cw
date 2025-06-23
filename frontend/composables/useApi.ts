import axios, { AxiosError } from 'axios'
import { store } from './useStoreUser'
import type { Student } from '~/models/student';
import type { User } from '~/models/user';


export const useApi = () => {
  const config = useRuntimeConfig()
  console.log(config.public);
  console.log('runtimeConfig.public.baseURL:', config.public.baseURL)
  console.log(process.env.BASE_URL);
  console.log(process.env.NUXT_PUBLIC_BASE_URL);
  let isRefreshing = false;
  const baseURL = config.public.baseURL ?? process.env.BASE_URL ?? '16.171.152.197'

  const api = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${store.token}`
    }
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      return handleApiError(error);
    }
  );

  api.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${store.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  )

  const addBearerToken = (token: string) => {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  const signOut = async()=> {
      store.setToken('');
      store.setRefreshToken('');
      await localStorage.removeItem('token');
      await localStorage.removeItem('refreshToken');
      store.setUser({username:'', password:''} as User);
      const router = useRouter();
      router.replace('/auth');
  };
  const signUp = async (user: User) => await api.post('/signup', user);
  const login = async (credentials: { username: string; password: string }) => await api.post('/login', credentials);
  const getStudents = async() => await api.get('/students');
  const addStudent = async (student: Student) => await api.post('/add', student);
  const deleteStudent = async (id: number) => await api.delete(`/delete/${id}`);

  const handleApiError = async (error: AxiosError): Promise<string> => {
    if (error.response) {
      const { status, data } = error.response;

      if (error.response && error.response.status === 401 && !isRefreshing) {
        isRefreshing = true;
        const originalRequest = error.config;
        const refreshToken = store.refreshToken;
        try{
          const { data } = await api.post('/refresh', { refreshToken });
          store.setToken(data.accessToken);
          originalRequest!.headers.Authorization = `Bearer ${data.accessToken}`;
        } catch (error) {
        }finally{
          isRefreshing = false;
        }

        return Promise.reject(error);
      }

      let errorMessage = '';
      let msg = (data as { message: string })?.message ?? '';
      switch (status) {
        case 400:
          console.error('Bad Request:', data);
          errorMessage = `Bad Request: ${msg ?? data}`;
        case 401:
          console.error('Unauthorized');
          errorMessage = `Unauthorized`;
        case 403:
          console.error('Forbidden:', data || 'Access denied.');
          errorMessage = `Forbidden: ${msg ?? data}`;
        case 404:
          console.error('Not Found:', data || 'Resource not found.');
          errorMessage = `Not Found: ${msg ?? data}`;
        case 500:
          console.error('Server Error:', data || 'An error occurred on the server.');
          errorMessage = `Server Error: ${msg ?? data}`;
        default:
          console.error('API Error:', data);
          errorMessage = `API Error: ${msg ?? data}`;
      }
      throw errorMessage;
    } else if (error.request) {
      throw 'No response from server. Please try again later.';
    } else {
      throw 'Request error: ' + error.message;
    }
  };

  return { getStudents, login, signUp, addStudent, deleteStudent, handleApiError, signOut, addBearerToken };
}
