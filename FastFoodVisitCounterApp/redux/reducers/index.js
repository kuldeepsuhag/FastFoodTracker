

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
            return {
                ...state,
                currentGoal: action.payload.currentGoal
            }
        case "UPDATE_HEIGHT":
            console.log(action.payload.updatedHeight)
            return {
                ...state,
                height: action.payload.updatedHeight
            }
        case "UPDATE_WEIGHT":
            console.log(action.payload.updatedWeight)
            return {
                ...state,
                weight: action.payload.updatedWeight
            }
        case "UPDATE_PATIENT":
            console.log(action.payload.updatedPatientID)
            return {
                ...state,
                PatientID: action.payload.updatedPatientID
            }
        case "UPDATE_DOCTOR":
            console.log(action.payload.updatedDoctorID)
            return {
                ...state,
                doctorId: action.payload.updatedDoctorID
            }
        default:
            return state;
    }
}