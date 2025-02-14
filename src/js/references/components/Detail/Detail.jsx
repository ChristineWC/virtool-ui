import { get } from "lodash-es";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { LoadingPlaceholder, ContainerNarrow, NotFound } from "../../../base";
import IndexDetail from "../../../indexes/components/Detail";
import Indexes from "../../../indexes/components/Indexes";
import OTUDetail from "../../../otus/components/Detail/Detail";
import OTUList from "../../../otus/components/List";
import { getReference } from "../../actions";
import { checkReferenceRight } from "../../selectors";
import EditReference from "./Edit";
import ReferenceDetailHeader from "./Header";
import ReferenceManage from "./Manage";
import ReferenceSettings from "./Settings";
import ReferenceDetailTabs from "./Tabs";

const ReferenceDetail = ({ error, id, match, onGetReference }) => {
    const matchId = match.params.refId;

    useEffect(() => onGetReference(matchId), [matchId]);

    if (error) {
        return <NotFound />;
    }

    if (!id || id !== matchId) {
        return <LoadingPlaceholder />;
    }

    return (
        <>
            <Switch>
                <Route path="/refs/:refId/otus/:otuId" />
                <Route path="/refs">
                    <ReferenceDetailHeader />
                    <ReferenceDetailTabs />
                </Route>
            </Switch>

            <ContainerNarrow>
                <Switch>
                    <Redirect from="/refs/:refId" to={`/refs/${id}/manage`} exact />
                    <Route path="/refs/:refId/manage" component={ReferenceManage} />
                    <Route path="/refs/:refId/otus" component={OTUList} exact />
                    <Route path="/refs/:refId/otus/:otuId" component={OTUDetail} />
                    <Route path="/refs/:refId/indexes" component={Indexes} exact />
                    <Route path="/refs/:refId/indexes/:indexId" component={IndexDetail} />
                    <Route path="/refs/:refId/settings" component={ReferenceSettings} />
                </Switch>
            </ContainerNarrow>

            <EditReference />
        </>
    );
};

const mapStateToProps = state => ({
    canModify: checkReferenceRight(state, "modify"),
    error: get(state, "errors.GET_REFERENCE_ERROR", null),
    id: get(state, "references.detail.id"),
    pathname: state.router.location.pathname
});

const mapDispatchToProps = dispatch => ({
    onGetReference: refId => {
        dispatch(getReference(refId));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ReferenceDetail);
