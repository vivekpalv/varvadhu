export const usernameGenerator = (name: string, mobile: number): string => {
    const date: Date = new Date();
    const timestamp: number = date.getTime();
    const last4Mobile: string = mobile.toString().slice(-4);
    const safeName: string = name.replace(/\s+/g, '').toLocaleLowerCase();
    const uniqueName: string = `${safeName}_${timestamp}_${last4Mobile}`;
    return uniqueName;
}

export const otpGenerator = (digit: number): number => {
    const otp: number = Math.floor(Math.random() * 10 ** digit);
    // return otp; // for production
    return 1234; // for development
}