<script setup lang="ts">
import { useApi } from '#build/imports';
import type { Student } from '~/models/student';
import { students } from '#build/imports';
import { AxiosError } from 'axios';
const router = useRouter();
const error = ref<string>('');
const newStudent = ref<Student>({
    id: 0,
    name: '',
    age: 0,
    grade: 0
});

watch(() => [newStudent.value.name, newStudent.value.age, newStudent.value.grade], () => {
    error.value = '';
});

const { getStudents, deleteStudent, addStudent } = useApi();
const loadStudents = async() => {
    try {
        const response = await getStudents();
        if (response.status == 200) {
            console.log(response);
            const parsedData: any[] = response.data;
            console.log(parsedData);
            
            students.setStudents(parsedData.map((student: any) => ({ id: student.id, name: student.name, age: student.age, grade: student.grade })));
        } else {
            error.value = response.data?.error ?? 'Unknown error';
        }
    }
    catch (err) {
        if (err instanceof AxiosError) {
            error.value = err.response?.data.error.message ?? 'Unknown error';
            return;
        }
        error.value = err as string;
    }
}

const handleAddStudent = async () => {
    if (newStudent.value.name == '' || newStudent.value.age == 0 || newStudent.value.grade == 0) {
        error.value = 'All fields are required';
        return;
    }
    try {
        const response = await addStudent(newStudent.value);
        newStudent.value = { id: 0, name: '', age: 0, grade: 0 };
        console.log(response);
        if (response.status == 200 || response.status == 201) {
            await loadStudents();
        } else {
            error.value = response.data?.error ?? 'Unknown error';
        }
    }
    catch (err) {
        if (err instanceof AxiosError) {
            error.value = err.response?.data.error.message ?? 'Unknown error';
            return;
        }
        error.value = err as string;
    }
}

useSeoMeta({
    title: 'Dashboard'
})

onMounted(() => {
    if (store.token == '') {
        router.replace('/auth');
        return;
    }
    loadStudents();
})
</script>
<template>
    <div class="wrapper">
        <div class="container">
            <h1>Dashboard</h1>
            <div class="row">
                <div class="input-container">
                    <p>Student name</p>
                    <input v-model="newStudent.name" type="text" placeholder="Student name">
                </div>
                <div class="input-container">
                    <p>Age</p>
                <input v-model="newStudent.age" min="1" max="100" type="number" placeholder="Age">
                
            </div>
            <div class="input-container">
                <p>Grade</p>
            <input v-model="newStudent.grade" type="number" min="1" max="5" placeholder="Grade">

                </div>
                <button @click="handleAddStudent" class="add-button">Add</button>
            </div>
            <div class="error">{{ error }}</div>
            <StudentItem v-for="student in students.students" :key="student.id" :student="student" />
        </div>
    </div>
</template>
<style scoped>
.row {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin: 10px 0;
    flex-wrap: wrap;
    align-items: end;    
}

.input-container{
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 220px;
    gap: 10px;
}

input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    min-width: 150px;
}

.add-button {
    background-color: var(--primary);
    color: var(--white);
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.add-button:hover {
    background-color: var(--focused);
}

.wrapper {
    padding: 20px;
    width: 100%;
}

.container {
    background-color: var(--white);
    padding: 20px;
    margin: 0 auto;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
}

h1 {
    text-align: center;
    font-size: 1.5rem;
}
</style>