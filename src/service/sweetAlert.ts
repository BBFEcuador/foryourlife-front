import type { ErrorApiResponse } from '@/models/ApiResponse';
import { AxiosError } from 'axios';
import Swal from 'sweetalert2';
export const showErrorToast = (a: AxiosError<ErrorApiResponse>) => {
    let message = 'Error';
    let text = ['Error del servidor'];
    if (a.response?.data?.message) {
        message = JSON.stringify(a.response?.data?.message);
        text = a.response?.data?.errors;
    }
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    //@ts-ignore
    Toast.fire({
        icon: 'error',
        title: message,
        text: text
    });
};

export const showErrorToastBlob = async (a: AxiosError<Blob>) => {
    let message = 'Error';
    let text = ['Error del servidor'];
    if (a) {
        let errorResponse = await a.response?.data.text();
        if (errorResponse) {
            let x = JSON.parse(errorResponse);
            message = x.message ?? message;
            text = x.errors ?? text;
        }
    }
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    //@ts-ignore
    Toast.fire({
        icon: 'error',
        title: message,
        text: text
    });
};

export const showSuccessToast = (message: string, text?:string) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon:'success',
        title: message,
        text: text
    });
}
