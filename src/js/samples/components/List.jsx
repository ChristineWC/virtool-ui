import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getAccountId } from "../../account/selectors";
import QuickAnalysis from "../../analyses/components/Create/Quick";
import { Badge, LoadingPlaceholder, NoneFoundBox, ScrollList, ViewHeader, ViewHeaderTitle } from "../../base";
import { findHmms } from "../../hmm/actions";
import { listReadyIndexes } from "../../indexes/actions";
import { listLabels } from "../../labels/actions";
import { findSamples } from "../actions";
import { SampleFilters } from "./Filter/Filters";
import SampleItem from "./Item/Item";
import SampleToolbar from "./Toolbar";
import SampleLabels from "./Sidebar/ManageLabels";
import { useLocation } from "react-router-dom";

const SamplesListHeader = styled.div`
    grid-column: 1;
`;

const SamplesListContent = styled.div`
    grid-row: 2;
    min-width: 550px;
`;

const StyledSamplesList = styled.div`
    display: grid;
    grid-column-gap: ${props => props.theme.gap.column};
    grid-template-columns: minmax(auto, 1150px) max(320px, 10%);
`;

export const SamplesList = ({
    documents,
    loading,
    page,
    pageCount,
    totalCount,
    onFindSamples,
    onFindOther,
    selected
}) => {
    useEffect(onFindOther, [null]);

    const { search } = useLocation();
    useEffect(() => {
        onFindSamples(1);
    }, [search]);

    if (loading) {
        return <LoadingPlaceholder />;
    }

    let noneFound;

    if (!documents.length) {
        noneFound = <NoneFoundBox key="noSample" noun="samples" />;
    }

    return (
        <>
            <QuickAnalysis />
            <StyledSamplesList>
                <SamplesListHeader>
                    <ViewHeader title="Samples">
                        <ViewHeaderTitle>
                            Samples <Badge>{totalCount}</Badge>
                        </ViewHeaderTitle>
                    </ViewHeader>
                    <SampleToolbar />
                </SamplesListHeader>
                <SamplesListContent>
                    {noneFound || (
                        <ScrollList
                            documents={documents}
                            page={page}
                            pageCount={pageCount}
                            onLoadNextPage={page => onFindSamples(page)}
                            renderRow={index => <SampleItem key={documents[index].id} id={documents[index].id} />}
                        />
                    )}
                </SamplesListContent>
                {selected.length ? <SampleLabels /> : <SampleFilters />}
            </StyledSamplesList>
        </>
    );
};

export const mapStateToProps = state => {
    const loading =
        state.hmms.documents === null ||
        state.samples.documents === null ||
        state.samples.readyIndexes === null ||
        state.labels.documents === null;

    const { documents, page, page_count, selected, total_count } = state.samples;

    return {
        documents,
        loading,
        userId: getAccountId(state),
        page,
        pageCount: page_count,
        selected,
        totalCount: total_count
    };
};

export const mapDispatchToProps = dispatch => ({
    onFindSamples: page => {
        dispatch(findSamples({ page }));
    },

    onFindOther: () => {
        dispatch(findHmms("", 1));
        dispatch(listLabels());
        dispatch(listReadyIndexes());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SamplesList);
