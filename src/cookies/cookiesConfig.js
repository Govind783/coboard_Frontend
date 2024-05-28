import { setCookie } from 'cookies-next';
import { getCookie } from 'cookies-next';
import { hasCookie } from 'cookies-next';
import { deleteCookie } from 'cookies-next';
import { useEffect } from 'react';
// has cookie se we can check if the cookie exists. and no need to use getCookie. has cookie would return a boolean


export const setCookiesNext = (name, value) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 20); // expire after 20  dqys

    return setCookie(name, value, { expires: expirationDate, sameSite: 'None', secure: true });
}

export const getCookiesNext = (name) => {
    return getCookie(name);
}

export const hasCookiesNext = (name) => {
    return hasCookie(name);
}

export const deletCookiesNext = (name) => {
    return deleteCookie(name)
}

export const deleteCookiesAndLocalStorageUniversalFN = (...args) => {
    args.forEach((arg) => {
        if (typeof window !== 'undefined') {
            if (hasCookie(arg)) {
                deletCookiesNext(arg);
            }
            if (localStorage.getItem(arg)) {
                removeItemLocalStorageFunction(arg);
            }
        }
    })
}

export const setLocalStorageFunction = (name, value, expirationDays) => {
    const now = new Date();
    const expirationDate = new Date(now.getTime() + expirationDays * 24 * 60 * 60 * 1000); // 20 days expirey 

    const item = {
        value: JSON.stringify(value),
        expiration: expirationDate.getTime(),
    };

    localStorage.setItem(name, JSON.stringify(item));
}


export const removeItemLocalStorageFunction = (name) => {
    return localStorage.removeItem(name);
}


export const getLocalStorageFunction = (name) => {

    if (typeof window !== 'undefined') {
        const item = JSON.parse(localStorage.getItem(name));

        if (!item) {
            return null;
        }

        const now = new Date().getTime();

        if (now > item.expiration) {
            localStorage.removeItem(name); // Remove the expired item
            return null;
        }

        return JSON.parse(item.value);

    }

}