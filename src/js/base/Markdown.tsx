import { marked } from "marked";
import React from "react";
import styled from "styled-components";
import { NoneFound } from "./NoneFound";

const StyledMarkdown = styled.div`
    overflow-y: scroll;
    max-height: 375px;
    margin-bottom: 0;
    padding: 10px 15px;
`;

type MarkdownProps = {
    markdown?: string;
};

export function Markdown({ markdown = "" }: MarkdownProps) {
    if (markdown) {
        return <StyledMarkdown dangerouslySetInnerHTML={{ __html: marked(markdown) }} />;
    }

    return (
        <StyledMarkdown>
            <NoneFound noun="notes" />
        </StyledMarkdown>
    );
}
