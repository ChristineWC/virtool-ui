import React, { useCallback } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Button, LinkButton, InputSearch, Toolbar } from "../../../base";
import { setAnalysisSortKey, setSearchIds, toggleFilterORFs, toggleFilterSequences } from "../../actions";
import { getFuse, getResults } from "../../selectors";
import { AnalysisViewerSort } from "../Viewer/Sort";
import { map } from "lodash-es";

const StyledNuVsToolbar = styled(Toolbar)`
    margin-bottom: 10px;
`;

const NuVsToolbar = ({
    filterORFs,
    filterSequences,
    fuse,
    id,
    sortKey,
    onFilterSequences,
    onFilterORFs,
    onSearch,
    onSelect
}) => {
    const handleChange = useCallback(
        e => {
            onSearch(e.target.value, fuse);
        },
        [id]
    );

    return (
        <StyledNuVsToolbar>
            <InputSearch onChange={handleChange} onKeyDown={e => e.stopPropagation()} placeholder="Name or family" />
            <AnalysisViewerSort workflow="nuvs" sortKey={sortKey} onSelect={onSelect} />
            <Button
                icon="filter"
                onClick={onFilterSequences}
                active={filterSequences}
                tip="Hide sequences that have no HMM hits"
            >
                Filter Sequences
            </Button>
            <Button icon="filter" onClick={onFilterORFs} active={filterORFs} tip="Hide ORFs that have no HMM hits">
                Filter ORFs
            </Button>
            <LinkButton to={{ state: { export: true } }} tip="Export">
                Export
            </LinkButton>
        </StyledNuVsToolbar>
    );
};

const mapStateToProps = state => {
    const { detail, filterORFs, filterSequences, sortKey } = state.analyses;

    return {
        id: detail.id,
        fuse: getFuse(state),
        results: getResults(state),
        filterORFs,
        filterSequences,
        sortKey
    };
};

const mapDispatchToProps = dispatch => ({
    onFilterSequences: () => {
        dispatch(toggleFilterSequences());
    },
    onFilterORFs: () => {
        dispatch(toggleFilterORFs());
    },
    onSearch: (term, fuse) => {
        const searchIds = map(fuse.search(term), hit => hit.item.id);
        dispatch(setSearchIds(searchIds.length ? searchIds : null));
    },
    onSelect: sortKey => {
        dispatch(setAnalysisSortKey(sortKey));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(NuVsToolbar);
