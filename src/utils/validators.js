export const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidCity = str => /^[A-Za-z]+$/.test(str);
