export const addUser = (newData) => ({
    type: "CREATE_USER",
    payload: {
        newData
    }
})