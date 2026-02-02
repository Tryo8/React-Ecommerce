

import { toast } from "sonner";

export function errorToast(err, message) {
    if (err.name === "CanceledError") return;
    toast.error(err.response?.data?.message || 
        err.status === 401 && 'You Are Unauthorized' || 
        err.status === 403 && 'You Are Forbidden' || 
        err.status === 409 && "This already was set" ||
        err.status === 500 && 'Something went wrong, Try Again later' 
        ||
        err.status === 404 && "Not found, Try again later" 
        ||
        message
        || "Something went wrong, Try again later");
};