import { map, reject } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { pushState } from "../../../../app/actions";
import { BoxGroup, BoxGroupHeader, NoneFoundSection } from "../../../../base";
import { editReference } from "../../../actions";
import { checkReferenceRight } from "../../../selectors";
import AddTarget from "./Add";
import EditTarget from "./Edit";
import { TargetItem } from "./Item";

const TargetsHeader = styled(BoxGroupHeader)`
    h2 {
        display: flex;
        justify-content: space-between;
    }
`;

export class Targets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleRemove = name => {
        this.props.onRemove(this.props.refId, {
            targets: reject(this.props.targets, { name })
        });
    };

    render() {
        if (this.props.dataType !== "barcode") {
            return null;
        }

        const targetComponents = map(this.props.targets, target => (
            <TargetItem
                key={target.name}
                {...target}
                canModify={this.props.canModify}
                onEdit={this.props.onShowEdit}
                onRemove={this.handleRemove}
            />
        ));

        let addButton;
        let modals;

        if (this.props.canModify) {
            addButton = <Link to={{ state: { addTarget: true } }}>Add target</Link>;

            modals = (
                <>
                    <AddTarget />
                    <EditTarget />
                </>
            );
        }

        let noneFound;

        if (!targetComponents.length) {
            noneFound = <NoneFoundSection noun="targets" />;
        }

        return (
            <BoxGroup>
                <TargetsHeader>
                    <h2>
                        <span>Targets</span>
                        {addButton}
                    </h2>
                    <p>Manage the allowable sequence targets for this barcode reference.</p>
                </TargetsHeader>

                {noneFound}
                {targetComponents}
                {modals}
            </BoxGroup>
        );
    }
}

export const mapStateToProps = state => ({
    canModify: checkReferenceRight(state, "modify"),
    dataType: state.references.detail.data_type,
    refId: state.references.detail.id,
    targets: state.references.detail.targets
});

export const mapDispatchToProps = dispatch => ({
    onRemove: (refId, update) => {
        dispatch(editReference(refId, update));
    },
    onShowEdit: name => {
        dispatch(pushState({ editTarget: name }));
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(Targets);
