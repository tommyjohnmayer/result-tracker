import React from "react";
import { mount } from "enzyme";
import App from "./App";
import Meets from "./meets/index";
import Competitors from "./competitors/index";
import Meet from "./meet/index";
import Competitor from "./competitor/index";

describe("App.js tests", () => {
  let app;
  let props;

  beforeEach(() => {
    props = {};
    app = mount(<App {...props} />);
  });

  it("renders without crashing", () => {});

  it("renders Meets", () => {
    const meets = app.find(Meets);
    expect(meets.length).toBe(1);
  });

  it("does not initially render Meet", () => {
    const meet = app.find(Meet);
    expect(meet.length).toBe(0);
  });

  it("renders Meet after first item in Meets is selected", () => {
    const meets = app.find(Meets);
    const firstMeet = meets.find('.meet-selector').first();
    firstMeet.simulate('click');
    const meet = app.find(Meet);
    expect(meet.length).toBe(1);
  });

  it("renders Competitors", () => {
    const meets = app.find(Competitors);
    expect(meets.length).toBe(1);
  });

  it("does not initially render Competitor", () => {
    const competitor = app.find(Competitor);
    expect(competitor.length).toBe(0);
  });

  it("renders Competitor after first item in Competitors in selected", () => {
    const competitors = app.find(Competitors);
    const firstCompetitor = competitors.find('.competitor-selector').first();
    firstCompetitor.simulate('click');
    const competitor = app.find(Competitor);
    expect(competitor.length).toBe(1);
  });
});
