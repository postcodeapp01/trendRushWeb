const domainUrl = "http://localhost:3000";

export const apiUrls = {
    sendOtp: `${domainUrl}/user/auth/initiate`,
    validateOtp: `${domainUrl}/user/auth/verify`,
    register: `${domainUrl}/register`,
    getUserDetails: `${domainUrl}/user/profile`
};
