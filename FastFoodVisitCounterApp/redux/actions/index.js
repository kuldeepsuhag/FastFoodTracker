export const addUser = (newData) => ({
    type: "CREATE_USER",
    payload: {
        newData
    }
})

export const userData = (userDetails) => ({
    type: "USER_DATA",
    payload : {
        userDetails
    }
})

export const loggedIn = (isUser) => ({
    type: "LOGGED_IN",
    payload: {
        isUser
    }
})

export const stepData = (stepData) => ({
    type: "STEP_DATA",
    payload: {
        stepData
    }
})