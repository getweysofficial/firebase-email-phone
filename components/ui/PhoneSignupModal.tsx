import { useEffect, useState } from 'react';
import Modal from './Modal';
import { useAppDispatch } from '../redux/store';
import LoadingButton from './LoadingButton';
import LoginWithGoogleButton from './LoginWithGoogleButton';
import Input from './Input';
import {
    sendVerificationCode,
    useSendVerificationCodeLoading,
    useVerifyPhoneNumberLoading,
} from '../redux/auth/verifyPhoneNumber';
import { RecaptchaVerifier } from 'firebase/auth';
import { firebaseAuth } from '../firebase/firebaseAuth';
import { showToast } from '../redux/toast/toastSlice';
import { useRouter } from 'next/router';

interface PhoneSignupModalProps {
    open: boolean;
    setPhoneRegistrationOpen: (show: boolean) => void;
    setShowEmailRegistration: (show: boolean) => void;
}
const PhoneSignupModal = (props: PhoneSignupModalProps) => {
    const dispatch = useAppDispatch();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<any>(null);
    const [OTPCode, setOTPCode] = useState('');
    const [recaptcha, setRecaptcha] = useState<RecaptchaVerifier | null>(null);
    const [recaptchaResolved, setRecaptchaResolved] = useState(false);
    const [showOTPVerification, setShowOTPVerification] = useState(false);
    const sendVerificationLoading = useSendVerificationCodeLoading();
    const verifyPhoneNumberLoading = useVerifyPhoneNumberLoading();
    const [disableSubmit, setDisableSubmit] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (phoneNumber.length >= 10) {
            setDisableSubmit(false);
        } else {
            setDisableSubmit(true);
        }
    }, [phoneNumber]);

    // generating the recaptcha on page render
    useEffect(() => {
        if (showOTPVerification) return;
        const captcha = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
            size: 'normal',
            callback: () => {
                setRecaptchaResolved(true);
            },

            'expired-callback': () => {
                setRecaptchaResolved(false);
                dispatch(
                    showToast({
                        message: 'Recaptcha Expired, please verify it again',
                        type: 'info',
                    })
                );
            },
        });

        captcha.render();

        setRecaptcha(captcha);
    }, []);

    const handleSendVerification = async () => {
        dispatch(
            sendVerificationCode({
                phoneNumber,
                auth: null,
                recaptcha,
                recaptchaResolved,
                callback: (result) => {
                    if (result.type === 'error') {
                        setRecaptchaResolved(false);
                        return;
                    }
                    setConfirmationResult(result.confirmationResult);
                    setShowOTPVerification(true);
                },
            })
        );
    };
    // Validating the filled OTP by user
    const ValidateOtp = async () => {
        confirmationResult.confirm(OTPCode).then((result: any) => {
            if (result.user) {
                router.push('/');
            }
        });
    };

    return (
        <Modal show={props.open} setShow={props.setPhoneRegistrationOpen}>
            <div className="max-w-md w-full bg-white py-6 rounded-lg">
                <h2 className="text-lg font-semibold text-center mb-10">Sign Up</h2>
                <div className="px-4 flex p-4 pb-10 gap-4 flex-col">
                    {!showOTPVerification ? (
                        <>
                            <Input
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="phone number"
                                type="text"
                            />
                            <LoadingButton
                                onClick={handleSendVerification}
                                loading={sendVerificationLoading}
                                loadingText="Sending OTP"
                                disabled={disableSubmit}
                            >
                                Sign Up
                            </LoadingButton>
                            <div id="recaptcha-container" />
                        </>
                    ) : (
                        <>
                            <h2 className="text-lg font-semibold text-center mb-10">
                                Enter Code to Verify
                            </h2>
                            <>
                                <Input
                                    value={OTPCode}
                                    type="text"
                                    placeholder="Enter your OTP"
                                    onChange={(e) => setOTPCode(e.target.value)}
                                />

                                <LoadingButton
                                    onClick={ValidateOtp}
                                    loading={verifyPhoneNumberLoading}
                                    loadingText="Verifying..."
                                >
                                    Verify
                                </LoadingButton>
                            </>
                        </>
                    )}

                    <Modal show={false} setShow={setShowOTPVerification}>
                        <div className="max-w-xl w-full bg-white py-6 rounded-lg">
                            <h2 className="text-lg font-semibold text-center mb-10">
                                Enter Code to Verify
                            </h2>
                            <div className="px-4 flex items-center gap-4 pb-10">
                                <Input
                                    value={OTPCode}
                                    type="text"
                                    placeholder="Enter your OTP"
                                    onChange={(e) => setOTPCode(e.target.value)}
                                />

                                <LoadingButton
                                    onClick={ValidateOtp}
                                    loading={verifyPhoneNumberLoading}
                                    loadingText="Verifying..."
                                >
                                    Verify
                                </LoadingButton>
                            </div>
                        </div>
                    </Modal>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Or sign up with</span>
                        </div>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-3">
                        <LoginWithGoogleButton />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Or sign up with</span>
                        </div>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-3">
                        <div className="flex justify-center">
                            <div className="relative flex justify-center text-sm">
                                <div
                                    onClick={() => {
                                        props.setPhoneRegistrationOpen(false);
                                        props.setShowEmailRegistration(true);
                                    }}
                                    className="ml-2 cursor-pointer font-medium text-violet-600 hover:text-violet-400"
                                >
                                    Email Address
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PhoneSignupModal;
