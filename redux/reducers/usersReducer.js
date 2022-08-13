import {
    USERS_DATA_STATE_CHANGE,
    USERS_POSTS_STATE_CHANGE,
    CLEAR_DATA,
    USERS_LIKES_STATE_CHANGE
} from "../constants";

const initialState = {
    users: [],
    feed: [],
    usersLoaded: 0
};

export const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case USERS_DATA_STATE_CHANGE:
            return {
                ...state,
                users: [...state.users, action.user],
            };
        case USERS_POSTS_STATE_CHANGE:
            return {
                ...state,
                usersLoaded: state.usersLoaded + 1,
                feed: [...state.feed, action.posts]
            };

        case USERS_LIKES_STATE_CHANGE:
            return {
                ...state,
                feed: state.feed.map(post => post.id == action.postId
                    ? { ...post, currentUserLike: action.currentUserLike }
                    : post
                )
            };

        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
};
