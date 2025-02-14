import { map } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../app/theme";
import { Icon, InitialIcon, Label } from "../../base";
import { getAccountAdministratorRole, getAccountHandle } from "../selectors";
import Email from "./Email";
import ChangePassword from "./Password";

const AccountProfileGroups = styled.div`
    margin-top: 3px;

    ${Label} {
        text-transform: capitalize;

        &:not(:last-of-type) {
            margin-right: 3px;
        }
    }
`;

const AccountProfileHeader = styled.div`
    align-items: center;
    display: flex;
    margin-bottom: 15px;
    > div {
        flex: 2 0 auto;
        margin-left: 15px;

        h3 {
            align-items: center;
            display: flex;
            flex: 2 0 auto;
            font-size: ${getFontSize("xl")};
            font-weight: ${getFontWeight("thick")};
            line-height: 1.2;
            margin: 0;

            ${Label} {
                font-size: ${getFontSize("md")};
                margin-left: auto;
            }
        }
    }
`;

const AdministratorTag = styled(Label)`
    text-transform: capitalize;
`;

function AccountProfile({ handle, groups, administratorRole }) {
    const groupLabels = map(groups, ({ id, name }) => (
        <Label key={id}>
            <Icon name="users" /> {name}
        </Label>
    ));

    return (
        <>
            <AccountProfileHeader>
                <InitialIcon handle={handle} size="xxl" />
                <div>
                    <h3>
                        {handle}
                        {administratorRole && (
                            <AdministratorTag key="administrator" color="purple">
                                <Icon name="user-shield" /> {administratorRole} Administrator
                            </AdministratorTag>
                        )}
                    </h3>
                    <AccountProfileGroups>{groupLabels}</AccountProfileGroups>
                </div>
            </AccountProfileHeader>

            <Email />
            <ChangePassword />
        </>
    );
}

function mapStateToProps(state) {
    return {
        administratorRole: getAccountAdministratorRole(state),
        groups: state.account.groups,
        handle: getAccountHandle(state)
    };
}

export default connect(mapStateToProps)(AccountProfile);
