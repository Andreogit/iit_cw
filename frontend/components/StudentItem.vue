<script setup lang="ts">
import type { Student } from '~/models/student';
import { useApi } from '#build/imports';
// import type {Student} from '~/models/student';
const props = defineProps<{ student: Student }>();
// export default {
//     props: {
//         student: {
//             type: Student,
//             required: true
//         }
//     }
// }

const handleDeleteStudent = async (id: number) => {
    const { deleteStudent } = useApi();
    try {

        const response = await deleteStudent(id);
        if (response.status == 200) {
            console.log('deleted');
            students.deleteStudent(id);
        }
    }
    catch (err) {
        console.log(err);
    }
}

</script>
<template>
    <div class="student-item">
        <div class="row flex">
            <div class="flex">
                <h3>{{ props.student.name }}</h3>
                <div class="info row">
                        <p>Age: {{ props.student.age }}</p>
                        <p>Grade: {{ props.student.grade }}</p>
                </div>
            </div>
        </div>
        <button class="delete-button" @click="handleDeleteStudent(props.student.id)">Delete</button>
    </div>
</template>
<style>

.flex{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex: 1;
    gap: 10px;
}

.row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.delete-button {
    background-color: var(--red);
    border: none;
    color: var(--white);
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.delete-button:hover{
    background-color: var(--redHover);
}

.info {
    justify-content: space-between;
    gap: 20px;
}

.student-item {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: space-between;
    text-align: center;
    border: 1px solid #ccc;
    background-color: var(--white);
    padding: 8px;
    border-radius: 8px;
    margin-bottom: 16px;
}
</style>