

export default (state, action) => {
    switch (action.type){
        case "CREATE_USER": 
            console.log(state)
            return Object.assign({}, state, action.payload.newData); //better way 
        case "USER_DATA": 
            console.log(state)
            return Object.assign({}, state, action.payload.userDetails); //better way
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
        case "CURRENT_GOAL":
            // console.log(state)
            // console.log("test", action.payload.currentGoal)
            return {
                state,
                userDetails: {
                ...state.userDetails,
                // state: {
                // ...state.userDetails.state,
                    currentGoal: action.payload.currentGoal
                }
            }
        default:
            return state;
    }
}