import { reactive } from 'vue';
import type { User } from '~/models/user';
export const store = reactive({
    token: '',
    refreshToken: '',
    user: <User> {},

    setRefreshToken (refreshToken: string) {
        this.refreshToken = refreshToken;
    },

    setToken (token: string) {
        this.token = token;
    },

    setUser (user: User) {
        this.user = user;
    }
},);