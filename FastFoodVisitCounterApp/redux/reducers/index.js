

export default (state, action) => {
    switch (action.type){
        case "CREATE_USER": 
            console.log(state)
            return Object.assign({}, state, action.payload.newData); //better way        
            break;
        default:
            return state;
    }
}