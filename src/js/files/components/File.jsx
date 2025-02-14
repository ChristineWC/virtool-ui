import { find } from "lodash-es";
import React, { useCallback } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../app/theme";
import { BoxSpaced, Icon, Loader, RelativeTime } from "../../base";
import { byteSize } from "../../utils/utils";

import { checkAdminRoleOrPermission } from "../../administration/utils";
import { removeFile } from "../actions";
import { getFilesById } from "../selectors";

const FileAttribution = styled.span`
    font-size: ${getFontSize("md")};
`;

const FileHeader = styled.h5`
    align-items: center;
    display: flex;
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};
    margin: 0 0 5px;
`;

const FileHeaderIcon = styled.div`
    margin-left: auto;
`;

export const File = ({ canRemove, id, name, ready, size, uploadedAt, user, onRemove }) => {
    const handleRemove = useCallback(() => onRemove(id), [id]);

    const attribution =
        user === null ? (
            <FileAttribution>
                Retrieved <RelativeTime time={uploadedAt} />
            </FileAttribution>
        ) : (
            <FileAttribution>
                Uploaded <RelativeTime time={uploadedAt} /> by {user.handle}
            </FileAttribution>
        );

    const right = ready ? (
        <FileHeaderIcon>
            <span>{byteSize(size)}</span>
            {canRemove && (
                <Icon name="trash" color="red" style={{ fontSize: "17px", marginLeft: "9px" }} onClick={handleRemove} />
            )}
        </FileHeaderIcon>
    ) : (
        <FileHeaderIcon>
            <Loader size="14px" />
        </FileHeaderIcon>
    );

    return (
        <BoxSpaced>
            <FileHeader>
                <span>{name}</span>
                {right}
            </FileHeader>

            {attribution}
        </BoxSpaced>
    );
};

export const mapStateToProps = (state, ownProps) => {
    const { id, name, uploaded_at, ready, size, user } = find(getFilesById(state), { id: ownProps.id });

    return {
        id,
        name,
        ready,
        size,
        user,
        canRemove: checkAdminRoleOrPermission(state, "remove_file"),
        uploadedAt: uploaded_at
    };
};

export const mapDispatchToProps = dispatch => ({
    onRemove: fileId => {
        dispatch(removeFile(fileId));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(File);
