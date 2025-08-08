import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useAuthStore } from "@/store/useAuthStore";
import { nameValidator, passwordValidator } from "@/features/auth/inputValidator";
import useEditUser from "@/features/auth/hooks/useEditUser";
import { useGoogleAuth } from "@/features/auth/hooks/useGoogleAuth";
import { useAuthHandler } from "@/features/auth/hooks/useAuthHandler";

const ProfileSettings = () => { 
    const { user, setUser } = useAuthStore();
    const { logoutGoogle } = useGoogleAuth();
    const { userLogout } = useAuthHandler(); 

    const { 
        editUserMutation: {
            mutate: editUser,
            reset,
            isPending,
            isError,
            error,
            isSuccess,
        } 
    } = useEditUser();


    const isLocalUser = user.provider === 'local';

    const [name, setName] = useState('');
    const [nameError, setNameError] = useState(null);

    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [newPasswordError, setNewPasswordError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);

    const [currentEdit, setCurrentEdit] = useState(null);
    
    /**
     * ---------------------------------------------------------
     * NAME CHANGE HANDLER
     * ---------------------------------------------------------
     */
    const handleNameChange = async () => {
        reset();
        await editUser({ name }, {
            onSuccess: (data) => {
                setUser({ 
                    name: data.name,
                })
                setCurrentEdit(null);
            }
        });
    }

    /**
     * ---------------------------------------------------------
     * PASSWORD CHANGE HANDLER
     * ---------------------------------------------------------
     */
    const handlePasswordChange = async () => {
        reset();
        await editUser({ password, newPassword }, {
            onSuccess: () => {
                setCurrentEdit(null);
            }
        })
    }

    const handleLogout = () => {
        userLogout();
        if (!isLocalUser)
            logoutGoogle();
    }   

    /**
     * ---------------------------------------------------------
     * RESET MUTATION FLAGS AFTER SUCESS
     * ---------------------------------------------------------
     */
    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                reset();
            }, 5000)

            return () => clearTimeout(timer);
        }
    }, [isSuccess, reset]);

    /**
     * ---------------------------------------------------------
     * INPUT VALIDATORS
     * ---------------------------------------------------------
     */
    useEffect(() => {
        if (name) setNameError(nameValidator(name) || null)
    }, [name])

    useEffect(() => {
        if (isLocalUser && newPassword) setNewPasswordError((passwordValidator({ password: newPassword, isEnough: true, isStrong: true }) || null));
    }, [newPassword, isLocalUser])

    useEffect(() => {
        if (isLocalUser && confirmPassword && confirmPassword !== newPassword) 
            setConfirmPasswordError('Password do not match');
        else 
            setConfirmPasswordError(null);
    },[isLocalUser, confirmPassword, newPassword]);

    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                    <Link 
                        to='/'
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        aria-label="Go back"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Back</span>
                    </Link>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900">Profile Settings</h1>
                    <p className="mt-2 text-sm text-gray-600">Manage your account information and security</p>
                </div>

                {/* Name Section */}
                <div className="border border-gray-200 rounded-lg p-5">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            {currentEdit !== 'name' ? (
                                <div className="flex items-center justify-between">
                                    <p className="text-gray-900 font-medium">{user.name}</p>
                                </div>
                            ) : null}
                        </div>
                        {currentEdit !== 'name' ? (
                            <button
                                onClick={() => { setName(user.name || ''); setNameError(null); setCurrentEdit('name'); }}
                                className="inline-flex items-center justify-center h-9 px-3 rounded-md text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 transition-colors"
                                aria-label="Edit name"
                            >
                                ✏️ Edit
                            </button>
                        ) : null}
                    </div>

                    {currentEdit === 'name' && (
                        <div className="mt-4 space-y-3">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">👤</div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`appearance-none rounded-lg block w-full pl-10 pr-3 py-3 border ${nameError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} focus:outline-none focus:border-green-500 focus:ring-2 transition-colors duration-200 sm:text-sm`}
                                    placeholder="Your full name"
                                />
                            </div>
                            {(nameError || isError) && (
                                <p className="text-sm text-red-500">{nameError || error.response?.data?.error || 'Something went wrong'}</p>
                            )}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleNameChange}
                                    disabled={name.trim() === '' || nameError !== null || isPending}
                                    className={`inline-flex justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-md ${isPending || name.trim() === '' || nameError ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isPending ? 'Saving…' : 'Save'}
                                </button>
                                <button
                                    onClick={() => { setCurrentEdit(null); setName(''); setNameError(null); }}
                                    disabled={isPending}
                                    className={`inline-flex justify-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Password Section */}
                {isLocalUser && (
                    <div className="border border-gray-200 rounded-lg p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <p className="text-gray-500 text-sm">*********</p>
                            </div>
                            {currentEdit !== 'password' && (
                                <button
                                    onClick={() => { setCurrentEdit('password'); setPassword(''); setNewPassword(''); setConfirmPassword(''); setNewPasswordError(null); setConfirmPasswordError(null); setShowCurrentPassword(false); setShowNewPassword(false); setShowConfirmPassword(false); reset(); }}
                                    className="inline-flex items-center justify-center h-9 px-3 rounded-md text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 transition-colors"
                                    aria-label="Edit password"
                                >
                                    ✏️ Edit
                                </button>
                            )}
                        </div>

                        {currentEdit === 'password' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">🔒</div>
                                        <input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="appearance-none rounded-lg block w-full pl-10 pr-10 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 sm:text-sm"
                                            placeholder="Current password"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button type="button" onClick={() => setShowCurrentPassword(v => !v)} className="text-gray-500 hover:text-gray-700 focus:outline-none">{showCurrentPassword ? '👁️' : '👁️‍🗨️'}</button>
                                        </div>
                                    </div>
                                </div>
                                {(currentEdit === 'password' && isError) && (
                                    <p className="text-sm text-red-500">{error.response?.data?.error || 'Something went wrong'}</p>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">🔐</div>
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className={`appearance-none rounded-lg block w-full pl-10 pr-10 py-3 border ${newPasswordError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} focus:outline-none focus:border-green-500 focus:ring-2 transition-colors duration-200 sm:text-sm`}
                                            placeholder="Create a strong password"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button type="button" onClick={() => setShowNewPassword(v => !v)} className="text-gray-500 hover:text-gray-700 focus:outline-none">{showNewPassword ? '👁️' : '👁️‍🗨️'}</button>
                                        </div>
                                    </div>
                                    {newPasswordError && <p className="mt-1 text-xs text-red-500">{newPasswordError}</p>}
                                    {!newPasswordError && newPassword && (
                                        <p className="mt-1 text-xs text-green-600">
                                            Password strength: {newPassword.length >= 12 ? 'Strong 💪' : newPassword.length >= 8 ? 'Good ✅' : 'Weak ⚠️'}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">🔐</div>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`appearance-none rounded-lg block w-full pl-10 pr-10 py-3 border ${confirmPasswordError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} focus:outline-none focus:border-green-500 focus:ring-2 transition-colors duration-200 sm:text-sm`}
                                            placeholder="Confirm your new password"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button type="button" onClick={() => setShowConfirmPassword(v => !v)} className="text-gray-500 hover:text-gray-700 focus:outline-none">{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</button>
                                        </div>
                                    </div>
                                    {confirmPasswordError && <p className="mt-1 text-xs text-red-500">{confirmPasswordError}</p>}
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handlePasswordChange}
                                        disabled={!password || !newPassword || !confirmPassword || !!newPasswordError || !!confirmPasswordError || isPending}
                                        className={`inline-flex justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-md ${(!password || !newPassword || !confirmPassword || !!newPasswordError || !!confirmPasswordError || isPending) ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {isPending ? 'Saving…' : 'Save'}
                                    </button>
                                    <button
                                        onClick={() => { setCurrentEdit(null); setPassword(''); setNewPassword(''); setConfirmPassword(''); setNewPasswordError(null); setConfirmPasswordError(null); setShowCurrentPassword(false); setShowNewPassword(false); setShowConfirmPassword(false); reset(); }}
                                        disabled={isPending}
                                        className={`inline-flex justify-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {isSuccess && (
                    <p className="text-center text-green-600 text-sm">
                        Successfully saved changes
                    </p>
                )}

                {/* End actions */}
            </div>
        </div>
    );
}

export default ProfileSettings