<script setup lang="ts">
const router = useRouter();
const { addBearerToken } = useApi();
const startUp = async () => {
  const token = await localStorage.getItem('token');
  const refreshToken = await localStorage.getItem('refreshToken');
  console.log(token);
  if (token == undefined || token == 'undefined' || token == null || refreshToken == undefined || refreshToken == null) {
    return;
  }
  if (token && refreshToken) {
    store.setToken(token);
    store.setRefreshToken(refreshToken);
    addBearerToken(token);
    router.replace('/dashboard');
  }
}
onMounted(async () => {
  await startUp();
});
</script>

<template>
  <div id="main-container">
    <NavBar />
    <div class="content">
      <NuxtPage></NuxtPage>
    </div>
  </div>
</template>

<style scoped>
.content {
  width: 100%;
  margin: 0 auto;
  max-width: 1000px;
}

#main-container {
  width: 100%;
  overflow-x: hidden;
}
</style>
