

export default (state, action) => {
    switch (action.type){
        case "CREATE_USER": 
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
            return {
                ...state,
                stepData: action.payload.stepData
            }
        case "CURRENT_GOAL":
            console.log(state)
            console.log(action.payload.currentGoal)
            var userDetails = state.state;
            return {
                ...state,
                currentGoal: action.payload.currentGoal
            }
        default:
            return state;
    }
}