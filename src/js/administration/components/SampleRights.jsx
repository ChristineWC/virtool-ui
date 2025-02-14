import { includes, map } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { BoxGroup, BoxGroupHeader, BoxGroupSection, InputGroup, InputLabel, InputSelect, SelectBox } from "../../base";
import { updateSetting, updateSettings } from "../actions";

const rights = [
    { label: "None", value: "" },
    { label: "Read", value: "r" },
    { label: "Read & write", value: "rw" }
];

export const SampleRightsGroup = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: ${props => props.theme.gap.column};
`;

export const SampleRights = props => {
    const options = map(rights, (entry, index) => (
        <option key={index} value={entry.value}>
            {entry.label}
        </option>
    ));

    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2>Default Sample Rights</h2>
                <p>Set the method used to assign groups to new samples and the default rights.</p>
            </BoxGroupHeader>
            <BoxGroupSection>
                <label>Sample Group</label>
                <SampleRightsGroup>
                    <SelectBox
                        onClick={() => props.onChangeSampleGroup("none")}
                        active={props.sampleGroup === "none" ? true : ""}
                    >
                        <strong>None</strong>
                        <p>
                            Samples are assigned no group and only
                            <em> all users'</em> rights apply
                        </p>
                    </SelectBox>

                    <SelectBox
                        onClick={() => props.onChangeSampleGroup("force_choice")}
                        active={props.sampleGroup === "force_choice" ? true : ""}
                    >
                        <strong>Force choice</strong>
                        <p>Samples are automatically assigned the creating user's primary group</p>
                    </SelectBox>

                    <SelectBox
                        onClick={() => props.onChangeSampleGroup("users_primary_group")}
                        active={props.sampleGroup === "users_primary_group" ? true : ""}
                    >
                        <strong>User's primary group</strong>
                        <p>Samples are assigned by the user in the creation form</p>
                    </SelectBox>
                </SampleRightsGroup>

                <InputGroup>
                    <InputLabel>Group Rights</InputLabel>
                    <InputSelect value={props.group} onChange={e => props.onChangeRights("group", e.target.value)}>
                        {options}
                    </InputSelect>
                </InputGroup>

                <InputGroup>
                    <InputLabel>All Users' Rights</InputLabel>
                    <InputSelect
                        name="all"
                        value={props.all}
                        onChange={e => props.onChangeRights("all", e.target.value)}
                    >
                        {options}
                    </InputSelect>
                </InputGroup>
            </BoxGroupSection>
        </BoxGroup>
    );
};

export const mapStateToProps = state => {
    const settings = state.settings.data;

    return {
        sampleGroup: settings.sample_group,
        group: (settings.sample_group_read ? "r" : "") + (settings.sample_group_write ? "w" : ""),
        all: (settings.sample_all_read ? "r" : "") + (settings.sample_all_write ? "w" : "")
    };
};

export const mapDispatchToProps = dispatch => ({
    onChangeSampleGroup: value => {
        dispatch(updateSetting("sample_group", value));
    },

    onChangeRights: (scope, value) => {
        dispatch(
            updateSettings({
                [`sample_${scope}_read`]: includes(value, "r"),
                [`sample_${scope}_write`]: includes(value, "w")
            })
        );
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SampleRights);
