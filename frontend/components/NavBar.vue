<script setup lang="ts">
const handleLogout = async() => {
    const {signOut} = useApi();
    await signOut();
}   
</script>
<template>
    <div>
        <nav class="navbar">
            <NuxtLink id="logo-container" to="/">
                <picture>
                    <source srcset="~/assets/images/logo.png" type="image/png" />
                    <img id="logo" src="~/assets/images/logo.png" alt="Logo" width="50" height="50" />
                </picture>
            </NuxtLink>
            <div class="buttons-row">
                <NuxtLink v-if="store.token == ''" to="/auth">
                    <button class="login-button">
                        Login
                    </button>
                </NuxtLink>
                    <button @click="handleLogout" v-if="store.token != ''" class="logout-button">
                        Logout
                    </button>
            </div>
        </nav>
    </div>

</template>
<style scoped>

#logo{
    border-radius: 50%;
}

.buttons-row{
    display: flex;
    gap: 10px;
}

.navbar {
    height: 75px;
    background-color: var(--bodyBackground);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 0.5rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

</style>