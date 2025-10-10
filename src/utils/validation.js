import validator from 'validator';

validateSignupData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if(!firstName || !lastName || !email || !password) {
        throw new Error('All fields are required');
    }
    if(!validator.isEmail(email)) {
        throw new Error('Invalid email format');
    }
    if(!validator.isStrongPassword(password)) {
        throw new Error('Password is not strong enough');
    }
}

validateEditProfileData = (req) => {
    const allowedEditFields = ['firstName', 'lastName', 'age', 'emailId', 
        'gender', 'about', 'photoUrl', 'skills'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedEditFields.includes(update));

    return isValidOperation;
}

export { validateSignupData, validateEditProfileData };
