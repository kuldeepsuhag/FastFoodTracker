

export default (state, action) => {
    switch (action.type){
        case "CREATE_USER": 
            console.log(state)
            return Object.assign({}, state, action.payload.newData); //better way        
        case "LOGGED_IN": 
            console.log(state)
            return {
                state,
                isUser: action.payload.isUser.isUser
            }
        case "STEP_DATA":
            console.log(state)
            return {
                state,
                stepData: action.payload.stepData
            }
        default:
            return state;
    }
}