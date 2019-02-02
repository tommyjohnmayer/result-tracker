import React from "react";
import { shallow } from "enzyme";
import Competitors from "./index";
import { COMPETITOR } from "../App";

describe("Meets.js tests", () => {
  let app;
  let props;
  const mockSelectEntity = jest.fn();
  const mockAddEntity = jest.fn();

  beforeEach(() => {
    props = {
      competitors: [
        { id: "1", name: "Joe Jones", division: "U18 Boys" },
        { id: "2", name: "Karl Karlson", division: "U18 Boys" },
        { id: "3", name: "Dave Davidson", division: "U18 Boys" }
      ],
      selected: {},
      selectEntity: mockSelectEntity,
      addEntity: mockAddEntity
    };
    app = shallow(<Competitors {...props} />);
  });

  it("renders without crashing", () => {});

  it("calls selectEntity when first competitor is clicked", () => {
    const firstCompetitor = app.find(".competitor-selector").first();
    firstCompetitor.simulate("click");
    expect(mockSelectEntity).toHaveBeenCalledWith(COMPETITOR, "1");
  });

  it("does not call addEntity when competitor name is empty", () => {
    const newCompetitorDivision = app.find(
      "FormControl.new-competitor-division"
    );
    newCompetitorDivision.value = "U18 Boys";
    newCompetitorDivision.simulate("change", {
      target: {
        value: "U18 Boys",
        name: "division",
        dataset: { object: "newCompetitor" }
      }
    });
    const newCompetitorForm = app.find("form.new-competitor");
    newCompetitorForm.simulate("submit", { preventDefault: () => {} });
    expect(mockAddEntity).not.toHaveBeenCalled();
  });

  it("calls addEntity when form is filled and submitted", () => {
    const newCompetitorName = app.find("FormControl.new-competitor-name");
    newCompetitorName.value = "New Name";
    newCompetitorName.simulate("change", {
      target: {
        value: "New Name",
        name: "name",
        dataset: { object: "newCompetitor" }
      }
    });
    const newCompetitorDivision = app.find(
      "FormControl.new-competitor-division"
    );
    newCompetitorDivision.value = "U18 Boys";
    newCompetitorDivision.simulate("change", {
      target: {
        value: "U18 Boys",
        name: "division",
        dataset: { object: "newCompetitor" }
      }
    });
    const newCompetitorForm = app.find("form.new-competitor");
    newCompetitorForm.simulate("submit", { preventDefault: () => {} });
    expect(mockAddEntity).toHaveBeenCalledWith(COMPETITOR, {
      division: "U18 Boys",
      name: "New Name"
    });
  });
});
