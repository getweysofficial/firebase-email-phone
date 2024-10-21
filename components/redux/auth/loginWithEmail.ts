import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    EmailAuthProvider,
    createUserWithEmailAndPassword,
    linkWithCredential,
} from 'firebase/auth';
import { firebaseAuth } from '@/components/firebase/firebaseAuth';
import { getFriendlyMessageFromFirebaseErrorCode } from './helpers';
import { showToast } from '../toast/toastSlice';
import isEmail from 'validator/lib/isEmail';
import { useAppSelector } from '../store';

export const loginWithEmail = createAsyncThunk(
    'login',
    async (
        args: {
            type: 'login' | 'sign-up' | 'link-email';
            email: string;
            password: string;
            callback?: (
                args:
                    | { type: 'success'; linkResponse: any }
                    | {
                          type: 'error';
                          message: string;
                      }
            ) => void;
        },
        { dispatch }
    ) => {
        try {
            if (!isEmail(args.email)) {
                dispatch(
                    showToast({
                        message: 'Enter a valid email',
                        type: 'info',
                    })
                );
                return;
            }
            if (args.password.length < 6) {
                dispatch(
                    showToast({
                        message: 'Password should be atleast 6 characters',
                        type: 'info',
                    })
                );
                return;
            }

            if (args.type === 'sign-up') {
                await createUserWithEmailAndPassword(firebaseAuth, args.email, args.password);
            } else if (args.type === 'link-email' && firebaseAuth.currentUser) {
                const credential = EmailAuthProvider.credential(args.email, args.password);
                const linkResponse = await linkWithCredential(firebaseAuth.currentUser, credential);
                dispatch(
                    showToast({
                        message: 'Email linked successfully',
                        type: 'success',
                    })
                );
                if (args.callback) {
                    args.callback({
                        type: 'success',
                        linkResponse,
                    });
                }
            }
        } catch (e: any) {
            dispatch(
                showToast({
                    message: getFriendlyMessageFromFirebaseErrorCode(e.code),
                    type: 'error',
                })
            );
        }
    }
);

export const useIsLoginWithEmailLoading = () => {
    const loading = useAppSelector((state) => state.loading.loginWithEmail);
    return loading;
};
