import PropTypes from "prop-types";
import React, { useCallback } from "react";
import styled from "styled-components";
import { BoxGroupSection, Icon, InitialIcon } from "../../../base";

const StyledMemberItemIcon = styled.div`
    align-items: center;
    display: flex;
    padding-right: 8px;
`;

function MemberItemIcon({ handle }) {
    return (
        <StyledMemberItemIcon>
            <InitialIcon handle={handle} size="lg" />
        </StyledMemberItemIcon>
    );
}

const MemberItemIcons = styled.span`
    align-items: center;
    display: flex;
    margin-left: auto;

    i {
        margin-left: 5px;
    }
`;

const StyledMemberItem = styled(BoxGroupSection)`
    align-items: center;
    display: flex;
`;

function MemberItem({ canModify, id, handle, onEdit, onRemove }) {
    const displayName = handle || id;
    const handleEdit = useCallback(() => onEdit(id), [id]);
    const handleRemove = useCallback(() => onRemove(id), [id]);

    let icons;

    if (canModify) {
        icons = (
            <MemberItemIcons>
                <Icon name="edit" color="orange" tip="Modify" onClick={handleEdit} />
                <Icon name="trash" color="red" tip="Remove" onClick={handleRemove} />
            </MemberItemIcons>
        );
    }

    return (
        <StyledMemberItem>
            <MemberItemIcon handle={displayName} />
            {displayName}
            {icons}
        </StyledMemberItem>
    );
}

MemberItem.propTypes = {
    canModify: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    handle: PropTypes.string,
    onEdit: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired
};

export default MemberItem;
