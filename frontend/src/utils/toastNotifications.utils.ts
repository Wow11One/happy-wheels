import { CheckCirlceIcon } from '../components/Icons';
import { toast, Slide } from 'react-toastify';


// Reusable toast notification functions
const toastNotifications = {
    info: (message: string) => {
        toast.info(message, {
            transition: Slide,
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
                backgroundColor: 'white',
                color: 'blue',
            },
        });
    },

    success: (message: string) => {
        toast.success(message, {
            transition: Slide,
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
                backgroundColor: '#006352',
                color: 'white',
                border: '2px solid white',
            },
            icon: CheckCirlceIcon,
        });
    },

    error: (message: string) => {
        toast.error(message, {
            transition: Slide,
            position: "top-right", 
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
                backgroundColor: '#dc2626',
                color: 'white',
                border: '2px solid white',
            }
        });
    },
};

export default toastNotifications;
