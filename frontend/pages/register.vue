<script setup lang="ts">
import { AxiosError } from 'axios';
import type { User } from '~/models/user';

const error = ref<string>('');
const username = ref<string>('');
const password = ref<string>('');
const router = useRouter();

useSeoMeta({
    title: 'Sign up'
});

const handleSubmit = async (event: any) => {
    event.preventDefault();
    error.value = '';
    const { signUp, handleApiError } = useApi();

    try {
        const response = await signUp({ username: username.value, password: password.value } as User);
        if(response.status == 200) {   
            const data = response.data;
            error.value = '';
            username.value = '';
            password.value = '';
            router.replace('/auth');
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
};
</script>
<template>
    <div class="auth-container">
        <h2>Register</h2>
        <form @submit.prevent="handleSubmit">
            <div class="col">
                <label for="username">Username</label>
                <input v-model="username" type="username" id="username" name="username"
                    placeholder="Enter your username" required>
            </div>
            <div class="col">
                <label for="password">Password</label>
                <input v-model="password" type="password" id="password" name="password"
                    placeholder="Enter your password" required>
            </div>

            <button @click="handleSubmit">Log In</button>
            <p v-if="error" class="error">{{ error }}</p>
            <p class="signup-text">Have an account?
                <NuxtLink to="/register" class="signup-link">
                     Login
                </NuxtLink>
            </p>
        </form>
    </div>
</template>
<style></style>