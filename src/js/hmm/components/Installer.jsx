import { get, replace } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { checkAdminRoleOrPermission } from "../../administration/utils";
import { Box, ExternalLink, Icon, ProgressBarAffixed } from "../../base";
import { installHMMs } from "../actions";
import { getTask } from "../selectors";
import InstallOption from "./InstallOption";

const HMMInstalling = styled(Box)`
    display: flex;
    justify-content: center;

    h3 {
        font-size: ${props => props.theme.fontSize.xl};
    }

    p {
        text-align: center;
        text-transform: capitalize;
    }
`;

const StyledHMMInstaller = styled(Box)`
    display: flex;
    justify-content: center;
    padding: 35px 0;

    h3 {
        font-size: ${props => props.theme.fontSize.xl};
        font-weight: 500;
        margin: 0 0 3px;
    }

    > i {
        font-size: 32px;
        margin: 3px 10px 0;
    }
`;

export const HMMInstaller = ({ installed, task }) => {
    if (task && !installed) {
        const progress = task.progress;
        const step = replace(task.step, "_", " ");

        return (
            <HMMInstalling>
                <ProgressBarAffixed color="blue" now={progress} />
                <div>
                    <h3>Installing</h3>
                    <p>{step}</p>
                </div>
            </HMMInstalling>
        );
    }

    return (
        <StyledHMMInstaller>
            <Icon name="info-circle" />
            <div>
                <h3>No HMM data available.</h3>
                <p>
                    You can download and install the official HMM data automatically from our
                    <ExternalLink href="https://github.com/virtool/virtool-hmm"> GitHub repository</ExternalLink>.
                </p>
                <InstallOption />
            </div>
        </StyledHMMInstaller>
    );
};

export const mapStateToProps = state => ({
    releaseId: get(state.hmms.status, "release.id"),
    installed: Boolean(state.hmms.status.installed),
    canInstall: checkAdminRoleOrPermission(state, "modify_hmm"),
    task: getTask(state)
});

export const mapDispatchToProps = dispatch => ({
    onInstall: releaseId => {
        dispatch(installHMMs(releaseId));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(HMMInstaller);
