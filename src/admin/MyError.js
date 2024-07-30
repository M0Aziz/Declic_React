import React, { useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import ErrorIcon from '@mui/icons-material/Report';
import HistoryIcon from '@mui/icons-material/History';
import { Title, useTranslate } from 'react-admin';
import { useNavigate, useLocation } from 'react-router-dom';

export const MyError = ({ error, resetErrorBoundary, errorInfo, ...rest }) => {
    const { pathname } = useLocation();
    const originalPathname = useRef(pathname);
    const history = useNavigate();

    // Effect that resets the error state whenever the location changes
    useEffect(() => {
        if (pathname !== originalPathname.current) {
            resetErrorBoundary();
        }
    }, [pathname, resetErrorBoundary]);

    const translate = useTranslate();
    return (
        <div className='container text-center mt-5 '>
            <Title  title="Error" />
            <h1 className='mt-5'><ErrorIcon style={{color:'#7447FF'}} /> Something Went Wrong </h1>
            <div className='mt-3 mb-4'>A client error occurred and your request couldn't be completed.</div>
            {process.env.NODE_ENV !== 'production' && (
                <details>
                    <h2>{translate(error.toString())}</h2>
                    <pre>{error.stack}</pre>
                </details>
            )}
            <div>
                <Button
                className='mb-4 mt-2'
                    variant="contained"
                    startIcon={<HistoryIcon />}
                    onClick={() => history(-1)}
                >
                    Go Back
                </Button>
            </div>

            <span className='fw-bold mt-5'> Personnalisé par Déclic</span>
        </div>
    );
};
