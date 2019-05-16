export const addUser = (newData) => ({
    type: "CREATE_USER",
    payload: {
        newData
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