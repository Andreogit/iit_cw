<script setup lang="ts">
useSeoMeta({
    title: 'Student management system'
});
</script>

<template>
    <div class="wrapper">
        <div class="content">
            <h1>{{ 'Student management system'.toUpperCase() }}</h1>
            <source srcset="~/assets/images/logo.png" type="image/png" />
            <img id="logo" src="~/assets/images/logo.png" class="logo" alt="Logo" width="80" height="80" />
            <NuxtLink v-if="store.token == ''" to="/auth">
                <button class="login-button">
                    Login
                </button>
            </NuxtLink>
            <NuxtLink v-if="store.token != ''" to="/dashboard">
                <button class="login-button">
                    Dashboard
                </button>
            </NuxtLink>
        </div>
    </div>
</template>
<style scoped>
.wrapper {
    margin-top: 60px;
    padding: 0 10px;
}

.content {
    padding: 20px;
    margin: 0 auto;
    max-width: 380px;
    gap: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-radius: 10px;
    background-color: var(--white);
}

h1 {
    font-size: 2rem;
}

.logo {
    border-radius: 50%;
}
</style>