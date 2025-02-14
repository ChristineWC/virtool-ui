import { map, sortBy } from "lodash-es";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { AdministratorPermissions, hasSufficientAdminRole } from "../../../administration/utils";
import { BoxGroup, Checkbox, SelectBoxGroupSection } from "../../../base";
import { getAccountAdministratorRole } from "../../selectors";

export const APIPermissions = ({ administrator_role, className, userPermissions, keyPermissions, onChange }) => {
    const permissions = map(keyPermissions, (value, key) => ({
        name: key,
        allowed: value,
    }));

    const rowComponents = map(sortBy(permissions, "name"), permission => {
        const disabled =
            !hasSufficientAdminRole(AdministratorPermissions[permission.name], administrator_role) &&
            !userPermissions[permission.name];

        return (
            <SelectBoxGroupSection
                key={permission.name}
                active={permission.allowed}
                onClick={disabled ? null : () => onChange(permission.name, !permission.allowed)}
                disabled={disabled}
            >
                <Checkbox checked={permission.allowed} />
                <code>{permission.name}</code>
            </SelectBoxGroupSection>
        );
    });

    return <BoxGroup className={className}>{rowComponents}</BoxGroup>;
};

APIPermissions.propTypes = {
    administrator_role: PropTypes.string,
    userPermissions: PropTypes.object.isRequired,
    keyPermissions: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
};

const mapStateToProps = state => ({
    administrator_role: getAccountAdministratorRole(state),
    userPermissions: state.account.permissions,
});

export default connect(mapStateToProps)(APIPermissions);
