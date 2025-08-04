import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useForgetPassword from "../hooks/useForgetPassword"; 
import { useSearchParams } from "react-router-dom";

const ResetPassword = () => {
    const {
        resetPasswordMutation: {
            mutate: resetPassword,
            isPending,
            isError,
            error,
        }
    } = useForgetPassword();

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [clientError, setClientError] = useState(null);

    const handleUpdatePassword = async () => {
        if (!token) {
            setClientError('Token required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setClientError("Passwords doesn't match");
            return;
        }
        
        await resetPassword({ token, newPassword }, {
            onSuccess: () => {
                navigate('/login', {
                    replace: true,
                    state: { pwdReset: 'New password have been successfully set' }
                })
            }
        });
    }

    return(
        <div>
            <h1>Reset your password</h1>
            <input 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border border-black"
                placeholder="Enter your new password"
            />
            <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border border-black"
                placeholder="Confirm your password"
            />
            {clientError && <p>{clientError}</p>}
            {isError && <p>{error.response?.data?.error || error.message}</p>}
            <button 
                onClick={handleUpdatePassword}
                disabled={isPending}
            >
                Update password
            </button>
        </div>
    );
}

export default ResetPassword