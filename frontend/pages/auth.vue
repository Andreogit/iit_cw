<script setup lang="ts">
import { AxiosError } from 'axios';

useSeoMeta({
    title: 'Login'
});

const router = useRouter();
const username = ref<string>('');
const password = ref<string>('');
const error = ref<string>('');

watch(() => username.value,() => {
        error.value = '';
    });

watch(() => password.value, () => {
    error.value = '';
});

const handleSubmit = async(event: any) => {
    event.preventDefault();
    error.value = '';
    const { login, addBearerToken } = useApi();

    try {
        const response = await login({ username: username.value, password: password.value });
        console.log("response: " + response);
        if(response.status == 200) {   
            const data = response.data;
            error.value = '';
            const token = response.data.accessToken;
            const refreshToken = response.data.refreshToken;
            console.log('token: ' + token);
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            addBearerToken(token);
            store.setToken(token);
            store.setUser(data.user);
            router.replace('/dashboard');
        }else{
            error.value = response.data?.error ?? 'Unknown error';
        }
    } 
    catch(err) {
        if(err instanceof AxiosError) {
            error.value = err.response?.data.error.message ?? 'Unknown error';
            return;
        }
        error.value = err as string;
    }
}

</script>

<template>
    <div class="auth-container">
        <h2>Sign In</h2>
        <form @submit.prevent="handleSubmit" >
            <div class="col">
                <label for="username">Username</label>
                <input v-model="username" type="username" id="username" name="username" placeholder="Enter your username" required>
            </div>
            <div class="col">
                <label for="password">Password</label>
                <input v-model="password" type="password" id="password" name="password" placeholder="Enter your password" required>
            </div>

            <button @click="handleSubmit">Log In</button>
            <p v-if="error" class="error">{{ error }}</p>
            <p class="signup-text">Don't have an account?
                <NuxtLink to="/register" class="signup-link">
                    Sign up
                </NuxtLink>
            </p>
        </form>
    </div>
</template>

<style scoped>

</style>