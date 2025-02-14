import { put, takeEvery, takeLatest, throttle } from "redux-saga/effects";
import { pushState } from "../app/actions";
import { CREATE_FIRST_USER, CREATE_USER, EDIT_USER, FIND_USERS, GET_USER } from "../app/actionTypes";
import { apiCall, pushFindTerm } from "../utils/sagas";
import * as usersAPI from "./api";

function* findUsers(action) {
    yield apiCall(usersAPI.find, action.payload, FIND_USERS);
    yield pushFindTerm(action.payload.term);
}

function* getUser(action) {
    yield apiCall(usersAPI.get, action.payload, GET_USER);
}

function* createUser(action) {
    const resp = yield apiCall(usersAPI.create, action.payload, CREATE_USER);
    if (resp.ok) {
        yield put(pushState({ createUser: false }));
    }
}

function* createFirstUser(action) {
    yield apiCall(usersAPI.createFirst, action.payload, CREATE_FIRST_USER);
}

function* editUser(action) {
    yield apiCall(usersAPI.edit, action.payload, EDIT_USER);
}

export function* watchUsers() {
    yield takeLatest(FIND_USERS.REQUESTED, findUsers);
    yield takeEvery(GET_USER.REQUESTED, getUser);
    yield throttle(200, CREATE_USER.REQUESTED, createUser);
    yield takeEvery(EDIT_USER.REQUESTED, editUser);
    yield takeLatest(CREATE_FIRST_USER.REQUESTED, createFirstUser);
}
