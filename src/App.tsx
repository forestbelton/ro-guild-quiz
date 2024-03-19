import { Card, Col, Flex, Input, Row, Typography } from "antd";
import FlexSearch from "flexsearch";
import Papa from "papaparse";
import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const { Search } = Input;
const { Title } = Typography;

type Question = {
  question: string;
  answer: string;
};

const QUESTIONS = (
  Papa.parse(__RAW_QUESTIONS_CSV__, { header: true }).data as Question[]
).filter((q) => q.question !== "");

const QUESTION_INDEX = new FlexSearch.Index({ tokenize: "full" });
QUESTIONS.forEach((q, i) => {
  QUESTION_INDEX.add(i, q.question + " " + q.answer);
});

type MatchDropdownProps = {
  matches: Question[];
};

const MatchDropdown = ({ matches }: MatchDropdownProps) => {
  let contents: React.ReactNode = "No matches found.";
  if (matches.length > 0) {
    contents = matches.map(({ question, answer }, index) => (
      <Card key={index} style={{ width: "100%" }}>
        <Flex gap="small" vertical>
          <Row>
            <Col span={4}>
              <strong>Question:</strong>
            </Col>
            <Col span={20}>{question}</Col>
          </Row>
          <Row>
            <Col span={4}>
              <strong>Answer:</strong>
            </Col>
            <Col span={20}>{answer}</Col>
          </Row>
        </Flex>
      </Card>
    ));
  }

  return contents;
};

const App = () => {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<Question[]>(QUESTIONS);

  const updateSearch = useDebouncedCallback(() => {
    if (query.length === 0) {
      setMatches(QUESTIONS);
      return;
    }
    const queryMatches = QUESTION_INDEX.search(query).map(
      (id) => QUESTIONS[id as number]
    );
    setMatches(queryMatches);
  }, 250);

  const onChange = (newQuery: string) => {
    setQuery(newQuery.trim());
    updateSearch();
  };

  const appStyle: React.CSSProperties = {
    boxSizing: "border-box",
    margin: "0em auto",
    maxWidth: "920px",
    padding: "0 2rem",
    width: "100%",
  };

  return (
    <Flex gap="large" align="center" vertical style={appStyle}>
      <Title>Guild Quiz Search</Title>
      <Search
        placeholder="Search for a question"
        size="large"
        allowClear
        onChange={(ev) => onChange(ev.target.value)}
      />
      {matches !== null ? <MatchDropdown matches={matches} /> : null}
    </Flex>
  );
};

export default App;
