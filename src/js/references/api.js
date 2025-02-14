import { Request } from "../app/request";

export function find({ term, page }) {
    return Request.get("/refs").query({ find: term, page });
}

export function get({ refId }) {
    return Request.get(`/refs/${refId}`);
}

export function create({ name, description, dataType, organism }) {
    return Request.post("/refs").send({
        name,
        description,
        data_type: dataType,
        organism,
    });
}

export function edit({ refId, update }) {
    return Request.patch(`/refs/${refId}`).send(update);
}

export function importReference({ name, description, fileId }) {
    return Request.post("/refs").send({
        name,
        description,
        import_from: fileId,
    });
}

export function cloneReference({ name, description, refId }) {
    return Request.post("/refs").send({
        name,
        description,
        clone_from: refId,
    });
}

export function remoteReference({ remote_from }) {
    return Request.post("/refs").send({ remote_from });
}

export function remove({ refId }) {
    return Request.delete(`/refs/${refId}`);
}

export function addUser({ refId, user }) {
    return Request.post(`/refs/${refId}/users`).send({ user_id: user });
}

export function editUser({ refId, userId, update }) {
    return Request.patch(`/refs/${refId}/users/${userId}`).send(update);
}

export function removeUser({ refId, userId }) {
    return Request.delete(`/refs/${refId}/users/${userId}`);
}

export function addGroup({ refId, group }) {
    return Request.post(`/refs/${refId}/groups`).send({ group_id: group });
}

export function editGroup({ refId, groupId, update }) {
    return Request.patch(`/refs/${refId}/groups/${groupId}`).send(update);
}

export function removeGroup({ refId, groupId }) {
    return Request.delete(`/refs/${refId}/groups/${groupId}`);
}

export function checkUpdates({ refId }) {
    return Request.get(`/refs/${refId}/release`);
}

export function updateRemote({ refId }) {
    return Request.post(`/refs/${refId}/updates`).send({});
}
