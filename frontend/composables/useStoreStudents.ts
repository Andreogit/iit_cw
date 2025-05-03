import type { Student } from '~/models/student';
export const students = reactive({
    students: <Student[]> [],

    setStudents(students: Student[]) {
        this.students = students;
    },

    addStudent(student: Student) {
        this.students.push(student);
    },

    deleteStudent(id: number) {
        this.students = this.students.filter(student => student.id !== id);
    },

    updateStudent(student: Student) {
        const index = this.students.findIndex(s => s.id === student.id);
        if (index !== -1) {
            this.students[index] = student;
        }
    }
})