import { useState } from "react";
import validate from 'validator';
import useForgetPassword from "../hooks/useForgetPassword";

const ForgetPassword = () => {
    const {
        forgetPasswordMutation: {
            mutate: forgetPassword,
            isPending,
            isError,
            error,
            isSuccess
        }
    } = useForgetPassword();

    const [email, setEmail] = useState('');
    const [clientError, setClientError] = useState(null);

    const handleForgetPassword = () => {
        setClientError(null);

        if(!validate.isEmail(email)) {
            setClientError("Your email is invalid");
            return;
        }
    
        forgetPassword(email);
    }

    return(
        <div>
            <h1>Enter your email</h1>
            <input 
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-black"
                placeholder="Please enter your email"
            />
            <button 
                onClick={handleForgetPassword}
                disabled={isPending}
            >
                Enter email
            </button>
            {clientError && <p>{clientError}</p>}
            {isError && <p>{error.response?.data?.error || error.message}</p>}
            {isSuccess && <p>A message has been sent to your email</p>}
        </div>
    );
}

export default ForgetPassword