import firebase from "firebase";
import {
  CLEAR_DATA,
  USERS_DATA_STATE_CHANGE,
  USERS_LIKES_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_STATE_CHANGE,
} from "../constants";

export function clearData() {
  return (dispatch) => {
    dispatch({ type: CLEAR_DATA })
  }
}

export function fetchUser() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((result) => {
        if (result.exists) {
          dispatch({ type: USER_STATE_CHANGE, currentUser: result.data() });
        } else {
          console.log("does not exist");
        }
      });
  };
}

export function fetchUserPosts() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then((result) => {
        let posts = result.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        dispatch({ type: USER_POSTS_STATE_CHANGE, posts });
      });
  };
}

export function fetchUserFollowing() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .onSnapshot((result) => {
        let following = result.docs.map((doc) =>
          doc.id
        );
        dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
        following.forEach(f => {
          dispatch(fetchUsersData(f, true))
        })
      });
  };
}


export function fetchUsersData(uid, getPosts) {
  return (dispatch, getState) => {
    const found = getState().usersState.users.some(el => el.uid === uid)
    if (!found) {
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then((result) => {
          if (result.exists) {
            let user = result.data();
            user.uid = result.id
            dispatch({ type: USERS_DATA_STATE_CHANGE, user });
          }
          else {
            console.log("does not exist");
          }
        });
      if (getPosts) {
        dispatch(fetchUsersFollowingPosts(uid));
      }
    }
  }
}

export function fetchUsersFollowingPosts(uid) {
  return (dispatch, getState) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then((result) => {
        const uid = result?.query._.C_.path.segments[1]
        const user = getState().usersState.users.find(el => el.uid === uid)
        let posts = result.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          user
        }));
        posts.forEach(post => {
          dispatch(fetchUsersFollowingLikes(uid, post.id))
        })
        dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid });
      });
  };
}

export function fetchUsersFollowingLikes(uid, postId) {
  return (dispatch, getState) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((result) => {
        const postId = result.ZE.path.segments[3];
        let currentUserLike = false;
        if (result.exists) {
          currentUserLike = true;
        }
        dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike })
      });
  };
}